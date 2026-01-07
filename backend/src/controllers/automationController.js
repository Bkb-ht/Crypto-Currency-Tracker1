const TradingBot = require('../models/TradingBot');
const ExchangeService = require('../services/ExchangeService');
const Transaction = require('../models/Transaction');
const ApiKey = require('../models/ApiKey');
const axios = require('axios');

// @desc    Create new trading bot
// @route   POST /api/automation/bots
// @access  Private
const createBot = async (req, res) => {
    try {
        const botData = {
            ...req.body,
            userId: req.user.id
        };

        const bot = new TradingBot(botData);
        await bot.save();

        res.status(201).json(bot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all user's trading bots
// @route   GET /api/automation/bots
// @access  Private
const getBots = async (req, res) => {
    try {
        const bots = await TradingBot.find({ userId: req.user.id });
        res.json(bots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single bot
// @route   GET /api/automation/bots/:id
// @access  Private
const getBot = async (req, res) => {
    try {
        const bot = await TradingBot.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!bot) {
            return res.status(404).json({ message: 'Bot not found' });
        }

        res.json(bot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update bot
// @route   PUT /api/automation/bots/:id
// @access  Private
const updateBot = async (req, res) => {
    try {
        const bot = await TradingBot.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!bot) {
            return res.status(404).json({ message: 'Bot not found' });
        }

        res.json(bot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete bot
// @route   DELETE /api/automation/bots/:id
// @access  Private
const deleteBot = async (req, res) => {
    try {
        const bot = await TradingBot.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!bot) {
            return res.status(404).json({ message: 'Bot not found' });
        }

        res.json({ message: 'Bot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Test exchange connection
// @route   POST /api/automation/bots/:id/test-connection
// @access  Private
const testConnection = async (req, res) => {
    try {
        const bot = await TradingBot.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!bot) {
            return res.status(404).json({ message: 'Bot not found' });
        }

        const exchangeService = new ExchangeService(bot);
        const result = await exchangeService.testConnection();

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Start bot
// @route   POST /api/automation/bots/:id/start
// @access  Private
const startBot = async (req, res) => {
    try {
        const bot = await TradingBot.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!bot) {
            return res.status(404).json({ message: 'Bot not found' });
        }

        bot.isActive = true;
        bot.lastRun = new Date();
        await bot.save();

        res.json({ message: 'Bot started successfully', bot });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stop bot
// @route   POST /api/automation/bots/:id/stop
// @access  Private
const stopBot = async (req, res) => {
    try {
        const bot = await TradingBot.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!bot) {
            return res.status(404).json({ message: 'Bot not found' });
        }

        bot.isActive = false;
        await bot.save();

        res.json({ message: 'Bot stopped successfully', bot });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bot performance
// @route   GET /api/automation/bots/:id/performance
// @access  Private
const getBotPerformance = async (req, res) => {
    try {
        const bot = await TradingBot.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!bot) {
            return res.status(404).json({ message: 'Bot not found' });
        }

        res.json(bot.performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Calculate DCA returns
// @route   POST /api/automation/dca-calculate
// @access  Private
const calculateDCA = async (req, res) => {
    try {
        const { investmentAmount, frequency, startDate, endDate, coinId } = req.body;

        // Calculate intervals based on frequency
        const start = new Date(startDate);
        const end = new Date(endDate);
        const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        
        let intervals;
        switch (frequency) {
            case 'daily': intervals = daysDiff; break;
            case 'weekly': intervals = Math.floor(daysDiff / 7); break;
            case 'monthly': intervals = Math.floor(daysDiff / 30); break;
            default: intervals = Math.floor(daysDiff / 30);
        }

        // Fetch historical price data
        const priceData = await fetchHistoricalPrices(coinId, startDate, endDate);
        
        // Calculate DCA results
        let totalInvested = 0;
        let totalCoins = 0;
        const chartData = [];

        for (let i = 0; i < intervals; i++) {
            const currentDate = new Date(start.getTime() + (i * daysDiff * 24 * 60 * 60 * 1000 / intervals));
            const price = getPriceForDate(priceData, currentDate);
            
            totalInvested += investmentAmount;
            totalCoins += investmentAmount / price;
            
            if (i % Math.max(1, Math.floor(intervals / 12)) === 0) {
                chartData.push({
                    date: currentDate.toLocaleDateString(),
                    invested: totalInvested,
                    value: totalCoins * price
                });
            }
        }

        const currentPrice = priceData[priceData.length - 1]?.price || 0;
        const currentValue = totalCoins * currentPrice;
        const profit = currentValue - totalInvested;
        const roi = (profit / totalInvested) * 100;
        const avgBuyPrice = totalInvested / totalCoins;

        res.json({
            results: {
                totalInvested,
                totalCoins,
                currentValue,
                profit,
                roi,
                avgBuyPrice,
                currentPrice,
                intervals
            },
            chartData
        });

    } catch (error) {
        console.error('DCA calculation error:', error);
        res.status(500).json({ message: 'Error calculating DCA returns' });
    }
};

// @desc    Get tax report
// @route   GET /api/automation/tax-report/:year
// @access  Private
const getTaxReport = async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const userId = req.user.id;

        const transactions = await Transaction.find({
            userId,
            taxYear: year,
            isTaxable: true
        }).sort({ date: 1 });

        // Calculate tax implications
        const shortTermGains = [];
        const longTermGains = [];
        let totalShortTerm = 0;
        let totalLongTerm = 0;

        // Group transactions by coin and calculate gains/losses
        const coinGroups = {};
        transactions.forEach(tx => {
            if (!coinGroups[tx.coinId]) {
                coinGroups[tx.coinId] = [];
            }
            coinGroups[tx.coinId].push(tx);
        });

        // Calculate gains for each coin
        Object.keys(coinGroups).forEach(coinId => {
            const coinTxs = coinGroups[coinId];
            let holdings = 0;
            let totalCost = 0;

            coinTxs.forEach(tx => {
                if (tx.type === 'buy') {
                    holdings += tx.quantity;
                    totalCost += tx.totalValue;
                } else if (tx.type === 'sell' && holdings > 0) {
                    const soldQuantity = Math.min(tx.quantity, holdings);
                    const costBasis = (totalCost / holdings) * soldQuantity;
                    const proceeds = soldQuantity * tx.price;
                    const gain = proceeds - costBasis;

                    const holdingPeriod = Math.floor((tx.date - coinTxs[0].date) / (1000 * 60 * 60 * 24));
                    
                    if (holdingPeriod < 365) {
                        shortTermGains.push({
                            coinId: tx.coinId,
                            coinName: tx.coinName,
                            gain,
                            holdingPeriod,
                            taxRate: 0.35
                        });
                        totalShortTerm += gain;
                    } else {
                        longTermGains.push({
                            coinId: tx.coinId,
                            coinName: tx.coinName,
                            gain,
                            holdingPeriod,
                            taxRate: 0.15
                        });
                        totalLongTerm += gain;
                    }

                    holdings -= soldQuantity;
                    totalCost -= costBasis;
                }
            });
        });

        const totalTaxLiability = (totalShortTerm * 0.35) + (totalLongTerm * 0.15);

        res.json({
            year,
            transactions,
            shortTermGains,
            longTermGains,
            totalShortTerm,
            totalLongTerm,
            totalTaxLiability,
            summary: {
                totalTransactions: transactions.length,
                totalVolume: transactions.reduce((sum, tx) => sum + tx.totalValue, 0),
                totalFees: transactions.reduce((sum, tx) => sum + (tx.fee || 0), 0)
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error generating tax report' });
    }
};

// @desc    Create API key
// @route   POST /api/automation/api-keys
// @access  Private
const createApiKey = async (req, res) => {
    try {
        const { name, permissions, rateLimit } = req.body;
        
        const key = generateApiKey();
        const apiKey = new ApiKey({
            userId: req.user.id,
            name,
            permissions: permissions || ['read'],
            rateLimit: {
                requestsPerHour: rateLimit || 100,
                currentRequests: 0,
                lastReset: new Date()
            }
        });

        await apiKey.save();
        res.status(201).json({ key, apiKey });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's API keys
// @route   GET /api/automation/api-keys
// @access  Private
const getApiKeys = async (req, res) => {
    try {
        const apiKeys = await ApiKey.find({ userId: req.user.id });
        res.json(apiKeys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper functions
const fetchHistoricalPrices = async (coinId, startDate, endDate) => {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range`, {
            params: {
                vs_currency: 'usd',
                from: Math.floor(new Date(startDate).getTime() / 1000),
                to: Math.floor(new Date(endDate).getTime() / 1000)
            }
        });
        
        return response.data.prices.map(([timestamp, price]) => ({
            date: new Date(timestamp),
            price
        }));
    } catch (error) {
        console.error('Error fetching historical prices:', error);
        return [];
    }
};

const getPriceForDate = (priceData, date) => {
    const closest = priceData.reduce((prev, curr) => {
        return Math.abs(curr.date - date) < Math.abs(prev.date - date) ? curr : prev;
    });
    return closest?.price || 50000;
};

const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

module.exports = {
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
};
