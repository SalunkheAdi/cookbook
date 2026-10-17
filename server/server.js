const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

const app = express();

// Allow all origins with credentials
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ensure DB is connected before processing any API requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection middleware error:', err);
        res.status(500).json({ message: 'Database connection error' });
    }
});

const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');
const mealPlansRoutes = require('./routes/mealPlans');
const adminRoutes = require('./routes/admin');
const friendsRoutes = require('./routes/friends');
const groupsRoutes = require('./routes/groups');
const activityRoutes = require('./routes/activity');
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Mount routes on /api/*
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/thoughts', thoughtRoutes);
app.use('/api/meal-plans', mealPlansRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Also mount on root /* so requests succeed even if /api is omitted in VITE_API_URL
app.use('/recipes', recipeRoutes);
app.use('/auth', authRoutes);
app.use('/thoughts', thoughtRoutes);
app.use('/meal-plans', mealPlansRoutes);
app.use('/admin', adminRoutes);
app.use('/friends', friendsRoutes);
app.use('/groups', groupsRoutes);
app.use('/activity', activityRoutes);
app.use('/ai', aiRoutes);
app.use('/users', userRoutes);
app.use('/notifications', notificationRoutes);

// Health check endpoint
app.get('/', (req, res) => res.json({ message: 'CookBook API is running' }));

// Only start listening in non-serverless environments (local dev)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

module.exports = app;
