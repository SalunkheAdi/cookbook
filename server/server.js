const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// CORS: allow the frontend origin (set FRONTEND_URL env var on Vercel, e.g. https://your-app.vercel.app)
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
