const { Quest, UserQuest, User, Leaderboard } = require('../models');

const getAllQuests = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const quests = await Quest.findAll({
            where: { is_active: true }
        });

        // Mark quests as locked if user level is too low
        const questData = quests.map(quest => ({
            ...quest.toJSON(),
            isLocked: user.current_level < quest.required_level
        }));

        res.json(questData);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving quests' });
    }
};

const startQuest = async (req, res) => {
    try {
        const questId = req.params.id;
        const userId = req.user.id;

        const quest = await Quest.findByPk(questId);
        if (!quest) return res.status(404).json({ message: 'Quest not found' });

        const user = await User.findByPk(userId);
        if (user.current_level < quest.required_level) {
            return res.status(403).json({ message: 'Your level is too low for this quest' });
        }

        const existingUserQuest = await UserQuest.findOne({
            where: { user_id: userId, quest_id: questId, status: 'active' }
        });

        if (existingUserQuest) {
            return res.status(400).json({ message: 'Quest is already active' });
        }

        const userQuest = await UserQuest.create({
            user_id: userId,
            quest_id: questId,
            status: 'active'
        });

        res.status(201).json({ message: 'Quest started!', userQuest });
    } catch (error) {
        res.status(500).json({ message: 'Server error starting quest' });
    }
};

const getActiveQuests = async (req, res) => {
    try {
        const activeQuests = await UserQuest.findAll({
            where: { user_id: req.user.id, status: 'active' },
            include: [{ model: Quest }]
        });
        res.json(activeQuests);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving active quests' });
    }
};

const updateQuestProgress = async (req, res) => {
    try {
        const { questId, progressIncrement } = req.body;
        const userId = req.user.id;

        const userQuest = await UserQuest.findOne({
            where: { user_id: userId, quest_id: questId, status: 'active' },
            include: [Quest]
        });

        if (!userQuest) return res.status(404).json({ message: 'Active quest not found' });

        userQuest.progress += progressIncrement;

        let completed = false;
        if (userQuest.progress >= userQuest.Quest.target_value) {
            userQuest.progress = userQuest.Quest.target_value;
            userQuest.status = 'completed';
            userQuest.completed_at = new Date();
            completed = true;

            // Award rewards
            const user = await User.findByPk(userId);
            user.total_xp += userQuest.Quest.xp_reward;
            user.health_points += userQuest.Quest.health_points_reward;

            // Level up check
            const newLevel = Math.floor(user.total_xp / 500) + 1;
            const leveledUp = newLevel > user.current_level;
            user.current_level = newLevel;

            await user.save();

            // Sync to Leaderboard
            const [leaderboard, created] = await Leaderboard.findOrCreate({
                where: { user_id: userId },
                defaults: {
                    username: user.username,
                    total_xp: user.total_xp,
                    current_level: user.current_level,
                    quests_completed: 1
                }
            });

            if (!created) {
                leaderboard.total_xp = user.total_xp;
                leaderboard.current_level = user.current_level;
                leaderboard.quests_completed += 1;
                await leaderboard.save();
            }
        }

        await userQuest.save();

        res.json({
            message: completed ? 'Quest Completed!' : 'Progress updated',
            userQuest,
            completed
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating quest' });
    }
};

module.exports = {
    getAllQuests,
    startQuest,
    getActiveQuests,
    updateQuestProgress
};
