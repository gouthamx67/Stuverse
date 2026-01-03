import LostItem from '../models/LostItem.js';

export const getLostItems = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        let query = { status: 'Open' };

        
        if (req.user && req.user.university && req.user.university !== 'Unspecified') {
            query.university = req.user.university;
        }

        
        if (lat && lng) {
            query.geometry = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: (parseFloat(radius) || 5) * 1000 
                }
            };
        }

        const items = await LostItem.find(query)
            .populate('user', 'name email avatar')
            .sort({ date: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createLostItem = async (req, res) => {
    const { title, description, location, date, type, coordinates } = req.body;
    let image = req.body.image;

    if (req.file) {
        image = req.file.path;
    }

    try {
        let parsedCoordinates = coordinates;
        if (typeof coordinates === 'string') {
            try {
                parsedCoordinates = JSON.parse(coordinates);
            } catch (e) {
                console.error("Error parsing coordinates", e);
            }
        }

        
        let geometry = undefined;
        if (parsedCoordinates && parsedCoordinates.lat && parsedCoordinates.lng) {
            geometry = {
                type: 'Point',
                coordinates: [parsedCoordinates.lng, parsedCoordinates.lat]
            };
        }

        const item = new LostItem({
            user: req.user._id,
            title,
            description,
            location,
            date,
            type,
            coordinates: parsedCoordinates,
            geometry, 

            image,
            university: req.user.university || 'Unspecified'
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const resolveLostItem = async (req, res) => {
    try {
        const item = await LostItem.findById(req.params.id);

        if (item) {
            if (item.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            item.status = 'Resolved';
            await item.save();
            res.json({ message: 'Item marked as resolved' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
