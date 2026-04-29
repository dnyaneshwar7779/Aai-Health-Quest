const { Quest, User, Leaderboard, Message, Redemption, Workout } = require('../models');

const createQuest = async (req, res) => {
    try {
        const quest = await Quest.create(req.body);
        res.status(201).json({ message: 'Quest created successfully', quest });
    } catch (error) {
        res.status(500).json({ message: 'Server error creating quest' });
    }
};

const updateQuest = async (req, res) => {
    try {
        const quest = await Quest.findByPk(req.params.id);
        if (!quest) return res.status(404).json({ message: 'Quest not found' });
        await quest.update(req.body);
        res.json({ message: 'Quest updated successfully', quest });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating quest' });
    }
};

const deleteQuest = async (req, res) => {
    try {
        const quest = await Quest.findByPk(req.params.id);
        if (!quest) return res.status(404).json({ message: 'Quest not found' });
        await quest.destroy();
        res.json({ message: 'Quest deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting quest' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving users' });
    }
};

const getAllRatings = async (req, res) => {
    try {
        const ratings = await Leaderboard.findAll({
            order: [['id', 'DESC']]
        });
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving ratings' });
    }
};

const approveRating = async (req, res) => {
    try {
        const entry = await Leaderboard.findByPk(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Rating entry not found' });

        entry.is_approved = true;
        await entry.save();

        res.json({ message: 'Rating approved' });
    } catch (error) {
        res.status(500).json({ message: 'Server error approving rating' });
    }
};

const deleteRating = async (req, res) => {
    try {
        const entry = await Leaderboard.findByPk(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Rating entry not found' });
        await entry.destroy();
        res.json({ message: 'Rating rejected and deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting rating' });
    }
};

const getUserWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.findAll({
            where: { user_id: req.params.userId },
            order: [['date', 'DESC']]
        });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving user workouts' });
    }
};

const getAllRedemptions = async (req, res) => {
    try {
        const transactions = await Redemption.findAll({
            include: [{ model: User, attributes: ['username', 'email'] }],
            order: [['redeemed_at', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving transactions' });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({
            include: [{ model: User, attributes: ['username', 'email'] }]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving messages' });
    }
};

const respondToMessage = async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        message.status = 'resolved';
        await message.save();

        res.json({ message: 'Message marked as resolved' });
    } catch (error) {
        res.status(500).json({ message: 'Server error responding to message' });
    }
};

module.exports = {
    createQuest,
    updateQuest,
    deleteQuest,
    getAllUsers,
    getAllRatings,
    getUserWorkouts,
    approveRating,
    deleteRating,
    getMessages,
    respondToMessage,
    getAllRedemptions
};
