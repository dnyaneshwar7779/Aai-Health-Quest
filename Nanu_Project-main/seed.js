const { Quest } = require('./models');
const { sequelize } = require('./config/database');

const initialQuests = [
    {
        title: 'Morning Warrior',
        description: 'Log any workout before 9:00 AM.',
        quest_type: 'daily',
        target_value: 1,
        xp_reward: 50,
        health_points_reward: 20,
        required_level: 1
    },
    {
        title: '5k Step Challenge',
        description: 'Accumulate 5,000 steps in a single day.',
        quest_type: 'daily',
        target_value: 5000,
        xp_reward: 100,
        health_points_reward: 40,
        required_level: 1
    },
    {
        title: 'Consistent Crusher',
        description: 'Complete 300 minutes of activity in a week.',
        quest_type: 'weekly',
        target_value: 300,
        xp_reward: 500,
        health_points_reward: 200,
        required_level: 2
    },
    {
        title: 'Marathon Milestone',
        description: 'Reach a total of 100,000 steps.',
        quest_type: 'milestone',
        target_value: 100000,
        xp_reward: 2000,
        health_points_reward: 1000,
        required_level: 5
    },
    {
        title: 'Hydro Hero',
        description: 'Drink 8 glasses of water today (Log as generic activity).',
        quest_type: 'daily',
        target_value: 8,
        xp_reward: 30,
        health_points_reward: 15,
        required_level: 1
    },
    {
        title: 'Zen Master',
        description: 'Complete 30 minutes of Yoga or Meditation.',
        quest_type: 'daily',
        target_value: 30,
        xp_reward: 80,
        health_points_reward: 50,
        required_level: 2
    },
    {
        title: 'Night Owl Run',
        description: 'Log a run after 8:00 PM.',
        quest_type: 'daily',
        target_value: 1,
        xp_reward: 120,
        health_points_reward: 60,
        required_level: 3
    },
    {
        title: 'Iron Grip',
        description: 'Complete 3 strength training sessions in one week.',
        quest_type: 'weekly',
        target_value: 3,
        xp_reward: 450,
        health_points_reward: 180,
        required_level: 4
    },
    {
        title: 'Weekend Warrior',
        description: 'Log 150 minutes of activity over the weekend.',
        quest_type: 'weekly',
        target_value: 150,
        xp_reward: 600,
        health_points_reward: 250,
        required_level: 3
    },
    {
        title: 'Century Cyclist',
        description: 'Cycle for a total of 100 minutes.',
        quest_type: 'milestone',
        target_value: 100,
        xp_reward: 800,
        health_points_reward: 400,
        required_level: 4
    }
];

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected for seeding...');

        // Ensure tables exist
        await sequelize.sync();
        console.log('Database synced!');

        // Clear existing quests to avoid duplicates
        await Quest.destroy({ where: {}, truncate: false }); // Truncate might fail if there are foreign keys, but UserQuests references Quest. 
        // Let's just destroy all.

        await Quest.bulkCreate(initialQuests);
        console.log('10 Quests seeded successfully!');

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
