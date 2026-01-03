import mongoose from 'mongoose';

const confessionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500
    },
    
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    color: { 
        type: String,
        default: 'blue'
    },
    university: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


confessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 });
confessionSchema.index({ university: 1 });

const Confession = mongoose.model('Confession', confessionSchema);

export default Confession;
