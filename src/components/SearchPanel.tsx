import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchPanelProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export default function SearchPanel({ searchQuery, onSearchChange }: SearchPanelProps) {
    return(
        <div className="w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="text"
                    placeholder="Search for a cryptocurrency..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-card border-border focus:ring-primary focus:border-primary h-12 text-base"
                />
            </div>
        </div>
    )
}