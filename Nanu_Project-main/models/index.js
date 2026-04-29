const User = require('./User');
const Workout = require('./Workout');
const Quest = require('./Quest');
const UserQuest = require('./UserQuest');
const Leaderboard = require('./Leaderboard');
const Redemption = require('./Redemption');
const Message = require('./Message');

// Associations

// User <-> Workout (One-to-Many)
User.hasMany(Workout, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Workout.belongsTo(User, { foreignKey: 'user_id' });

// User <-> Quest (Many-to-Many via UserQuest)
User.belongsToMany(Quest, { through: UserQuest, foreignKey: 'user_id' });
Quest.belongsToMany(User, { through: UserQuest, foreignKey: 'quest_id' });

// Explicitly define UserQuest associations for progress tracking
User.hasMany(UserQuest, { foreignKey: 'user_id' });
UserQuest.belongsTo(User, { foreignKey: 'user_id' });
Quest.hasMany(UserQuest, { foreignKey: 'quest_id' });
UserQuest.belongsTo(Quest, { foreignKey: 'quest_id' });

// User <-> Leaderboard (One-to-One/Many)
User.hasOne(Leaderboard, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Leaderboard.belongsTo(User, { foreignKey: 'user_id' });

// User <-> Redemption (One-to-Many)
User.hasMany(Redemption, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Redemption.belongsTo(User, { foreignKey: 'user_id' });

// User <-> Message (One-to-Many)
User.hasMany(Message, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    User,
    Workout,
    Quest,
    UserQuest,
    Leaderboard,
    Redemption,
    Message
};
