import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    university: {
        type: String,
        required: true
    },
    
    type: {
        type: String,
        enum: ['Offer', 'Request'],
        default: 'Request'
    },
    origin: {
        name: { type: String, required: true },
        geometry: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true } 
        }
    },
    destination: {
        name: { type: String, required: true },
        geometry: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true } 
        }
    },
    date: {
        type: Date,
        required: true,
    },
    seats: {
        type: Number, 
        required: true,
        default: 1
    },
    price: {
        type: Number, 
        default: 0
    },
    vehicle: {
        type: String, 
    },
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now }
    }],
    status: {
        type: String,
        enum: ['Open', 'Full', 'Completed', 'Cancelled'],
        default: 'Open'
    },
    description: {
        type: String,
    }
}, {
    timestamps: true,
});

rideSchema.index({ 'origin.geometry': '2dsphere' });
rideSchema.index({ 'destination.geometry': '2dsphere' });

rideSchema.index({ university: 1 });

const Ride = mongoose.model('Ride', rideSchema);

export default Ride;
