const mongoose = require('mongoose');

const tradingBotSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    exchange: {
        type: String,
        enum: ['binance', 'coinbase', 'kraken'],
        required: true
    },
    apiKey: {
        type: String,
        required: true
    },
    secretKey: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    strategy: {
        type: String,
        enum: ['dca', 'grid', 'ma_cross', 'rsi'],
        required: true
    },
    pairs: [{
        symbol: String,
        baseCurrency: String,
        quoteCurrency: String
    }],
    parameters: {
        investmentAmount: Number,
        frequency: String, // 'hourly', 'daily', 'weekly'
        gridUpper: Number,
        gridLower: Number,
        gridLevels: Number,
        maPeriod: Number,
        rsiPeriod: Number,
        rsiOversold: Number,
        rsiOverbought: Number
    },
    performance: {
        totalTrades: { type: Number, default: 0 },
        profitableTrades: { type: Number, default: 0 },
        totalProfit: { type: Number, default: 0 },
        totalLoss: { type: Number, default: 0 }
    },
    lastRun: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TradingBot', tradingBotSchema);
