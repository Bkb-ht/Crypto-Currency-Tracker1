import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Minus, TrendingUp, TrendingDown, DollarSign, Wallet, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [marketData, setMarketData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        coinId: '',
        quantity: '',
        buyPrice: '',
    });

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/portfolio');
            setPortfolio(data);

            // Fetch current prices for all coins in portfolio
            if (data.length > 0) {
                const coinIds = [...new Set(data.map(item => item.coinId))].join(',');
                const marketRes = await axios.get('http://localhost:5000/api/crypto/top');
                const marketMap = {};
                marketRes.data.forEach(coin => {
                    marketMap[coin.id] = coin;
                });
                setMarketData(marketMap);
            }
        } catch (error) {
            console.error('Error fetching portfolio:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAsset = async (e) => {
        e.preventDefault();
        try {
            // Find coin details from existing data if possible, or fetch
            const coinSearch = await axios.get('http://localhost:5000/api/crypto/top');
            const coin = coinSearch.data.find(c => c.id === formData.coinId || c.symbol === formData.coinId.toLowerCase());

            if (!coin) {
                alert('Coin not found. Use id like "bitcoin" or "ethereum"');
                return;
            }

            await axios.post('http://localhost:5000/api/portfolio', {
                coinId: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                quantity: parseFloat(formData.quantity),
                buyPrice: parseFloat(formData.buyPrice),
            });

            setShowAddModal(false);
            setFormData({ coinId: '', quantity: '', buyPrice: '' });
            fetchPortfolio();
        } catch (error) {
            console.error('Error adding asset:', error);
        }
    };

    const deleteAsset = async (id) => {
        if (window.confirm('Remove this asset?')) {
            await axios.delete(`http://localhost:5000/api/portfolio/${id}`);
            fetchPortfolio();
        }
    };

    const stats = portfolio.reduce((acc, current) => {
        const marketInfo = marketData[current.coinId] || { current_price: current.buyPrice };
        const currentVal = marketInfo.current_price * current.quantity;
        const invested = current.buyPrice * current.quantity;

        acc.totalInvested += invested;
        acc.currentValue += currentVal;
        return acc;
    }, { totalInvested: 0, currentValue: 0 });

    const totalProfit = stats.currentValue - stats.totalInvested;
    const profitPercentage = stats.totalInvested > 0 ? (totalProfit / stats.totalInvested) * 100 : 0;

    const chartData = portfolio.map(item => ({
        name: item.name,
        value: (marketData[item.coinId]?.current_price || item.buyPrice) * item.quantity
    })).reduce((acc, curr) => {
        const existing = acc.find(a => a.name === curr.name);
        if (existing) {
            existing.value += curr.value;
        } else {
            acc.push(curr);
        }
        return acc;
    }, []);

    if (loading) {
        return <div className="h-96 flex items-center justify-center animate-pulse"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Portfolio</h1>
                    <p className="text-gray-400">Track and manage your cryptocurrency investments</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2 self-start md:self-auto"
                >
                    <Plus size={20} />
                    Add Asset
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary"><Wallet size={24} /></div>
                        <p className="text-gray-400 font-medium">Current Value</p>
                    </div>
                    <p className="text-3xl font-bold">${stats.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="glass-card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-accent/10 rounded-xl text-accent"><DollarSign size={24} /></div>
                        <p className="text-gray-400 font-medium">Total Invested</p>
                    </div>
                    <p className="text-3xl font-bold">${stats.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="glass-card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${totalProfit >= 0 ? 'bg-secondary/10 text-secondary' : 'bg-danger/10 text-danger'}`}>
                            <TrendingUp size={24} />
                        </div>
                        <p className="text-gray-400 font-medium">Total Profit/Loss</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-secondary' : 'text-danger'}`}>
                            {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <span className={`text-sm font-semibold ${totalProfit >= 0 ? 'text-secondary' : 'text-danger'}`}>
                            ({profitPercentage.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Holdings List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 mb-2 px-2">
                        <Wallet size={18} className="text-primary" />
                        <h2 className="text-xl font-bold">Your Assets</h2>
                    </div>
                    <div className="glass rounded-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-surface-lighter/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Asset</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Current Value</th>
                                    <th className="px-6 py-4">Profit/Loss</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {portfolio.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">No assets in portfolio yet.</td>
                                    </tr>
                                ) : (
                                    portfolio.map((item) => {
                                        const currentPrice = marketData[item.coinId]?.current_price || item.buyPrice;
                                        const currentValue = currentPrice * item.quantity;
                                        const investedValue = item.buyPrice * item.quantity;
                                        const profit = currentValue - investedValue;
                                        const pChange = (profit / investedValue) * 100;

                                        return (
                                            <tr key={item._id} className="hover:bg-white/5 group transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-surface-lighter flex items-center justify-center font-bold text-xs">
                                                            {item.symbol.toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{item.name}</p>
                                                            <p className="text-xs text-gray-500">${item.buyPrice.toLocaleString()} buy price</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium">{item.quantity}</td>
                                                <td className="px-6 py-4 font-semibold">${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="px-6 py-4">
                                                    <div className={`flex flex-col ${profit >= 0 ? 'text-secondary' : 'text-danger'}`}>
                                                        <span className="font-bold">{profit >= 0 ? '+' : ''}${profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                        <span className="text-xs font-medium">{pChange.toFixed(2)}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => deleteAsset(item._id)}
                                                        className="p-2 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                                    >
                                                        <Minus size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Portfolio Distribution */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2 px-2">
                        <PieChartIcon size={18} className="text-primary" />
                        <h2 className="text-xl font-bold">Distribution</h2>
                    </div>
                    <div className="glass-card h-[400px] flex flex-col items-center">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e2126', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value) => `$${value.toLocaleString()}`}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 italic">No data to display</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass-card w-full max-w-md border-white/10 shadow-2xl scale-100 transition-transform">
                        <h2 className="text-2xl font-bold mb-6">Add New Asset</h2>
                        <form onSubmit={handleAddAsset} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Coin ID (e.g., bitcoin)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.coinId}
                                    onChange={(e) => setFormData({ ...formData, coinId: e.target.value })}
                                    placeholder="bitcoin"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Quantity</label>
                                <input
                                    type="number"
                                    step="any"
                                    className="input-field"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Buy Price (USD)</label>
                                <input
                                    type="number"
                                    step="any"
                                    className="input-field"
                                    value={formData.buyPrice}
                                    onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary py-3">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary py-3">Add Asset</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
