const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', questController.getAllQuests);
router.post('/:id/start', questController.startQuest);
router.get('/active', questController.getActiveQuests);
router.put('/progress', questController.updateQuestProgress);

module.exports = router;
