const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/foodController');
const auth = require('../middleware/auth');

router.get('/', auth, ctrl.getAll);
router.post('/', auth, ctrl.create);

module.exports = router;
