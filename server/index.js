import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',  // Local development
        'https://rip-v2.vercel.app'  // Production
    ],
    credentials: true
}));
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


const CRYPTO_SYSTEM_PROMPT = `You are a cryptocurrency expert assistant. You ONLY answer questions about:
- Cryptocurrencies (Bitcoin, Ethereum, altcoins, etc.)
- Blockchain technology
- DeFi (Decentralized Finance)
- NFTs and Web3
- Crypto trading, market analysis, and trends
- Crypto wallets and security
- Mining and staking

If asked about topics outside cryptocurrency, politely redirect the conversation back to crypto topics. Be helpful, informative, and concise.`;


// Map common symbols to CoinGecko IDs
const symbolToId = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'ADA': 'cardano',
    'XRP': 'ripple',
    'DOGE': 'dogecoin',
    'DOT': 'polkadot',
    'MATIC': 'polygon',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'AVAX': 'avalanche-2',
    'LTC': 'litecoin',
    'SHIB': 'shiba-inu',
    'TRX': 'tron',
    'ATOM': 'cosmos',
    'TON': 'the-open-network',
};


// Function to fetch live data from CMC
async function getCryptoPrice(symbol) {
    try {
       const coinId = symbolToId[symbol.toUpperCase()];
        
        if (!coinId) {
            return `Cryptocurrency ${symbol} not found in supported list.`;
        }

        const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`;
        const options = {
            method: 'GET',
            headers: {
                'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
            }
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error('Failed to fetch crypto data from CoinGecko');
        }

        const data = await response.json();

        return {
            name: data.name,
            symbol: data.symbol.toUpperCase(),
            price: data.market_data.current_price.usd,
            percentChange24h: data.market_data.price_change_percentage_24h,
            percentChange7d: data.market_data.price_change_percentage_7d,
            percentChange30d: data.market_data.price_change_percentage_30d,
            marketCap: data.market_data.market_cap.usd,
            volume24h: data.market_data.total_volume.usd,
            rank: data.market_cap_rank,
            high24h: data.market_data.high_24h.usd,
            low24h: data.market_data.low_24h.usd,
        };
    } catch (error) {
        console.error('CoinGecko API error:', error);
        return `Error fetching data for ${symbol}: ${error.message}`;
    }
}


// Function to fetch liquidity pools data
async function getLiquidityPools(network = 'all', page = 1) {
    try {
        const url = `https://api.coingecko.com/api/v3/onchain/networks/${network}/pools?page=${page}`;
        const options = {
            method: 'GET',
            headers: {
                'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
                'accept': 'application/json'
            }
        };

        console.log('Calling CoinGecko Pools API:', url);
        const response = await fetch(url, options);

        console.log('Pools API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Pools API error response:', errorText);
            throw new Error(`Pools API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        // Return top pools with relevant info
        return data.data?.slice(0, 10).map(pool => ({
            name: pool.attributes.name,
            address: pool.attributes.address,
            network: pool.attributes.network,
            dex: pool.attributes.dex_id,
            baseToken: pool.attributes.base_token_symbol,
            quoteToken: pool.attributes.quote_token_symbol,
            priceUsd: pool.attributes.price_in_usd,
            liquidity: pool.attributes.reserve_in_usd,
            volume24h: pool.attributes.volume_usd?.h24,
            priceChange24h: pool.attributes.price_percent_change?.h24,
        })) || [];
    } catch (error) {
        console.error('Liquidity Pools API error:', error);
        return `Error fetching liquidity pools: ${error.message}`;
    }
}


// Function to search for specific pool by token pair
async function searchPool(token1, token2, network = 'eth') {
    try {
        const pools = await getLiquidityPools(network);
        
        if (typeof pools === 'string') return pools; // Error message
        
        // Search for pools containing both tokens
        const matchingPools = pools.filter(pool => 
            (pool.baseToken?.toLowerCase().includes(token1.toLowerCase()) && 
             pool.quoteToken?.toLowerCase().includes(token2.toLowerCase())) ||
            (pool.baseToken?.toLowerCase().includes(token2.toLowerCase()) && 
             pool.quoteToken?.toLowerCase().includes(token1.toLowerCase()))
        );
        
        return matchingPools.length > 0 ? matchingPools : `No pools found for ${token1}/${token2} on ${network}`;
    } catch (error) {
        console.error('Pool search error:', error);
        return `Error searching for pool: ${error.message}`;
    }
}


// Function to get newly listed coins/tokens
async function getNewlyListedCoins() {
    try {
        // CoinGecko's "recently added" endpoint
        const url = 'https://api.coingecko.com/api/v3/coins/list/new';
        const options = {
            method: 'GET',
            headers: {
                'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
                'accept': 'application/json'
            }
        };

        console.log('Fetching newly listed coins from CoinGecko...');
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('New coins API error:', errorText);
            throw new Error(`New coins API returned ${response.status}`);
        }

        const newCoins = await response.json();
        
        // Get detailed data for the new coins (first 10)
        const detailedCoins = [];
        for (let i = 0; i < Math.min(newCoins.length, 10); i++) {
            try {
                const coinId = newCoins[i].id;
                const detailUrl = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`;
                const detailResponse = await fetch(detailUrl, options);
                
                if (detailResponse.ok) {
                    const coinData = await detailResponse.json();
                    detailedCoins.push({
                        id: coinData.id,
                        name: coinData.name,
                        symbol: coinData.symbol?.toUpperCase(),
                        price: coinData.market_data?.current_price?.usd || 0,
                        marketCap: coinData.market_data?.market_cap?.usd || 0,
                        volume24h: coinData.market_data?.total_volume?.usd || 0,
                        priceChange24h: coinData.market_data?.price_change_percentage_24h || 0,
                        addedDate: coinData.asset_platform_id || 'N/A',
                        description: coinData.description?.en?.substring(0, 150) || 'No description',
                    });
                }
                // Add delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (err) {
                console.error(`Error fetching details for ${newCoins[i].id}:`, err.message);
            }
        }
        
        return detailedCoins;
    } catch (error) {
        console.error('Newly listed coins API error:', error);
        return `Error fetching newly listed coins: ${error.message}`;
    }
}

// Function to get Top Cryptocurrencies
async function getTopCryptos(limit = 10) {
    try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
        const options = {
            method: 'GET',
            headers: {
                'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
            }
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error('Failed to fetch top cryptos from CoinGecko');
        }

        const data = await response.json();
        
        return data.map(crypto => ({
            name: crypto.name,
            symbol: crypto.symbol.toUpperCase(),
            price: crypto.current_price,
            percentChange24h: crypto.price_change_percentage_24h,
            marketCap: crypto.market_cap,
            rank: crypto.market_cap_rank,
        }));
    } catch (error) {
        console.error('CoinGecko API error:', error);
        return `Error fetching top cryptos: ${error.message}`;
    }
}


// Search coins endpoint
app.get('/api/search-coins', async (req, res) => {
    try{
        const { query, limit = 10 } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Coingecko search endpoint
        const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
        const options = {
            method: 'GET',
            headers: {
                'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
                'accept': 'application/json'
            }
        };

        const response = await fetch(url, options);

        if(!response.ok) {
            throw new Error('Failed to search coins');
        }

        const data = await response.json();

        // Get detailed info for top results
        const coinIds = data.coins.slice(0, parseInt(limit)).map(coin => coin.id).join(',');

        if(!coinIds) {
            return res.json({ coins: [] });
        }

        // Fetch market data for the coins
        const marketUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false`;
        const marketResponse = await fetch(marketUrl, options);

        if(!marketResponse.ok) {
            throw new Error('Failed to fetch market data');
        }

        const marketData = await marketResponse.json();

        // Format the response
        const coins = marketData.map(coin => ({
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            change: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(1)}%`,
            price: coin.current_price,
            marketCap: coin.market_cap,
            image: coin.image,
            id: coin.id
        }));

        res.json({ coins });
    } catch(error) {
        console.error('Search coins error:', error);
        res.status(500).json({
            error: 'Failed to search coins',
            details: error.message 
        });
    }
});


// Api endpoint for Trending page cryptocurrency
app.get('/api/top-cryptos', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const topCryptos = await getTopCryptos(parseInt(limit));

        if(typeof topCryptos === 'string') {
            return res.status(500).json({ error: topCryptos})
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


// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        // Get the last user message to check if it needs live data.
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();

        // Combine system prompt with the conversation history
        let conversationText = CRYPTO_SYSTEM_PROMPT + '\n\n';

        // Check if user is asking for price or market data
        const priceKeywords = ['price', 'cost', 'worth', 'value', 'trading at', 'current', 'worth now', 'market cap', 'volume', 'percent change', 'change', 'up', 'down', 'performance','data','stats', 'statistics', 'exchange rate', 'quote'];
        const needsLiveData = priceKeywords.some(keyword => 
            lastUserMessage?.content.toLowerCase().includes(keyword)
        );

        // If asking about specific crypto price, fetch live data.
        if (needsLiveData && lastUserMessage) {
            const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOGE', 'DOT', 'MATIC', 'LINK', 'UNI', 'AVAX', 'LTC'];
            const mentionedCrypto = cryptoSymbols.find(symbol => 
                lastUserMessage.content.toUpperCase().includes(symbol) ||
                lastUserMessage.content.toLowerCase().includes(symbol.toLowerCase())
            )

            if(mentionedCrypto) {
                console.log(`Fetching live data for ${mentionedCrypto}...`);
                const liveData = await getCryptoPrice(mentionedCrypto);
                
                if (typeof liveData === 'object') {
                    conversationText += `\n[LIVE DATA FROM COINMARKETCAP]\n`;
                    conversationText += `${liveData.name} (${liveData.symbol}):\n`;
                    conversationText += `- Current Price: ${liveData.price.toFixed(2)}\n`;
                    conversationText += `- 24h Change: ${liveData.percentChange24h.toFixed(2)}%\n`;
                    conversationText += `- 7d Change: ${liveData.percentChange7d.toFixed(2)}%\n`;
                    conversationText += `- Market Cap: ${(liveData.marketCap / 1e9).toFixed(2)}B\n`;
                    conversationText += `- 24h Volume: ${(liveData.volume24h / 1e9).toFixed(2)}B\n`;
                    conversationText += `- Market Rank: #${liveData.rank}\n\n`;
                }
            }
        }


        // Check if asking for top cryptos
        if (lastUserMessage?.content.toLowerCase().includes('top') && 
            (lastUserMessage.content.toLowerCase().includes('crypto') || 
             lastUserMessage.content.toLowerCase().includes('coin'))) {
            console.log('Fetching top cryptocurrencies...');
            const topCryptos = await getTopCryptos(10);
            
            if (Array.isArray(topCryptos)) {
                conversationText += `\n[LIVE TOP 10 CRYPTOCURRENCIES]\n`;
                topCryptos.forEach(crypto => {
                    conversationText += `${crypto.rank}. ${crypto.name} (${crypto.symbol}): ${crypto.price.toFixed(2)} (${crypto.percentChange24h.toFixed(2)}% 24h)\n`;
                });
                conversationText += `\n`;
            }
        }

        // Check if asking about liquidity pools
        const poolKeywords = ['pool', 'liquidity', 'dex', 'uniswap', 'pancakeswap', 'trading pair'];
        const askingAboutPools = poolKeywords.some(keyword => 
            lastUserMessage?.content.toLowerCase().includes(keyword)
        );

        if (askingAboutPools && lastUserMessage) {
            // Check if asking about specific token pair (e.g., "ETH/USDC pool" or "Bitcoin USDT pool")
            const pairPattern = /(\w+)[\s/]+(usdt|usdc|dai|eth|btc|bnb)/i;
            const pairMatch = lastUserMessage.content.match(pairPattern);
            
            if (pairMatch) {
                // User is asking about a specific trading pair
                const token1 = pairMatch[1];
                const token2 = pairMatch[2];
                
                console.log(`Searching for ${token1}/${token2} pool...`);
                
                // Check if specific network mentioned
                const networks = ['eth', 'bsc', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'solana'];
                const mentionedNetwork = networks.find(net => 
                    lastUserMessage.content.toLowerCase().includes(net)
                ) || 'eth';
                
                const specificPool = await searchPool(token1, token2, mentionedNetwork);
                
                if (Array.isArray(specificPool) && specificPool.length > 0) {
                    conversationText += `\n[${token1.toUpperCase()}/${token2.toUpperCase()} POOLS ON ${mentionedNetwork.toUpperCase()}]\n`;
                    specificPool.forEach((pool, idx) => {
                        conversationText += `${idx + 1}. ${pool.name}\n`;
                        conversationText += `   DEX: ${pool.dex || 'N/A'}\n`;
                        conversationText += `   Liquidity: $${pool.liquidity ? (pool.liquidity / 1e6).toFixed(2) : 'N/A'}M\n`;
                        conversationText += `   24h Volume: $${pool.volume24h ? (pool.volume24h / 1e6).toFixed(2) : 'N/A'}M\n\n`;
                    });
                } else if (typeof specificPool === 'string') {
                    conversationText += `\n[${specificPool}]\n\n`;
                }
            } else {
                // General pools query - show top pools
                console.log('Fetching top liquidity pools...');
                
                const networks = ['eth', 'bsc', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'solana'];
                const mentionedNetwork = networks.find(net => 
                    lastUserMessage.content.toLowerCase().includes(net)
                ) || 'eth';

                const poolsData = await getLiquidityPools(mentionedNetwork);
                
                if (Array.isArray(poolsData) && poolsData.length > 0) {
                    conversationText += `\n[TOP LIQUIDITY POOLS ON ${mentionedNetwork.toUpperCase()}]\n`;
                    poolsData.forEach((pool, idx) => {
                        conversationText += `${idx + 1}. ${pool.name} (${pool.baseToken}/${pool.quoteToken})\n`;
                        conversationText += `   DEX: ${pool.dex || 'N/A'}\n`;
                        conversationText += `   Liquidity: $${pool.liquidity ? (pool.liquidity / 1e6).toFixed(2) : 'N/A'}M\n\n`;
                    });
                }
            }
        }


        // Check if asking about newly listed coins
        const newCoinKeywords = ['new coin', 'new token', 'newly listed', 'just listed', 'recently added', 'latest coin', 'new release'];
        const askingAboutNewCoins = newCoinKeywords.some(keyword => 
            lastUserMessage?.content.toLowerCase().includes(keyword)
        );

        if (askingAboutNewCoins && lastUserMessage) {
            console.log('Fetching newly listed coins...');
            const newCoins = await getNewlyListedCoins();
            
            if (Array.isArray(newCoins) && newCoins.length > 0) {
                conversationText += `\n[NEWLY LISTED COINS/TOKENS]\n`;
                newCoins.forEach((coin, idx) => {
                    conversationText += `${idx + 1}. ${coin.name} (${coin.symbol})\n`;
                    conversationText += `   Price: $${coin.price.toFixed(8)}\n`;
                    conversationText += `   Market Cap: $${(coin.marketCap / 1e6).toFixed(2)}M\n`;
                    conversationText += `   24h Volume: $${(coin.volume24h / 1e6).toFixed(2)}M\n`;
                    conversationText += `   24h Change: ${coin.priceChange24h.toFixed(2)}%\n`;
                    conversationText += `   Platform: ${coin.addedDate}\n`;
                    conversationText += `   Info: ${coin.description}...\n\n`;
                });
                conversationText += `[END OF NEW COINS DATA]\n\n`;
            } else if (typeof newCoins === 'string') {
                conversationText += `\n[${newCoins}]\n\n`;
            }
        }

        
        messages.forEach(msg => {
            if (msg.role === 'user') {
                conversationText += `User: ${msg.content}\n\n`;
            } else if (msg.role === 'assistant') {
                conversationText += `Assistant: ${msg.content}\n\n`;
            }
        });

        // Generate response
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: conversationText,
        });

        const text = response.text;

        console.log('Gemini response received');

        res.json({
            message: text,
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            error: 'Failed to get response',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Gemini AI: ${process.env.GEMINI_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
});