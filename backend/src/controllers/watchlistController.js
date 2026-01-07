const Watchlist = require('../models/Watchlist');

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
    try {
        const watchlist = await Watchlist.find({ user: req.user._id });
        res.json(watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
    const { coinId } = req.body;

    try {
        const watchlistItem = await Watchlist.create({
            user: req.user._id,
            coinId
        });

        res.status(201).json(watchlistItem);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Coin already in watchlist' });
        }
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remove from watchlist
// @route   DELETE /api/watchlist/:coinId
// @access  Private
const removeFromWatchlist = async (req, res) => {
    try {
        const watchlistItem = await Watchlist.findOne({
            user: req.user._id,
            coinId: req.params.coinId
        });

        if (!watchlistItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        await watchlistItem.deleteOne();
        res.json({ message: 'Removed from watchlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist
};
