import Confession from '../models/Confession.js';

export const getConfessions = async (req, res) => {
    try {
        
        
        
        let query = {};
        if (req.user && req.user.university && req.user.university !== 'Unspecified') {
            query.university = req.user.university;
        }

        const confessions = await Confession.find(query)
            .select('-author') 
            .sort({ createdAt: -1 });

        res.json(confessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createConfession = async (req, res) => {
    const { content, color } = req.body;

    try {
        const confession = new Confession({
            content,
            color: color || 'blue',
            color: color || 'blue',
            author: req.user._id, 
            university: req.user.university || 'Unspecified'
        });

        const createdConfession = await confession.save();

        
        const result = createdConfession.toObject();
        delete result.author;

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const likeConfession = async (req, res) => {
    try {
        const confession = await Confession.findById(req.params.id);

        if (!confession) return res.status(404).json({ message: 'Confession not found' });

        
        const index = confession.likes.indexOf(req.user._id);
        if (index === -1) {
            confession.likes.push(req.user._id);
        } else {
            confession.likes.splice(index, 1);
        }

        await confession.save();

        
        const result = confession.toObject();
        delete result.author;

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
