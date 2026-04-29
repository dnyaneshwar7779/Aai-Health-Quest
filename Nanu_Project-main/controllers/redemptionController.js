const { Redemption, User } = require('../models');

const getRewards = async (req, res) => {
    // Mock rewards list
    const rewards = [
        { id: 'sub_1', name: '1 Month Premium Subscription', points: 500, type: 'subscription' },
        { id: 'sub_2', name: '3 Months Premium Subscription', points: 1200, type: 'subscription' },
        { id: 'item_1', name: 'Neon Avatar Aura', points: 200, type: 'virtual_item' },
        { id: 'disc_1', name: '10% Gym Discount Voucher', points: 300, type: 'discount' }
    ];
    res.json(rewards);
};

const redeemPoints = async (req, res) => {
    try {
        const { rewardId, rewardName, pointsSpent, rewardType } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (user.health_points < pointsSpent) {
            return res.status(400).json({ message: 'Insufficient health points' });
        }

        // Deduct points
        user.health_points -= pointsSpent;
        await user.save();

        // Create redemption record (Mock payment/gateway)
        const redemption = await Redemption.create({
            user_id: userId,
            reward_name: rewardName,
            points_spent: pointsSpent,
            reward_type: rewardType,
            status: 'completed', // Mocking instant completion
            transaction_id: `MOCK_TXN_${Date.now()}`
        });

        res.json({
            message: 'Reward redeemed successfully!',
            redemption,
            remainingPoints: user.health_points
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during redemption' });
    }
};

const getHistory = async (req, res) => {
    try {
        const history = await Redemption.findAll({
            where: { user_id: req.user.id },
            order: [['redeemed_at', 'DESC']]
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving history' });
    }
};

module.exports = {
    getRewards,
    redeemPoints,
    getHistory
};
