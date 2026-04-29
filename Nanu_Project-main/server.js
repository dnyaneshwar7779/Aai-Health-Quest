const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/database');
const { User, Workout, Quest, UserQuest, Leaderboard, Redemption, Message } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Routes
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const questRoutes = require('./routes/questRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const redemptionRoutes = require('./routes/redemptionRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/redemptions', redemptionRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', message: 'Aai Health Quest API is running' });
});

// Database Sync & Server Start
const startServer = async () => {
    try {
        await connectDB();

        // Keep schema aligned in development without dropping data.
        await sequelize.sync({ alter: true, force: false });
        console.log('Database synced successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
