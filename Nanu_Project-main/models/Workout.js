const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Workout = sequelize.define('Workout', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    workout_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false // minutes
    },
    calories_burned: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    steps_count: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    xp_earned: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Workout;
