const jwt = require('jsonwebtoken');
const { User, UserQuest, Workout, Leaderboard } = require('../models');
require('dotenv').config();

const formatDate = (date) => date.toISOString().slice(0, 10);

const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return formatDate(date);
};

const normalizeGoalType = (goal) => {
    if (!goal) return 'other';
    const value = String(goal).toLowerCase();
    if (value.includes('loss')) return 'weight_loss';
    if (value.includes('gain')) return 'weight_gain';
    return 'other';
};

const goalLabel = (goalType) => {
    if (goalType === 'weight_loss') return 'Weight Loss';
    if (goalType === 'weight_gain') return 'Weight Gain';
    return 'General Wellness';
};

const safeNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getMealTemplate = (goalType) => ({
    breakfast: goalType === 'weight_loss'
        ? 'Oats + berries + boiled eggs'
        : 'Oats + banana + peanut butter + milk',
    lunch: goalType === 'weight_loss'
        ? 'Grilled protein + salad + brown rice'
        : 'Grilled protein + sweet potato + rice',
    snack: goalType === 'weight_loss'
        ? 'Greek yogurt + nuts (small serving)'
        : 'Greek yogurt + nuts + fruit smoothie',
    dinner: goalType === 'weight_loss'
        ? 'Vegetable soup + paneer/tofu/chicken'
        : 'Whole grain pasta + paneer/tofu/chicken + vegetables'
});

const getWeeklyWorkoutPlan = (goalType) => {
    if (goalType === 'weight_gain') {
        return [
            'Mon: Upper body strength 45 min',
            'Tue: Light walk 30 min',
            'Wed: Lower body strength 45 min',
            'Thu: Mobility and core 30 min',
            'Fri: Full body strength 45 min',
            'Sat: Easy cycling or walk 30 min',
            'Sun: Recovery and stretch 20 min'
        ];
    }

    if (goalType === 'weight_loss') {
        return [
            'Mon: Brisk walk or jog 40 min',
            'Tue: Strength circuit 35 min',
            'Wed: Cycling or fast walk 40 min',
            'Thu: HIIT intervals 25 min',
            'Fri: Strength circuit 35 min',
            'Sat: Long walk 60 min',
            'Sun: Yoga and stretch 30 min'
        ];
    }

    return [
        'Mon: Full body workout 35 min',
        'Tue: Walk 30 min',
        'Wed: Core + mobility 30 min',
        'Thu: Jog or cycling 30 min',
        'Fri: Strength 35 min',
        'Sat: Outdoor activity 45 min',
        'Sun: Stretch and recovery 20 min'
    ];
};

const calculateDailyTargets = ({ weight, height, age, goalType, activityLevel }) => {
    const activityFactorMap = {
        low: 1.35,
        moderate: 1.55,
        high: 1.75
    };

    const cleanWeight = safeNumber(weight, 70);
    const cleanHeight = safeNumber(height, 170);
    const cleanAge = safeNumber(age, 25);
    const activityFactor = activityFactorMap[activityLevel] || 1.55;

    const bmr = (10 * cleanWeight) + (6.25 * cleanHeight) - (5 * cleanAge) + 2;
    const maintenanceCalories = Math.round(bmr * activityFactor);

    let calorieAdjustment = 0;
    if (goalType === 'weight_loss') calorieAdjustment = -400;
    if (goalType === 'weight_gain') calorieAdjustment = 350;
    const targetCalories = Math.max(1200, maintenanceCalories + calorieAdjustment);

    const proteinGrams = Math.round(cleanWeight * (goalType === 'weight_gain' ? 2 : 1.8));
    const fatGrams = Math.round(cleanWeight * 0.8);
    const carbCalories = targetCalories - (proteinGrams * 4) - (fatGrams * 9);
    const carbsGrams = Math.max(80, Math.round(carbCalories / 4));

    return {
        calories: targetCalories,
        protein_g: proteinGrams,
        carbs_g: carbsGrams,
        fats_g: fatGrams,
        water_liters: 2.5
    };
};

const buildWeeklyTasks = (startDate, weeklyWorkoutPlan) => {
    return weeklyWorkoutPlan.map((title, index) => ({
        id: `task-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
        title,
        due_date: addDays(startDate, index),
        status: 'pending',
        completion_weight: null,
        completed_at: null,
        missed_count: 0
    }));
};

const generatePlan = ({ weight, height, age, goalType, activityLevel }) => {
    const today = new Date();
    const startDate = formatDate(today);
    const endDate = addDays(startDate, 27);

    const weeklyWorkoutPlan = getWeeklyWorkoutPlan(goalType);
    return {
        goal: goalLabel(goalType),
        activityLevel,
        startDate,
        endDate,
        initialWeight: safeNumber(weight, 70),
        currentWeight: safeNumber(weight, 70),
        dailyTargets: calculateDailyTargets({
            weight,
            height,
            age,
            goalType,
            activityLevel
        }),
        mealTemplate: getMealTemplate(goalType),
        weeklyWorkoutPlan,
        weeklyTasks: buildWeeklyTasks(startDate, weeklyWorkoutPlan),
        weightLogs: []
    };
};

const parseDietPlan = (rawPlan) => {
    if (!rawPlan) return null;
    try {
        return JSON.parse(rawPlan);
    } catch (error) {
        return null;
    }
};

const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
        if (a.due_date < b.due_date) return -1;
        if (a.due_date > b.due_date) return 1;
        return a.title.localeCompare(b.title);
    });
};

const reorganizeMissedTasks = (plan) => {
    if (!Array.isArray(plan.weeklyTasks)) {
        plan.weeklyTasks = buildWeeklyTasks(plan.startDate, plan.weeklyWorkoutPlan || []);
        return true;
    }

    const today = formatDate(new Date());
    let changed = false;

    const existingTasks = sortTasks(plan.weeklyTasks);
    let lastDueDate = existingTasks.length > 0 ? existingTasks[existingTasks.length - 1].due_date : today;
    const newTasks = [];

    for (const task of existingTasks) {
        if (task.status === 'pending' && task.due_date < today) {
            task.status = 'missed';
            task.missed_count = (task.missed_count || 0) + 1;
            changed = true;

            lastDueDate = addDays(lastDueDate, 1);
            newTasks.push({
                id: `task-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                title: `${task.title} (Rescheduled)`,
                due_date: lastDueDate,
                status: 'pending',
                completion_weight: null,
                completed_at: null,
                missed_count: task.missed_count,
                rescheduled_from: task.id
            });
        }
    }

    if (newTasks.length > 0) {
        plan.weeklyTasks.push(...newTasks);
        plan.endDate = newTasks[newTasks.length - 1].due_date;
    }

    plan.weeklyTasks = sortTasks(plan.weeklyTasks);
    return changed;
};

const updateDietTargetsFromWeight = (user, plan) => {
    const latestWeight = Array.isArray(plan.weightLogs) && plan.weightLogs.length > 0
        ? safeNumber(plan.weightLogs[plan.weightLogs.length - 1].weight, user.weight)
        : safeNumber(user.weight, plan.currentWeight || plan.initialWeight || 70);

    const newTargets = calculateDailyTargets({
        weight: latestWeight,
        height: user.height,
        age: user.age,
        goalType: user.goal_type || normalizeGoalType(user.fitness_goal),
        activityLevel: user.activity_level || 'moderate'
    });

    const oldCalories = plan.dailyTargets ? plan.dailyTargets.calories : newTargets.calories;
    plan.dailyTargets = newTargets;
    plan.currentWeight = latestWeight;
    plan.mealTemplate = getMealTemplate(user.goal_type || normalizeGoalType(user.fitness_goal));

    if (newTargets.calories > oldCalories) return 'Diet plan updated: calories increased based on latest weight.';
    if (newTargets.calories < oldCalories) return 'Diet plan updated: calories reduced based on latest weight.';
    return 'Diet plan reviewed and kept at current target calories.';
};

const persistPlan = async (user, plan) => {
    user.diet_plan = JSON.stringify(plan);
    user.diet_start_date = plan.startDate;
    user.diet_end_date = plan.endDate;
    await user.save();
};

const ensurePlanForUser = async (user) => {
    let plan = parseDietPlan(user.diet_plan);
    const normalizedGoalType = user.goal_type || normalizeGoalType(user.fitness_goal);
    const normalizedActivityLevel = user.activity_level || 'moderate';

    if (!plan) {
        plan = generatePlan({
            weight: user.weight,
            height: user.height,
            age: user.age,
            goalType: normalizedGoalType,
            activityLevel: normalizedActivityLevel
        });

        user.goal_type = normalizedGoalType;
        user.activity_level = normalizedActivityLevel;
        user.fitness_goal = goalLabel(normalizedGoalType);
        await persistPlan(user, plan);
        return plan;
    }

    if (!Array.isArray(plan.weightLogs)) plan.weightLogs = [];
    if (!Array.isArray(plan.weeklyWorkoutPlan)) plan.weeklyWorkoutPlan = getWeeklyWorkoutPlan(normalizedGoalType);

    const reorganized = reorganizeMissedTasks(plan);
    if (reorganized) {
        await persistPlan(user, plan);
    }

    return plan;
};

const getTaskProgress = (plan) => {
    const tasks = Array.isArray(plan.weeklyTasks) ? plan.weeklyTasks : [];
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const pending = tasks.filter((task) => task.status === 'pending').length;
    const missed = tasks.filter((task) => task.status === 'missed').length;
    const totalTrackable = completed + pending;
    const percent = totalTrackable === 0 ? 0 : Math.round((completed / totalTrackable) * 100);

    return {
        completed,
        pending,
        missed,
        total: tasks.length,
        trackable_total: totalTrackable,
        percent
    };
};

const register = async (req, res) => {
    try {
        const { username, email, password, height, weight, age, fitness_goal, goal_type, activity_level } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const normalizedGoalType = normalizeGoalType(goal_type || fitness_goal);
        const profileGoal = goalLabel(normalizedGoalType);
        const normalizedActivityLevel = ['low', 'moderate', 'high'].includes(activity_level) ? activity_level : 'moderate';
        const plan = generatePlan({
            weight,
            height,
            age,
            goalType: normalizedGoalType,
            activityLevel: normalizedActivityLevel
        });

        const user = await User.create({
            username,
            email,
            password,
            height,
            weight,
            age,
            fitness_goal: profileGoal,
            goal_type: normalizedGoalType,
            activity_level: normalizedActivityLevel,
            diet_plan: JSON.stringify(plan),
            diet_start_date: plan.startDate,
            diet_end_date: plan.endDate
        });

        await Leaderboard.findOrCreate({
            where: { user_id: user.id },
            defaults: {
                user_id: user.id,
                username: user.username,
                total_xp: user.total_xp,
                current_level: user.current_level,
                is_approved: true,
                quests_completed: 0
            }
        });

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                fitness_goal: user.fitness_goal,
                goal_type: user.goal_type,
                activity_level: user.activity_level,
                diet_plan: plan,
                diet_start_date: user.diet_start_date,
                diet_end_date: user.diet_end_date,
                weekly_task_progress: getTaskProgress(plan)
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const dietPlan = await ensurePlanForUser(user);

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                fitness_goal: user.fitness_goal,
                goal_type: user.goal_type,
                activity_level: user.activity_level,
                diet_plan: dietPlan,
                diet_start_date: user.diet_start_date,
                diet_end_date: user.diet_end_date,
                weekly_task_progress: getTaskProgress(dietPlan)
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const completedQuestsCount = await UserQuest.count({
            where: { user_id: req.user.id, status: 'completed' }
        });
        const completedWorkoutsCount = await Workout.count({
            where: { user_id: req.user.id }
        });

        const dietPlan = await ensurePlanForUser(user);

        res.json({
            ...user.toJSON(),
            diet_plan: dietPlan,
            quests_completed: completedQuestsCount,
            workouts_completed: completedWorkoutsCount,
            weekly_task_progress: getTaskProgress(dietPlan)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};

const getWeeklyTasks = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const plan = await ensurePlanForUser(user);

        res.json({
            tasks: sortTasks(plan.weeklyTasks || []),
            progress: getTaskProgress(plan),
            plan_dates: {
                start: plan.startDate,
                end: plan.endDate
            }
        });
    } catch (error) {
        console.error('Weekly tasks error:', error);
        res.status(500).json({ message: 'Server error retrieving weekly tasks' });
    }
};

const completeWeeklyTask = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { taskId } = req.params;
        const { weight } = req.body;
        const completionWeight = safeNumber(weight, null);

        if (!completionWeight) {
            return res.status(400).json({ message: 'Weight is required when completing a task' });
        }

        const plan = await ensurePlanForUser(user);
        const tasks = Array.isArray(plan.weeklyTasks) ? plan.weeklyTasks : [];
        const task = tasks.find((item) => item.id === taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.status === 'completed') {
            return res.status(400).json({ message: 'Task already completed' });
        }

        task.status = 'completed';
        task.completion_weight = completionWeight;
        task.completed_at = formatDate(new Date());

        if (!Array.isArray(plan.weightLogs)) plan.weightLogs = [];
        plan.weightLogs.push({
            task_id: task.id,
            date: task.completed_at,
            weight: completionWeight
        });

        user.weight = completionWeight;
        const dietAdjustmentMessage = updateDietTargetsFromWeight(user, plan);

        await persistPlan(user, plan);

        res.json({
            message: 'Task marked completed. Weight logged and diet plan adjusted.',
            task,
            dietAdjustmentMessage,
            updatedDailyTargets: plan.dailyTargets,
            progress: getTaskProgress(plan)
        });
    } catch (error) {
        console.error('Complete task error:', error);
        res.status(500).json({ message: 'Server error completing task' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    getWeeklyTasks,
    completeWeeklyTask
};
