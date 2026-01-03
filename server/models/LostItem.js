import mongoose from 'mongoose';

const lostItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    university: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: ['Lost', 'Found'],
        required: true,
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Open', 'Resolved'],
        default: 'Open',
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], 
            index: '2dsphere'
        }
    }
}, {
    timestamps: true,
});

lostItemSchema.index({ geometry: '2dsphere' });
lostItemSchema.index({ university: 1 });

const LostItem = mongoose.model('LostItem', lostItemSchema);

export default LostItem;
