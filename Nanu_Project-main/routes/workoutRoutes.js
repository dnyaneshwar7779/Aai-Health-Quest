const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { validateWorkout } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken); // All workout routes protected

router.post('/', validateWorkout, workoutController.createWorkout);
router.get('/', workoutController.getWorkouts);
router.delete('/:id', workoutController.deleteWorkout);

module.exports = router;
