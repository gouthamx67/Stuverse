import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('sender', 'name avatar');

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createNotification = async (recipientId, type, message, relatedId = null, link = '', senderId = null) => {
    try {
        await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            message,
            relatedId,
            link
        });
    } catch (error) {
        console.error("Notification creation failed:", error);
    }
};
