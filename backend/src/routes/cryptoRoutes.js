const express = require('express');
const router = express.Router();
const {
    getTopCoins,
    getCoinDetails,
    getCoinHistory
} = require('../controllers/cryptoController');

router.get('/top', getTopCoins);
router.get('/coin/:id', getCoinDetails);
router.get('/coin/:id/history', getCoinHistory);

module.exports = router;
