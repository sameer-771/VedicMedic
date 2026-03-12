const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dietController');
const auth = require('../middleware/auth');

router.post('/generate', auth, ctrl.generate);
router.get('/all', auth, ctrl.getAll);
router.get('/:patientId', auth, ctrl.getByPatient);

module.exports = router;
