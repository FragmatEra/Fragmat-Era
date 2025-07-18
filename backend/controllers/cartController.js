const Cart = require('../models/Cart');

// Get current user's cart
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
        res.json(cart.items);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { name, price } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
        const existing = cart.items.find(item => item.name === name);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.items.push({ name, price, quantity: 1 });
        }
        await cart.save();
        res.json(cart.items);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { name } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found.' });
        cart.items = cart.items.filter(item => item.name !== name);
        await cart.save();
        res.json(cart.items);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Update item quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { name, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found.' });
        const item = cart.items.find(item => item.name === name);
        if (!item) return res.status(404).json({ message: 'Item not found.' });
        item.quantity = quantity;
        await cart.save();
        res.json(cart.items);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
}; 