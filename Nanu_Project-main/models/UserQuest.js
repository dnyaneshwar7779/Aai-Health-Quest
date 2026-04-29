const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserQuest = sequelize.define('UserQuest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quest_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'abandoned'),
        defaultValue: 'active'
    },
    started_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = UserQuest;
