const express = require('express');
const router = express.Router();
const { getUsers, getUsage } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.use(admin);

router.get('/users', getUsers);
router.get('/usage', getUsage);

module.exports = router;
