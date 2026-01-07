const express = require('express');
const router = express.Router();
const {
    getPortfolio,
    addToPortfolio,
    updatePortfolioItem,
    deletePortfolioItem
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getPortfolio)
    .post(addToPortfolio);

router.route('/:id')
    .put(updatePortfolioItem)
    .delete(deletePortfolioItem);

module.exports = router;
