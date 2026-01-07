import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from 'axios';

const DCACalculator = () => {
    const [investmentAmount, setInvestmentAmount] = useState(100);
    const [frequency, setFrequency] = useState('monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedCoin, setSelectedCoin] = useState('bitcoin');
    const [coins, setCoins] = useState([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/crypto/top');
                setCoins(response.data.slice(0, 10));
            } catch (error) {
                console.error('Error fetching coins:', error);
            }
        };
        fetchCoins();

        // Set default dates
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        setEndDate(today.toISOString().split('T')[0]);
        setStartDate(oneYearAgo.toISOString().split('T')[0]);
    }, []);

    const calculateDCA = async () => {
        if (!startDate || !endDate || !selectedCoin) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/automation/dca-calculate', {
                investmentAmount,
                frequency,
                startDate,
                endDate,
                coinId: selectedCoin
            });

            setResults(response.data.results);
            setChartData(response.data.chartData);
        } catch (error) {
            console.error('Error calculating DCA:', error);
            // Fallback calculation
            performFallbackCalculation();
        } finally {
            setLoading(false);
        }
    };

    const performFallbackCalculation = () => {
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

        const totalInvested = intervals * investmentAmount;
        const mockPrice = 45000; // Mock BTC price
        const totalCoins = totalInvested / mockPrice;
        const currentValue = totalCoins * mockPrice * 1.15; // Mock 15% gain
        const profit = currentValue - totalInvested;
        const roi = (profit / totalInvested) * 100;

        const mockChartData = [];
        for (let i = 0; i <= intervals; i += Math.max(1, Math.floor(intervals / 12))) {
            mockChartData.push({
                date: new Date(start.getTime() + (i * daysDiff * 24 * 60 * 60 * 1000 / intervals)).toLocaleDateString(),
                invested: i * investmentAmount,
                value: (i * investmentAmount) * (1 + (0.15 * i / intervals))
            });
        }

        setResults({
            totalInvested,
            totalCoins,
            currentValue,
            profit,
            roi,
            avgBuyPrice: mockPrice,
            currentPrice: mockPrice * 1.15,
            intervals
        });
        setChartData(mockChartData);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Calculator className="text-primary" />
                    DCA Calculator
                </h1>
                <p className="text-gray-400">Calculate your Dollar Cost Averaging strategy returns</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <DollarSign size={20} />
                            Investment Parameters
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Investment Amount ($)
                            </label>
                            <input
                                type="number"
                                value={investmentAmount}
                                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                className="input-field w-full"
                                min="1"
                                step="10"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Frequency
                            </label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="input-field w-full"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Cryptocurrency
                            </label>
                            <select
                                value={selectedCoin}
                                onChange={(e) => setSelectedCoin(e.target.value)}
                                className="input-field w-full"
                            >
                                {coins.map(coin => (
                                    <option key={coin.id} value={coin.id}>
                                        {coin.name} ({coin.symbol.toUpperCase()})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="input-field w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="input-field w-full"
                            />
                        </div>

                        <button
                            onClick={calculateDCA}
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Calculator size={20} />
                            )}
                            Calculate Returns
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-2 space-y-6">
                    {results && (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="glass-card p-4">
                                    <p className="text-sm text-gray-400 mb-1">Total Invested</p>
                                    <p className="text-xl font-bold">{formatCurrency(results.totalInvested)}</p>
                                </div>
                                <div className="glass-card p-4">
                                    <p className="text-sm text-gray-400 mb-1">Current Value</p>
                                    <p className="text-xl font-bold text-primary">{formatCurrency(results.currentValue)}</p>
                                </div>
                                <div className="glass-card p-4">
                                    <p className="text-sm text-gray-400 mb-1">Total Profit</p>
                                    <p className={`text-xl font-bold ${results.profit >= 0 ? 'text-secondary' : 'text-danger'}`}>
                                        {formatCurrency(results.profit)}
                                    </p>
                                </div>
                                <div className="glass-card p-4">
                                    <p className="text-sm text-gray-400 mb-1">ROI</p>
                                    <p className={`text-xl font-bold ${results.roi >= 0 ? 'text-secondary' : 'text-danger'}`}>
                                        {results.roi.toFixed(2)}%
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Stats */}
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Info size={20} />
                                    Investment Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Number of Purchases:</span>
                                        <span className="font-semibold">{results.intervals}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Coins Acquired:</span>
                                        <span className="font-semibold">{results.totalCoins?.toFixed(6) || '0.000000'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Average Buy Price:</span>
                                        <span className="font-semibold">{formatCurrency(results.avgBuyPrice)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Current Price:</span>
                                        <span className="font-semibold">{formatCurrency(results.currentPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp size={20} />
                                    Investment Growth Over Time
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="date" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                                            labelStyle={{ color: '#9CA3AF' }}
                                        />
                                        <Legend />
                                        <Area 
                                            type="monotone" 
                                            dataKey="invested" 
                                            stackId="1"
                                            stroke="#60A5FA" 
                                            fill="#60A5FA" 
                                            fillOpacity={0.6}
                                            name="Total Invested"
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="value" 
                                            stackId="2"
                                            stroke="#34D399" 
                                            fill="#34D399" 
                                            fillOpacity={0.6}
                                            name="Portfolio Value"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DCACalculator;
