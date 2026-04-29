const { Leaderboard, User, Workout } = require('../models');

const getLeaderboard = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role: 'user' },
            attributes: ['id', 'username', 'total_xp', 'current_level', 'fitness_goal'],
            order: [
                ['total_xp', 'DESC'],
                ['current_level', 'DESC'],
                ['username', 'ASC']
            ],
            limit: 50
        });

        const userIds = users.map((user) => user.id);
        const ratingEntries = userIds.length > 0
            ? await Leaderboard.findAll({ where: { user_id: userIds } })
            : [];
        const ratingMap = new Map(ratingEntries.map((entry) => [entry.user_id, entry.rating || 0]));

        const workoutCounts = await Promise.all(
            users.map(async (user) => {
                const count = await Workout.count({ where: { user_id: user.id } });
                return { userId: user.id, count };
            })
        );
        const workoutMap = new Map(workoutCounts.map((item) => [item.userId, item.count]));

        const rankedLeaderboard = users.map((user, index) => ({
            user_id: user.id,
            username: user.username,
            total_xp: user.total_xp,
            current_level: user.current_level,
            fitness_goal: user.fitness_goal,
            workouts_completed: workoutMap.get(user.id) || 0,
            rating: ratingMap.get(user.id) || 0,
            rank: index + 1
        }));

        res.json(rankedLeaderboard);
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        res.status(500).json({ message: 'Server error retrieving leaderboard' });
    }
};

const submitRating = async (req, res) => {
    try {
        const { rating } = req.body;
        const userId = req.user.id;

        const [entry, created] = await Leaderboard.findOrCreate({
            where: { user_id: userId },
            defaults: {
                username: req.user.username,
                total_xp: 0,
                current_level: 1,
                rating,
                is_approved: false
            }
        });

        if (!created) {
            entry.rating = rating;
            entry.is_approved = false; // Require re-approval on change
            await entry.save();
        }

        res.json({ message: 'Rating submitted for admin approval' });
    } catch (error) {
        res.status(500).json({ message: 'Server error submitting rating' });
    }
};

module.exports = {
    getLeaderboard,
    submitRating
};
