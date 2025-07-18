const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/orderReviewController');
const auth = require('../middlewares/auth');

// Create review (auth required)
router.post('/', auth, reviewController.createReview);
// Get all reviews
router.get('/', reviewController.getAllReviews);
// Get reviews by product
router.get('/:product', reviewController.getReviewsByProduct);
// Delete review (auth required)
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router; 