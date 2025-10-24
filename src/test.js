// API endpoint for top cryptocurrencies
app.get('/api/top-cryptos', async (req, res) => {
    try {
        const { limit = 10 } = req.query; // Get limit from query params
        
        const topCryptos = await getTopCryptos(parseInt(limit));
        
        if (typeof topCryptos === 'string') {
            // Error message returned
            return res.status(500).json({ error: topCryptos });
        }
        
        res.json({ coins: topCryptos });
    } catch (error) {
        console.error('Top cryptos endpoint error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch top cryptos',
            details: error.message 
        });
    }
});