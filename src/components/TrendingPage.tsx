import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query"
import SearchPanel from "./SearchPanel";
import CryptoTable from "./CryptoTable";
import LoadingSpinner from "./elements/LoadingSpinner";
import { TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface CryptoData {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_1h_in_currency?: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d_in_currency?: number;
    market_cap: number;
    circulating_supply: number;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export default function TrendingPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCryptoData = async (): Promise<CryptoData[]> => {
        try {
            const response = await fetch(`${API_URL}/api/top-cryptos?limit=50`)

            if (!response.ok) {
                throw new Error('Failed to fetch top cryptos');
            }

            const data = await response.json();
            return data.coins; // Array of coins
        } catch (error) {
            console.error('Error fetching top cryptos:', error);
            return [];
        }
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["cryptoData"],
        queryFn: fetchCryptoData,
        refetchInterval: 60000,
        retry: 2,
    });

    useEffect(() => {
        if(error) {
            toast.error("Failed to fetch cryptocurrency data. Please try again later.");
        }
    }, [error]);

    const filteredData = (data || []).filter((coin) => {
        const query = searchQuery.toLowerCase();
        return (
            coin.name.toLowerCase().includes(query) ||
            coin.symbol.toLowerCase().includes(query)
        );
    })

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-primary/10 shadow-glow">
                                <TrendingUp className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                                Trending
                            </h1>
                        </div>
                    </div>
                    <p className="text-lg">
                        Real-time cryptocurrency market data and trends
                    </p>
                </div>

                <div className="mb-8">
                    <SearchPanel 
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                </div>

                {/* Table */}
                {isLoading ? (
                    <LoadingSpinner />
                ) : filteredData && filteredData.length > 0 ? (
                    <CryptoTable data={filteredData} />
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">
                            No cryptocurrency found matching your search
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}