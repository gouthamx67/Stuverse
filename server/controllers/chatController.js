import Message from '../models/Message.js';
import User from '../models/User.js';



export const sendMessage = async (req, res) => {
    const { recipientId, content } = req.body;

    try {
        const message = await Message.create({
            sender: req.user._id,
            recipient: recipientId,
            content,
        });

        
        const fullMessage = await Message.findOne({ _id: message._id })
            .populate('sender', 'name avatar')
            .populate('recipient', 'name avatar');

        res.status(201).json(fullMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user._id },
            ],
        })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 }); 

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getConversations = async (req, res) => {
    try {
        
        
        const messages = await Message.find({
            $or: [{ sender: req.user._id }, { recipient: req.user._id }]
        }).sort({ createdAt: -1 });

        const userIds = new Set();
        const conversations = [];

        for (const msg of messages) {
            const otherUserId = msg.sender.toString() === req.user._id.toString()
                ? msg.recipient.toString()
                : msg.sender.toString();

            if (!userIds.has(otherUserId)) {
                userIds.add(otherUserId);
                
                const user = await User.findById(otherUserId).select('name avatar');
                if (user) {
                    conversations.push({
                        user,
                        lastMessage: msg.content,
                        date: msg.createdAt
                    });
                }
            }
        }
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
