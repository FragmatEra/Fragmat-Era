const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

router.post('/checkout', auth, orderController.checkout);

module.exports = router; 