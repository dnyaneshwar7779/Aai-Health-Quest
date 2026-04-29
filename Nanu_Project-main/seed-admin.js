const { User } = require('./models');
const { sequelize } = require('./config/database');

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected for admin seeding...');

        // Ensure tables exist
        await sequelize.sync();
        console.log('Database synced!');

        // Create or Update Admin
        const [admin, created] = await User.findOrCreate({
            where: { email: 'admin@aaihealth.com' },
            defaults: {
                username: 'HeadWarrior',
                email: 'admin@aaihealth.com',
                password: 'AdminQuest@2026',
                role: 'admin',
                current_level: 99,
                total_xp: 99999,
                health_points: 9999
            }
        });

        if (!created) {
            // If already exists, ensure it's an admin
            admin.role = 'admin';
            admin.password = 'AdminQuest@2026'; // Reset password for user convenience
            await admin.save();
            console.log('Admin account updated!');
        } else {
            console.log('Admin account created successfully!');
        }

        process.exit();
    } catch (error) {
        console.error('Admin seeding failed:', error);
        process.exit(1);
    }
};

seedAdmin();
