import Review from '../models/Review.js';




export const createReview = async (req, res) => {
    const { rating, comment } = req.body;

    try {
        const review = await Review.create({
            user: req.user._id,
            product: req.params.id, 
            rating,
            comment,
        });

        
        const fullReview = await Review.findById(review._id).populate('user', 'name avatar');

        res.status(201).json(fullReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.id })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
