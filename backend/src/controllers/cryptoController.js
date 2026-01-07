const axios = require('axios');

// @desc    Get top coins
// @route   GET /api/crypto/top
// @access  Public
const getTopCoins = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.COINGECKO_API_BASE}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 50,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coin data' });
    }
};

// @desc    Get coin details
// @route   GET /api/crypto/coin/:id
// @access  Public
const getCoinDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${process.env.COINGECKO_API_BASE}/coins/${id}`, {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: true
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coin details' });
    }
};

// @desc    Get coin history
// @route   GET /api/crypto/coin/:id/history
// @access  Public
const getCoinHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { days = 7 } = req.query;
        const response = await axios.get(`${process.env.COINGECKO_API_BASE}/coins/${id}/market_chart`, {
            params: {
                vs_currency: 'usd',
                days: days
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coin history' });
    }
};

module.exports = {
    getTopCoins,
    getCoinDetails,
    getCoinHistory
};
