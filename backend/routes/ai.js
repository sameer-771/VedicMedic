const express = require('express');
const router = express.Router();
const { getAIRecommendation } = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/diet-recommendation', auth, getAIRecommendation);

module.exports = router;
