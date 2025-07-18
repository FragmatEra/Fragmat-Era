const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/auth');

router.get('/', auth, cartController.getCart);
router.post('/add', auth, cartController.addToCart);
router.delete('/remove', auth, cartController.removeFromCart);
router.put('/update', auth, cartController.updateQuantity);

module.exports = router; 