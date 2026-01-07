import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, TrendingUp, TrendingDown, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [watchRes, marketRes] = await Promise.all([
                axios.get('http://localhost:5000/api/watchlist'),
                axios.get('http://localhost:5000/api/crypto/top')
            ]);

            const watchIds = watchRes.data.map(item => item.coinId);
            const filteredMarket = marketRes.data.filter(coin => watchIds.includes(coin.id));

            setWatchlist(watchRes.data);
            setMarketData(filteredMarket);
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWatchlist = async (coinId) => {
        try {
            await axios.delete(`http://localhost:5000/api/watchlist/${coinId}`);
            setMarketData(marketData.filter(coin => coin.id !== coinId));
        } catch (error) {
            console.error('Error removing from watchlist:', error);
        }
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
            <div>
                <h1 className="text-3xl font-bold">Watchlist</h1>
                <p className="text-gray-400">Keep an eye on coins you are interested in</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketData.length === 0 ? (
                    <div className="col-span-full glass-card py-20 text-center">
                        <div className="w-20 h-20 bg-surface-lighter rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                            <Star size={40} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Your watchlist is empty</h3>
                        <p className="text-gray-400 mb-8">Start adding coins from the dashboard to track them here</p>
                        <Link to="/" className="btn-primary inline-flex items-center gap-2">
                            Browse Market
                        </Link>
                    </div>
                ) : (
                    marketData.map((coin) => (
                        <div key={coin.id} className="glass-card group relative overflow-hidden">
                            {/* Background gradient hint */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br transition-opacity duration-300 opacity-5 group-hover:opacity-10 ${coin.price_change_percentage_24h >= 0 ? 'from-secondary' : 'from-danger'}`} />

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full shadow-lg" />
                                    <div>
                                        <h3 className="font-bold text-lg">{coin.name}</h3>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{coin.symbol}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromWatchlist(coin.id)}
                                    className="p-2 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase mb-1">Current Price</p>
                                        <p className="text-2xl font-bold tracking-tight">${coin.current_price.toLocaleString()}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 font-bold px-2 py-1 rounded-lg ${coin.price_change_percentage_24h >= 0 ? 'text-secondary bg-secondary/10' : 'text-danger bg-danger/10'}`}>
                                        {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex gap-4">
                                    <div className="flex-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Market Cap</p>
                                        <p className="text-sm font-semibold">${(coin.market_cap / 1e9).toFixed(2)}B</p>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">24h Volume</p>
                                        <p className="text-sm font-semibold">${(coin.total_volume / 1e6).toFixed(2)}M</p>
                                    </div>
                                </div>

                                <button className="w-full btn-secondary mt-4 flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                                    <Eye size={18} />
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Watchlist;
