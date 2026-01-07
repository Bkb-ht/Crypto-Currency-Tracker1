const axios = require('axios');

let previousPrices = new Map();

const startCryptoPriceStream = (io) => {
    console.log('Starting crypto price stream...');

    // Fetch crypto prices every 5 seconds
    const fetchCryptoPrices = async () => {
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

            const currentPrices = response.data;
            const updates = [];

            currentPrices.forEach(coin => {
                const previousPrice = previousPrices.get(coin.id);
                const priceChanged = previousPrice && previousPrice.current_price !== coin.current_price;
                
                if (priceChanged) {
                    updates.push({
                        ...coin,
                        price_change: coin.current_price - previousPrice.current_price,
                        price_change_percentage_realtime: ((coin.current_price - previousPrice.current_price) / previousPrice.current_price) * 100
                    });
                }
                
                previousPrices.set(coin.id, coin);
            });

            // Emit updates to all connected clients
            if (updates.length > 0) {
                io.emit('crypto_price_update', updates);
            }

            // Emit full data every 30 seconds (6 intervals of 5 seconds)
            if (Math.floor(Date.now() / 30000) % 6 === 0) {
                io.emit('crypto_full_update', currentPrices);
            }

        } catch (error) {
            console.error('Error fetching crypto prices:', error.message);
        }
    };

    // Initial fetch
    fetchCryptoPrices();

    // Set up interval for real-time updates
    setInterval(fetchCryptoPrices, 5000);

    // Handle client connections
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Send initial data to newly connected client
        socket.emit('crypto_full_update', Array.from(previousPrices.values()));

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        socket.on('subscribe_crypto', (coinIds) => {
            console.log(`Client ${socket.id} subscribed to coins:`, coinIds);
            socket.join(coinIds);
        });

        socket.on('unsubscribe_crypto', (coinIds) => {
            console.log(`Client ${socket.id} unsubscribed from coins:`, coinIds);
            socket.leave(coinIds);
        });
    });
};

module.exports = {
    startCryptoPriceStream
};
