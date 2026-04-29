const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken, isAdmin);

router.post('/quests', adminController.createQuest);
router.put('/quests/:id', adminController.updateQuest);
router.delete('/quests/:id', adminController.deleteQuest);

router.get('/users', adminController.getAllUsers);
router.get('/users/:userId/workouts', adminController.getUserWorkouts);

router.get('/ratings', adminController.getAllRatings);
router.put('/ratings/:id/approve', adminController.approveRating);
router.delete('/ratings/:id', adminController.deleteRating);

router.get('/messages', adminController.getMessages);
router.post('/messages/:id/respond', adminController.respondToMessage);

router.get('/redemptions', adminController.getAllRedemptions);

module.exports = router;
