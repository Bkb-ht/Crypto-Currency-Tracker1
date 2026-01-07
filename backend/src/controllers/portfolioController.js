const Portfolio = require('../models/Portfolio');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ user: req.user._id });
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add to portfolio
// @route   POST /api/portfolio
// @access  Private
const addToPortfolio = async (req, res) => {
    const { coinId, symbol, name, quantity, buyPrice, buyDate } = req.body;

    try {
        const portfolioItem = await Portfolio.create({
            user: req.user._id,
            coinId,
            symbol,
            name,
            quantity,
            buyPrice,
            buyDate
        });

        res.status(201).json(portfolioItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private
const updatePortfolioItem = async (req, res) => {
    try {
        const portfolioItem = await Portfolio.findById(req.params.id);

        if (!portfolioItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check ownership
        if (portfolioItem.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedItem = await Portfolio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private
const deletePortfolioItem = async (req, res) => {
    try {
        const portfolioItem = await Portfolio.findById(req.params.id);

        if (!portfolioItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check ownership
        if (portfolioItem.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await portfolioItem.deleteOne();
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPortfolio,
    addToPortfolio,
    updatePortfolioItem,
    deletePortfolioItem
};
