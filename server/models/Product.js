import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
        required: true,
    },
    type: {
        type: String,
        enum: ['Sale', 'Swap', 'Both'],
        required: true,
    },
    images: [
        {
            type: String,
        },
    ],
    status: {
        type: String,
        enum: ['Available', 'Sold', 'Swapped'],
        default: 'Available',
    },
    university: {
        type: String, 
        required: true
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, {
    timestamps: true,
});

productSchema.index({ university: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
