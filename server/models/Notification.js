import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['MESSAGE', 'RIDE_JOIN', 'RIDE_LEAVE', 'LOST_MATCH', 'SYSTEM'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedId: { 
        type: mongoose.Schema.Types.ObjectId
    },
    link: { 
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
