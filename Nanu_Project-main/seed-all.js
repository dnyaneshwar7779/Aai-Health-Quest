const { User, Quest, Workout, Leaderboard } = require('./models');
const { sequelize } = require('./config/database');
const bcrypt = require('bcrypt');

const initialQuests = [
    { title: 'Morning Warrior', description: 'Log any workout before 9:00 AM.', quest_type: 'daily', target_value: 1, xp_reward: 50, health_points_reward: 20, required_level: 1 },
    { title: '5k Step Challenge', description: 'Accumulate 5,000 steps in a single day.', quest_type: 'daily', target_value: 5000, xp_reward: 100, health_points_reward: 40, required_level: 1 },
    { title: 'Consistent Crusher', description: 'Complete 300 minutes of activity in a week.', quest_type: 'weekly', target_value: 300, xp_reward: 500, health_points_reward: 200, required_level: 2 },
    { title: 'Marathon Milestone', description: 'Reach a total of 100,000 steps.', quest_type: 'milestone', target_value: 100000, xp_reward: 2000, health_points_reward: 1000, required_level: 5 },
    { title: 'Hydro Hero', description: 'Drink 8 glasses of water today.', quest_type: 'daily', target_value: 8, xp_reward: 30, health_points_reward: 15, required_level: 1 },
    { title: 'Zen Master', description: 'Complete 30 minutes of Yoga or Meditation.', quest_type: 'daily', target_value: 30, xp_reward: 80, health_points_reward: 50, required_level: 2 },
    { title: 'Night Owl Run', description: 'Log a run after 8:00 PM.', quest_type: 'daily', target_value: 1, xp_reward: 120, health_points_reward: 60, required_level: 3 },
    { title: 'Iron Grip', description: 'Complete 3 strength training sessions in one week.', quest_type: 'weekly', target_value: 3, xp_reward: 450, health_points_reward: 180, required_level: 4 },
    { title: 'Weekend Warrior', description: 'Log 150 minutes of activity over the weekend.', quest_type: 'weekly', target_value: 150, xp_reward: 600, health_points_reward: 250, required_level: 3 },
    { title: 'Century Cyclist', description: 'Cycle for a total of 100 minutes.', quest_type: 'milestone', target_value: 100, xp_reward: 800, health_points_reward: 400, required_level: 4 }
];

const users = [
    { username: 'HeadWarrior', email: 'admin@aaihealth.com', password: 'AdminQuest@2026', role: 'admin', current_level: 10, total_xp: 5000, health_points: 500 },
    { username: 'RunnerAlpha', email: 'runner@example.com', password: 'UserQuest@2026', current_level: 3, total_xp: 1200, health_points: 120 },
    { username: 'YogaQueen', email: 'yoga@example.com', password: 'UserQuest@2026', current_level: 2, total_xp: 800, health_points: 80 },
    { username: 'GymRat', email: 'gym@example.com', password: 'UserQuest@2026', current_level: 5, total_xp: 2500, health_points: 250 }
];

const seedAll = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Sync and clear tables
        await sequelize.sync({ force: true });
        console.log('Tables cleared and recreated.');

        // Seed Quests
        await Quest.bulkCreate(initialQuests);
        console.log('Quests seeded.');

        // Seed Users
        const createdUsers = await User.bulkCreate(users, { individualHooks: true });
        console.log('Users seeded.');

        // Seed Workouts for each user
        for (const user of createdUsers) {
            const workouts = [
                { user_id: user.id, workout_type: 'Running', duration: 30, calories_burned: 300, steps_count: 4000, xp_earned: 60, date: new Date() },
                { user_id: user.id, workout_type: 'Cycling', duration: 45, calories_burned: 400, steps_count: 0, xp_earned: 80, date: new Date() },
                { user_id: user.id, workout_type: 'Yoga', duration: 60, calories_burned: 150, steps_count: 0, xp_earned: 75, date: new Date() }
            ];
            await Workout.bulkCreate(workouts);
            
            // Initial Leaderboard entry
            await Leaderboard.create({
                user_id: user.id,
                username: user.username,
                total_xp: user.total_xp,
                current_level: user.current_level
            });
        }
        console.log('Workouts and Leaderboard seeded.');

        console.log('All data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedAll();
