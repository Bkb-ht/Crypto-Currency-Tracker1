import { useState, useEffect } from 'react';
import { Bot, Play, Pause, Settings, Trash2, Plus, TestTube, TrendingUp, DollarSign, Activity } from 'lucide-react';
import axios from 'axios';

const TradingBots = () => {
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [testingConnection, setTestingConnection] = useState(null);

    useEffect(() => {
        fetchBots();
    }, []);

    const fetchBots = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/automation/bots');
            setBots(response.data);
        } catch (error) {
            console.error('Error fetching bots:', error);
        } finally {
            setLoading(false);
        }
    };

    const [newBot, setNewBot] = useState({
        name: '',
        exchange: 'binance',
        strategy: 'dca',
        apiKey: '',
        secretKey: '',
        pairs: [{ symbol: 'BTC/USDT', baseCurrency: 'BTC', quoteCurrency: 'USDT' }],
        parameters: {
            investmentAmount: 100,
            frequency: 'daily'
        }
    });

    const createBot = async () => {
        try {
            await axios.post('http://localhost:5000/api/automation/bots', newBot);
            setShowCreateForm(false);
            setNewBot({
                name: '',
                exchange: 'binance',
                strategy: 'dca',
                apiKey: '',
                secretKey: '',
                pairs: [{ symbol: 'BTC/USDT', baseCurrency: 'BTC', quoteCurrency: 'USDT' }],
                parameters: {
                    investmentAmount: 100,
                    frequency: 'daily'
                }
            });
            fetchBots();
        } catch (error) {
            console.error('Error creating bot:', error);
        }
    };

    const startBot = async (botId) => {
        try {
            await axios.post(`http://localhost:5000/api/automation/bots/${botId}/start`);
            fetchBots();
        } catch (error) {
            console.error('Error starting bot:', error);
        }
    };

    const stopBot = async (botId) => {
        try {
            await axios.post(`http://localhost:5000/api/automation/bots/${botId}/stop`);
            fetchBots();
        } catch (error) {
            console.error('Error stopping bot:', error);
        }
    };

    const deleteBot = async (botId) => {
        if (window.confirm('Are you sure you want to delete this bot?')) {
            try {
                await axios.delete(`http://localhost:5000/api/automation/bots/${botId}`);
                fetchBots();
            } catch (error) {
                console.error('Error deleting bot:', error);
            }
        }
    };

    const testConnection = async (botId) => {
        setTestingConnection(botId);
        try {
            const response = await axios.post(`http://localhost:5000/api/automation/bots/${botId}/test-connection`);
            alert(response.data.message);
        } catch (error) {
            alert('Connection failed: ' + error.response?.data?.message || error.message);
        } finally {
            setTestingConnection(null);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Bot className="text-primary" />
                        Trading Bots
                    </h1>
                    <p className="text-gray-400">Automate your trading strategies</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Bot
                </button>
            </div>

            {/* Create Bot Form */}
            {showCreateForm && (
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-6">Create New Trading Bot</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Bot Name</label>
                            <input
                                type="text"
                                value={newBot.name}
                                onChange={(e) => setNewBot({...newBot, name: e.target.value})}
                                className="input-field w-full"
                                placeholder="My Trading Bot"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Exchange</label>
                            <select
                                value={newBot.exchange}
                                onChange={(e) => setNewBot({...newBot, exchange: e.target.value})}
                                className="input-field w-full"
                            >
                                <option value="binance">Binance</option>
                                <option value="coinbase">Coinbase</option>
                                <option value="kraken">Kraken</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Strategy</label>
                            <select
                                value={newBot.strategy}
                                onChange={(e) => setNewBot({...newBot, strategy: e.target.value})}
                                className="input-field w-full"
                            >
                                <option value="dca">Dollar Cost Averaging</option>
                                <option value="grid">Grid Trading</option>
                                <option value="ma_cross">Moving Average Crossover</option>
                                <option value="rsi">RSI Strategy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
                            <input
                                type="password"
                                value={newBot.apiKey}
                                onChange={(e) => setNewBot({...newBot, apiKey: e.target.value})}
                                className="input-field w-full"
                                placeholder="Enter your API key"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Secret Key</label>
                            <input
                                type="password"
                                value={newBot.secretKey}
                                onChange={(e) => setNewBot({...newBot, secretKey: e.target.value})}
                                className="input-field w-full"
                                placeholder="Enter your secret key"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Investment Amount ($)</label>
                            <input
                                type="number"
                                value={newBot.parameters.investmentAmount}
                                onChange={(e) => setNewBot({
                                    ...newBot, 
                                    parameters: {...newBot.parameters, investmentAmount: Number(e.target.value)}
                                })}
                                className="input-field w-full"
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={createBot}
                            className="btn-primary"
                        >
                            Create Bot
                        </button>
                        <button
                            onClick={() => setShowCreateForm(false)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Bots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bots.map((bot) => (
                    <div key={bot._id} className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${bot.isActive ? 'bg-secondary' : 'bg-gray-500'}`}></div>
                                <h3 className="font-bold text-lg">{bot.name}</h3>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                bot.isActive ? 'bg-secondary/20 text-secondary' : 'bg-gray-500/20 text-gray-400'
                            }`}>
                                {bot.isActive ? 'Active' : 'Inactive'}
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Exchange:</span>
                                <span className="font-medium capitalize">{bot.exchange}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Strategy:</span>
                                <span className="font-medium capitalize">{bot.strategy.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Pairs:</span>
                                <span className="font-medium">{bot.pairs?.length || 0}</span>
                            </div>
                            {bot.performance && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Trades:</span>
                                        <span className="font-medium">{bot.performance.totalTrades}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Profit:</span>
                                        <span className={`font-medium ${bot.performance.totalProfit >= 0 ? 'text-secondary' : 'text-danger'}`}>
                                            {formatCurrency(bot.performance.totalProfit)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-2 mt-6">
                            {bot.isActive ? (
                                <button
                                    onClick={() => stopBot(bot._id)}
                                    className="flex-1 btn-danger flex items-center justify-center gap-1"
                                >
                                    <Pause size={16} />
                                    Stop
                                </button>
                            ) : (
                                <button
                                    onClick={() => startBot(bot._id)}
                                    className="flex-1 btn-primary flex items-center justify-center gap-1"
                                >
                                    <Play size={16} />
                                    Start
                                </button>
                            )}
                            <button
                                onClick={() => testConnection(bot._id)}
                                disabled={testingConnection === bot._id}
                                className="btn-secondary flex items-center justify-center gap-1"
                            >
                                {testingConnection === bot._id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <TestTube size={16} />
                                )}
                            </button>
                            <button className="btn-secondary flex items-center justify-center gap-1">
                                <Settings size={16} />
                            </button>
                            <button
                                onClick={() => deleteBot(bot._id)}
                                className="btn-danger flex items-center justify-center gap-1"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {bots.length === 0 && !showCreateForm && (
                <div className="text-center py-12">
                    <Bot size={48} className="mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Trading Bots Yet</h3>
                    <p className="text-gray-400 mb-6">Create your first automated trading bot to get started</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="btn-primary flex items-center gap-2 mx-auto"
                    >
                        <Plus size={20} />
                        Create Your First Bot
                    </button>
                </div>
            )}
        </div>
    );
};

export default TradingBots;
