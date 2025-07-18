const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/orderReviewController');
const auth = require('../middlewares/auth');

// Create review (no auth required)
router.post('/', reviewController.createReview);
// Get all reviews
router.get('/', reviewController.getAllReviews);
// Get reviews by product
router.get('/:product', reviewController.getReviewsByProduct);
// Delete review (auth required)
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router; 