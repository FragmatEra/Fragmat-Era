const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ['GET',"POST","PUT","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
}))

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/review', reviewRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running!' });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fragmetera';
mongoose.connect(MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});
