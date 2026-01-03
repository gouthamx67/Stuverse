import Ride from '../models/Ride.js';
import { createNotification } from './notificationController.js';


export const getRides = async (req, res) => {
    try {
        const { type, destination } = req.query;
        let query = { status: 'Open', date: { $gte: new Date() } }; 

        if (type) query.type = type;

        
        if (destination) {
            query['destination.name'] = { $regex: destination, $options: 'i' };
        }

        
        if (req.user && req.user.university && req.user.university !== 'Unspecified') {
            query.university = req.user.university;
        }

        const rides = await Ride.find(query)
            .populate('host', 'name avatar university')
            .populate('participants.user', 'name avatar')
            .sort({ date: 1 }); 

        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRide = async (req, res) => {
    const {
        type,
        originName, originLat, originLng,
        destName, destLat, destLng,
        date,
        time, 
        seats,
        price,
        vehicle,
        description
    } = req.body;

    try {
        
        const fullDate = new Date(`${date}T${time}`);

        const ride = new Ride({
            host: req.user._id,
            type,
            origin: {
                name: originName,
                geometry: { type: 'Point', coordinates: [parseFloat(originLng), parseFloat(originLat)] }
            },
            destination: {
                name: destName,
                geometry: { type: 'Point', coordinates: [parseFloat(destLng), parseFloat(destLat)] }
            },
            date: fullDate,
            seats: parseInt(seats),
            price: Number(price),
            vehicle,
            description,
            vehicle,
            description,
            participants: [],
            university: req.user.university || 'Unspecified'
        });

        const createdRide = await ride.save();
        res.status(201).json(createdRide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const joinRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate('destination', 'name'); 

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.status !== 'Open') {
            return res.status(400).json({ message: 'Ride is not open' });
        }

        if (ride.host.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot join your own ride' });
        }

        
        const isParticipant = ride.participants.some(p => p.user.toString() === req.user._id.toString());
        if (isParticipant) {
            return res.status(400).json({ message: 'You already joined this ride' });
        }

        
        if (ride.participants.length >= ride.seats) {
            return res.status(400).json({ message: 'Ride is full' });
        }

        ride.participants.push({ user: req.user._id });

        if (ride.participants.length >= ride.seats) {
            ride.status = 'Full';
        }

        await ride.save();

        
        try {
            await createNotification(
                ride.host,
                'RIDE_JOIN',
                `${req.user.name} joined your ride to ${ride.destination.name}`,
                ride._id,
                '/rides',
                req.user._id
            );
        } catch (notifError) {
            console.error("Notification trigger failed", notifError);
        }

        
        const updatedRide = await Ride.findById(req.params.id)
            .populate('host', 'name avatar')
            .populate('participants.user', 'name avatar');

        res.json(updatedRide);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const leaveRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        
        ride.participants = ride.participants.filter(p => p.user.toString() !== req.user._id.toString());

        
        if (ride.status === 'Full' && ride.participants.length < ride.seats) {
            ride.status = 'Open';
        }

        await ride.save();
        res.json({ message: 'Left ride successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
