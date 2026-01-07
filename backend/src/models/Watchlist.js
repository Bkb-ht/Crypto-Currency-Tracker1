const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coinId: {
        type: String, // CoinGecko id e.g., 'bitcoin'
        required: true
    }
}, {
    timestamps: true
});

// Prevent duplicate watchlist items for the same user
watchlistSchema.index({ user: 1, coinId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
