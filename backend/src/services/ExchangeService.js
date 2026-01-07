const ccxt = require('ccxt');
const TradingBot = require('../models/TradingBot');

class ExchangeService {
    constructor(bot) {
        this.bot = bot;
        this.exchange = this.createExchange();
    }

    createExchange() {
        const config = {
            apiKey: this.bot.apiKey,
            secret: this.bot.secretKey,
            sandbox: true, // Use testnet by default
            enableRateLimit: true
        };

        switch (this.bot.exchange) {
            case 'binance':
                return new ccxt.binance(config);
            case 'coinbase':
                return new ccxt.coinbasepro(config);
            case 'kraken':
                return new ccxt.kraken(config);
            default:
                throw new Error('Unsupported exchange');
        }
    }

    async testConnection() {
        try {
            await this.exchange.fetchBalance();
            return { success: true, message: 'Connection successful' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async getBalance() {
        try {
            const balance = await this.exchange.fetchBalance();
            return { success: true, data: balance };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async executeOrder(symbol, type, side, amount, price = null) {
        try {
            const order = await this.exchange.createOrder(symbol, type, side, amount, price);
            return { success: true, data: order };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async getTicker(symbol) {
        try {
            const ticker = await this.exchange.fetchTicker(symbol);
            return { success: true, data: ticker };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async getHistoricalData(symbol, timeframe = '1h', limit = 100) {
        try {
            const ohlcv = await this.exchange.fetchOHLCV(symbol, timeframe, limit);
            return { success: true, data: ohlcv };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

module.exports = ExchangeService;
