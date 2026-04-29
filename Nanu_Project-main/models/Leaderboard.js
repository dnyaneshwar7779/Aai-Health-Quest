const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Leaderboard = sequelize.define('Leaderboard', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    current_level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    rating: {
        type: DataTypes.FLOAT,
        validate: {
            min: 1,
            max: 5
        }
    },
    is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    quests_completed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Leaderboard;
