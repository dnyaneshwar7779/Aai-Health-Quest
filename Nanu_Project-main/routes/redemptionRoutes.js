const express = require('express');
const router = express.Router();
const redemptionController = require('../controllers/redemptionController');
const { verifyToken } = require('../middleware/auth');

router.get('/rewards', redemptionController.getRewards);
router.post('/', verifyToken, redemptionController.redeemPoints);
router.get('/history', verifyToken, redemptionController.getHistory);

module.exports = router;
