const OrderReview = require('../models/OrderReview');

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const { name, product, rating, text } = req.body;
        if (!name || !product || !rating || !text) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const review = new OrderReview({
            user: req.user._id,
            name,
            product,
            rating,
            text
        });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await OrderReview.find().sort({ date: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get reviews by product
exports.getReviewsByProduct = async (req, res) => {
    try {
        const { product } = req.params;
        const reviews = await OrderReview.find({ product }).sort({ date: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// (Optional) Delete a review (admin or owner only)
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await OrderReview.findById(id);
        if (!review) return res.status(404).json({ message: 'Review not found.' });
        // Only allow owner to delete
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized.' });
        }
        await review.deleteOne();
        res.json({ message: 'Review deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
}; 