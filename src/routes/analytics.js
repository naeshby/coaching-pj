const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/analyticsController');

router.get('/dashboard', authenticate, ctrl.getDashboardStats);
router.get('/pipeline', authenticate, ctrl.getPipelineStats);
router.post('/track', authenticate, ctrl.trackClientEvent);

module.exports = router;
