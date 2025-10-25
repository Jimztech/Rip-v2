import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CryptoData{
    id: string,
    name: string,
    symbol: string,
    image: string,
    price: number,
    price_change_percentage_1h_in_currency?: number;
    percentChange24h: number;
    percentChange7d?: number;
    marketCap: number;
    circulating_supply: number;
}

interface CryptoTableProps {
    data: CryptoData[];
}

export default function CryptoTable({ data }: CryptoTableProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 6 : 2,
        }).format(price);
    };

    const formatMarketCap = (value: number | undefined | null) => {
        if(value === undefined || value === null || isNaN(value)) {
            return 'N/A';
        }
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toFixed(2)}`;
    };

    const formatSupply = (value: number | undefined | null) => {
        if(value === undefined || value === null || isNaN(value)) {
            return 'N/A';
        }
        
        if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
        return value.toLocaleString();
    };

    const formatPercentage = (value?: number) => {
        if (value === undefined || value === null) return "N/A";
        const formatted = value.toFixed(2);
        const colorClass = value >= 0 ? "text-success" : "text-destructive";
        return <span className={colorClass}>{value >= 0 ? "+" : ""}{formatted}%</span>
    };

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-border shadow-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-secondary border-border hover:bg-secondary">
                        <TableHead className="font-semibold text-foreground">Coin</TableHead>
                        <TableHead className="font-semibold text-foreground text-right">Price</TableHead>
                        <TableHead className="font-semibold text-foreground text-right hidden md:table-cell">1hr %</TableHead>
                        <TableHead className="font-semibold text-foreground text-right">24hr %</TableHead>
                        <TableHead className="font-semibold text-foreground text-right hidden lg:table-cell">7d %</TableHead>
                        <TableHead className="font-semibold text-foreground text-right hidden xl:table-cell">Market Cap %</TableHead>
                        <TableHead className="font-semibold text-foreground text-right hidden xl:table-cell">Circulating Supply</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((coin) => (
                        <TableRow
                            key={coin.id}
                            className="border-border hover:bg-secondary/50 cursor-pointer"
                        >
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={coin.image} 
                                        alt={coin.name} 
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-foreground">{coin.name}</span>
                                        <span className="text-sm text-muted-foreground uppercase">{coin.symbol}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {formatPrice(coin.price)}
                            </TableCell>
                            <TableCell className="text-right hidden md:table-cell">
                                {formatPercentage(coin.price_change_percentage_1h_in_currency)}
                            </TableCell>
                            <TableCell className="text-right">
                                {formatPercentage(coin.percentChange24h)}
                            </TableCell>
                            <TableCell className="text-right hidden lg:table-cell">
                                {formatPercentage(coin.percentChange7d)}
                            </TableCell>
                            <TableCell className="text-right hidden xl:table-cell">
                                {formatMarketCap(coin.marketCap)}
                            </TableCell>
                            <TableCell className="text-right hidden xl:table-cell">
                                {formatSupply(coin.circulating_supply)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
