import { ArrowUpIcon, X, LogOut } from "lucide-react";
import { IconPlus } from "@tabler/icons-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ChatSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";



interface Message {
    id: number,
    role: "user" | "assistant",
    content: string,
}

interface Coin {
    name: string,
    symbol: string,
    change: string,
    price: number,
    marketCap: number,
    image: string,
    id?: string,
}

const user = { name: "User" }; 

const API_URL = import.meta.env.VITE_API_URL || '';


export default function Chat({ children }: {children: React.ReactNode}) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "assistant",
            content: `Hello ${user.name}! I'm your AI crypto assistant. curious about which coin’s next to boom? `,
        }
    ]);
    const [input, setInput] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [searchResults, setSearchResults] = useState<Coin[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");


    const searchAnyCoins = async (searchQuery: string): Promise<Coin[]> => {
        try{
            const response = await fetch(`${API_URL}/api/search-coins?query=${encodeURIComponent(searchQuery)}&limit=10`);

            if(!response) {
                throw new Error('Failed to search coins');
            }

            const data = await response.json();
            return data.coins as Coin[];
        } catch (error) {
            console.error('Error searching coins:', error);
            return [];
        }
    }

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: messages.length + 1,
            role: "user",
            content: input,
        };

        const coins = await searchAnyCoins("");
        setSearchResults(coins);

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: updatedMessages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: updatedMessages.length + 1,
                role: "assistant",
                content: data.message,
            };

            setMessages([...updatedMessages, assistantMessage]);
        } catch (error) {
            console.error("Error calling API:", error);
            
            const errorMessage: Message = {
                id: updatedMessages.length + 1,
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
            };
            setMessages([...updatedMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }


    // Handler for Search input in overlay
    const handleSearchOverlay = async (query: string): Promise<void> => {
        setSearchQuery(query);

        if(query.trim()) {
            const coins = await searchAnyCoins(query);
            setSearchResults(coins);
        } else {
            setSearchResults([]);
        }
    }

    // Handle coin selection
    const handleCoinSelect = (coin: Coin): void => {
        setInput(`Tell me about ${coin.name} (${coin.symbol})`);
        setShowOverlay(false);
    }

    return(
        <SidebarProvider>
            <div className="flex h-screen w-full">
                {/* Sidebar - fixed on the left */}
                <AppSidebar />
            
                {/* Main content area */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Header with trigger */}
                    <div className="p-4 border-b">
                        <SidebarTrigger />
                    </div>
                
                    {/* Chat messages area - scrollable */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {children}
                        {/* Your chat messages will go here */}
                        <ScrollArea className="flex-1 p-6">
                            <div className="max-w-3xl mx-auto space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`bg-black/10 backdrop-blur-md rounded-lg border-white/10 p-4 max-w-[80%] ${
                                                message.role === "user" ? "bg-primary/10 border-primary/20" : ""
                                            }`}
                                        >
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    
                    {/* Search Overlay */}
                    {showOverlay && (
                        <div className="absolute bottom-24 left-0 right-0 mx-auto max-w-3xl px-4 animate-fade-in">
                            <div className="p-4 mb-2 bg-blue-500/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold">Search Crypto</h3>
                                    <button onClick={() => setShowOverlay(false)}>
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <Input 
                                    placeholder="Search for any cryptocurrency..." 
                                    className="glass mb-4"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchOverlay(e.target.value)} 
                                />
                                <div className="flex flex-wrap gap-2">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((coin) => (
                                            <Button
                                                key={coin.symbol}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCoinSelect(coin)}
                                            >
                                                <span className="font-semibold">{coin.symbol}</span>
                                                <span className={`ml-2 text-xs ${coin.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                                    {coin.change}
                                                </span>
                                            </Button>
                                        ))
                                    ): (
                                        <p className="text-sm text-gray-400">
                                            {searchQuery ? 'No coins found' : 'Type to search...'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                
                    {/* Input area - fixed at bottom */}
                    <div className="border-t bg-white px-4 py-4">
                        <div className="max-w-3xl mx-auto">
                            <InputGroup>
                                <InputGroupTextarea 
                                    placeholder="Ask about any Cryptocurrency..." 
                                    value={input}
                                    disabled={isLoading}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            if (input.trim()) { 
                                                handleSend();
                                            }
                                        }
                                    }}
                                />
                                <InputGroupAddon align="block-end" className="flex justify-between w-full">
                                    <InputGroupButton
                                        variant="outline"
                                        onClick={() => setShowOverlay(!showOverlay)}
                                        className="rounded-full"
                                        size="icon-xs"
                                    >
                                        <IconPlus 
                                            className={`transition-transform ${showOverlay ? "rotate-45" : ""}`}
                                        />
                                    </InputGroupButton>

                                    
                                    <InputGroupButton
                                        variant="default"
                                        className="rounded-full"
                                        size="icon-xs"
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                    >
                                        <ArrowUpIcon />
                                        <span className="sr-only">Send</span>
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}