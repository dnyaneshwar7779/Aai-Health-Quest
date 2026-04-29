const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Redemption = sequelize.define('Redemption', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reward_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    points_spent: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reward_type: {
        type: DataTypes.ENUM('subscription', 'virtual_item', 'discount'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    redeemed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Redemption;
