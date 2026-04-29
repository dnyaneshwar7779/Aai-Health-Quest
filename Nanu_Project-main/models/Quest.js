const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quest = sequelize.define('Quest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    quest_type: {
        type: DataTypes.STRING, // 'daily', 'weekly', 'milestone'
        allowNull: false
    },
    target_value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    xp_reward: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    health_points_reward: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    required_level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Quest;
