const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fitness_goal: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    goal_type: {
        type: DataTypes.ENUM('weight_loss', 'weight_gain', 'other'),
        defaultValue: 'other'
    },
    activity_level: {
        type: DataTypes.ENUM('low', 'moderate', 'high'),
        defaultValue: 'moderate'
    },
    diet_plan: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    diet_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    diet_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    current_level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    total_xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    health_points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
