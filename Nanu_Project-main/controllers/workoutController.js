const { Workout, User, Leaderboard } = require('../models');

const calculateXP = (duration, calories, steps) => {
    let xp = 0;
    if (duration) xp += Math.floor(duration / 10) * 10; // 10 XP per 10 mins
    if (calories) xp += Math.floor(calories / 10);     // 1 XP per 10 cals
    if (steps) xp += Math.floor(steps / 100);          // 1 XP per 100 steps
    return xp;
};

const createWorkout = async (req, res) => {
    try {
        const { workout_type, duration, calories_burned, steps_count, date } = req.body;
        const userId = req.user.id;

        const xp_earned = calculateXP(duration, calories_burned, steps_count);

        const workout = await Workout.create({
            user_id: userId,
            workout_type,
            duration,
            calories_burned,
            steps_count,
            xp_earned,
            date
        });

        // Update User XP and Level
        const user = await User.findByPk(userId);
        const oldLevel = user.current_level;
        user.total_xp += xp_earned;

        // Level logic: 500 XP per level
        const newLevel = Math.floor(user.total_xp / 500) + 1;
        user.current_level = newLevel;

        // Earn Health Points: 1 HP per 10 XP
        const hp_earned = Math.floor(xp_earned / 10);
        user.health_points += hp_earned;

        await user.save();

        // Update Leaderboard
        const [leaderboard, created] = await Leaderboard.findOrCreate({
            where: { user_id: userId },
            defaults: {
                username: user.username,
                total_xp: user.total_xp,
                current_level: user.current_level
            }
        });

        if (!created) {
            leaderboard.total_xp = user.total_xp;
            leaderboard.current_level = user.current_level;
            // Note: quests_completed is handled by questController, we just update XP/Level here
            await leaderboard.save();
        }

        res.status(201).json({
            message: 'Workout logged successfully',
            workout,
            xp_earned,
            hp_earned,
            levelUp: newLevel > oldLevel,
            newLevel
        });
    } catch (error) {
        console.error('Workout log error:', error);
        res.status(500).json({ message: 'Server error logging workout' });
    }
};

const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.findAll({
            where: { user_id: req.user.id },
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving workouts' });
    }
};

const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        // Note: In a real system, we might want to deduct XP, but workouts are usually "earned"
        await workout.destroy();
        res.json({ message: 'Workout record deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting workout' });
    }
};

module.exports = {
    createWorkout,
    getWorkouts,
    deleteWorkout
};
