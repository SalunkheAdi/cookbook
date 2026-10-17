const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

const app = express();

// Allow all origins with credentials for simplicity and reliability across Vercel deployments
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ensure DB is connected before processing any API requests (critical for serverless cold starts)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection middleware error:', err);
        res.status(500).json({ message: 'Database connection error' });
    }
});

app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/thoughts', require('./routes/thoughtRoutes'));
app.use('/api/meal-plans', require('./routes/mealPlans'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check endpoint
app.get('/', (req, res) => res.json({ message: 'CookBook API is running' }));

// Only start listening in non-serverless environments (local dev)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

module.exports = app;
