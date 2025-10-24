const fetchTopCryptos = async (limit: number = 50) => {
    try {
        const response = await fetch(`/api/top-cryptos?limit=${limit}`);

        if (!response.ok) {
            throw new Error('Failed to fetch top cryptos');
        }

        const data = await response.json();
        return data.coins; // Array of coins
    } catch (error) {
        console.error('Error fetching top cryptos:', error);
        return [];
    }
};

// Usage examples:
const top50 = await fetchTopCryptos(50);  // Get 50 coins
const top100 = await fetchTopCryptos(100); // Get 100 coins
const top10 = await fetchTopCryptos();     // Default 10 coins