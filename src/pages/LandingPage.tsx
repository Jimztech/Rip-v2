import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Brain, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-fade-up">
                        <div className="flex items-center justify-center mb-6">
                            <h1 className="text-6xl md:text-7xl font-bold text-sky-500">Rip</h1>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            AI-Powered Crypto Insights. Be Early. Be Smart.
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Discover trending coins and get investment insights powered by AI.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/login">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Market Chart Section */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="glass-card p-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                        <h3 className="text-2xl font-bold mb-6 text-center">Market Performance</h3>
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary" />
                                <p>Live chart integration coming soon!!!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chat Preview Section */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="glass-card p-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                        <h3 className="text-2xl font-bold mb-6 text-center">AI Assistant Preview</h3>
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <div className="glass-card px-4 py-3 max-w-md">
                                    <p>What's trending this week?</p>
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="glass-card px-4 py-3 max-w-md bg-primary/10 border-primary/20">
                                    <p className="text-sm">
                                        AI suggests SOL, AVAX, and NEAR are gaining traction. 
                                        SOL shows strong momentum with a 12% increase, while AVAX and NEAR demonstrate 
                                        solid fundamentals for long-term holding.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
                        <h2 className="text-4xl font-bold mb-4">About Rip</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Rip combines AI and live crypto data to help you
                            make smarter trading decisions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass-card p-8 text-center animate-fade-up" style={{ animationDelay: "0.5s" }}>
                            <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Get AI Crypto Advice</h3>
                            <p className="text-muted-foreground">
                                Receive personalized investment insights powered by advanced AI models.
                            </p>
                        </div>

                        <div className="glass-card p-8 text-center animate-fade-up" style={{ animationDelay: "0.6s" }}>
                            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Track New Coins Early</h3>
                            <p className="text-muted-foreground">
                                Discover emerging cryptocurrencies before they hit mainstream
                            </p>
                        </div>

                        <div className="glass-card p-8 text-center animate-fade-up" style={{ animationDelay: "0.7s" }}>
                            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Real-Time Price Updates</h3>
                            <p className="text-muted-foreground">
                                Stay informed with live market data and price movements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}