const express = require('express');
const router = express.Router();
const {
    createBot,
    getBots,
    getBot,
    updateBot,
    deleteBot,
    testConnection,
    startBot,
    stopBot,
    getBotPerformance,
    calculateDCA,
    getTaxReport,
    createApiKey,
    getApiKeys
} = require('../controllers/automationController');

const { protect } = require('../middleware/auth');

router.use(protect); // All routes are protected

router.post('/bots', createBot);
router.get('/bots', getBots);
router.get('/bots/:id', getBot);
router.put('/bots/:id', updateBot);
router.delete('/bots/:id', deleteBot);
router.post('/bots/:id/test-connection', testConnection);
router.post('/bots/:id/start', startBot);
router.post('/bots/:id/stop', stopBot);
router.get('/bots/:id/performance', getBotPerformance);

// DCA Calculator
router.post('/dca-calculate', calculateDCA);

// Tax Reporting
router.get('/tax-report/:year', getTaxReport);

// API Access Management
router.post('/api-keys', createApiKey);
router.get('/api-keys', getApiKeys);

module.exports = router;
