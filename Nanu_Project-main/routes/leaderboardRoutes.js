const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { verifyToken } = require('../middleware/auth');

router.get('/', leaderboardController.getLeaderboard);
router.post('/rating', verifyToken, leaderboardController.submitRating);

module.exports = router;
