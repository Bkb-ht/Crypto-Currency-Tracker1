import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, TrendingUp, TrendingDown, Star, ChevronRight, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const Dashboard = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [watchlist, setWatchlist] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [liveUpdates, setLiveUpdates] = useState(new Map());
    const socketRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        // Initialize WebSocket connection
        socketRef.current = io('http://localhost:5000');
        
        socketRef.current.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to WebSocket server');
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from WebSocket server');
        });

        socketRef.current.on('crypto_full_update', (data) => {
            setCoins(data);
            setLoading(false);
        });

        socketRef.current.on('crypto_price_update', (updates) => {
            setCoins(prevCoins => {
                const updatedCoins = [...prevCoins];
                updates.forEach(update => {
                    const index = updatedCoins.findIndex(coin => coin.id === update.id);
                    if (index !== -1) {
                        updatedCoins[index] = update;
                    }
                });
                return updatedCoins;
            });

            // Flash animation for updated coins
            updates.forEach(update => {
                setLiveUpdates(prev => new Map(prev).set(update.id, true));
                setTimeout(() => {
                    setLiveUpdates(prev => {
                        const newMap = new Map(prev);
                        newMap.delete(update.id);
                        return newMap;
                    });
                }, 1000);
            });
        });

        // Fetch initial watchlist
        const fetchWatchlist = async () => {
            try {
                const watchlistRes = await axios.get('http://localhost:5000/api/watchlist');
                setWatchlist(watchlistRes.data.map(item => item.coinId));
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            }
        };

        fetchWatchlist();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const toggleWatchlist = async (coinId) => {
        try {
            if (watchlist.includes(coinId)) {
                await axios.delete(`http://localhost:5000/api/watchlist/${coinId}`);
                setWatchlist(watchlist.filter(id => id !== coinId));
            } else {
                await axios.post('http://localhost:5000/api/watchlist', { coinId });
                setWatchlist([...watchlist, coinId]);
            }
        } catch (error) {
            console.error('Error toggling watchlist:', error);
        }
    };

    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(price);
    };

    const formatCap = (cap) => {
        if (cap >= 1e12) return `${(cap / 1e12).toFixed(2)}T`;
        if (cap >= 1e9) return `${(cap / 1e9).toFixed(2)}B`;
        if (cap >= 1e6) return `${(cap / 1e6).toFixed(2)}M`;
        return cap.toLocaleString();
    };

    if (loading && coins.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Market Overview</h1>
                        <p className="text-gray-400">Track and analyze top performing cryptocurrencies</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        isConnected ? 'bg-secondary/20 text-secondary' : 'bg-danger/20 text-danger'
                    }`}>
                        {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                        {isConnected ? 'Live' : 'Offline'}
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search coins..."
                        className="input-field pl-12 w-full md:w-80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Market Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coins.slice(0, 3).map((coin, idx) => (
                    <div key={coin.id} className={`glass-card flex items-center justify-between transition-all duration-300 ${
                        liveUpdates.get(coin.id) ? 'ring-2 ring-primary ring-opacity-50 scale-105' : ''
                    }`}>
                        <div className="flex items-center gap-4">
                            <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="text-sm text-gray-400 font-medium">{coin.name}</p>
                                <p className="text-xl font-bold">{formatPrice(coin.current_price)}</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-1 font-semibold ${coin.price_change_percentage_24h >= 0 ? 'text-secondary' : 'text-danger'}`}>
                            {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>

            {/* Coins Table */}
            <div className="glass overflow-hidden rounded-2xl border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-lighter/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">Coin</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">24h Change</th>
                                <th className="px-6 py-4 hidden lg:table-cell">Market Cap</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCoins.map((coin, index) => (
                                <tr key={coin.id} className={`hover:bg-white/5 transition-all duration-300 group ${
                                    liveUpdates.get(coin.id) ? 'bg-primary/10 animate-pulse' : ''
                                }`}>
                                    <td className="px-6 py-6 text-gray-500 font-medium">{index + 1}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <div className="font-bold flex items-center gap-1.5">
                                                    {coin.name}
                                                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 uppercase tracking-wider group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                        {coin.symbol}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-semibold">{formatPrice(coin.current_price)}</td>
                                    <td className="px-6 py-6">
                                        <div className={`flex items-center gap-1 font-semibold ${coin.price_change_percentage_24h >= 0 ? 'text-secondary' : 'text-danger'}`}>
                                            {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-gray-400 hidden lg:table-cell font-medium">
                                        ${formatCap(coin.market_cap)}
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => toggleWatchlist(coin.id)}
                                                className={`transition-colors p-2 rounded-lg hover:bg-white/5 ${watchlist.includes(coin.id) ? 'text-accent' : 'text-gray-500'}`}
                                            >
                                                <Star size={18} fill={watchlist.includes(coin.id) ? "currentColor" : "none"} />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-primary transition-colors">
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
