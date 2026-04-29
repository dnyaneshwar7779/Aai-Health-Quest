const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('height').optional().isFloat({ min: 10 }).withMessage('Valid height required'),
    body('weight').optional().isFloat({ min: 10 }).withMessage('Valid weight required'),
    body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Valid age required'),
    body('goal_type').optional().isIn(['weight_loss', 'weight_gain', 'other']).withMessage('Valid goal type required'),
    body('activity_level').optional().isIn(['low', 'moderate', 'high']).withMessage('Valid activity level required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateWorkout = [
    body('workout_type').notEmpty().withMessage('Workout type is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('calories_burned').optional().isFloat({ min: 0 }),
    body('steps_count').optional().isInt({ min: 0 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateWorkout
};
