const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.get('/tasks/weekly', verifyToken, authController.getWeeklyTasks);
router.put('/tasks/weekly/:taskId/complete', verifyToken, authController.completeWeeklyTask);

module.exports = router;
