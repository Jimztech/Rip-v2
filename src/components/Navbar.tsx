import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react"
import ThemeToggle from "./elements/ThemeToggle";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <div className="max-w-7xl mx-auto">
                <div className="px-6 py-3 glass-card">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                            <span className="text-sky-500">Rip</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
                                Home
                            </Link>

                            <Link to="/#about" className="text-foreground/80 hover:text-foreground transition-colors">
                                About
                            </Link>

                            <ThemeToggle />

                            <Link to="/Login">
                                <Button variant="outline" className="glass border-primary/30 hover:border-primary/50">
                                    Login
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <div className="md:hidden mt-4 pt-4 border-t border-glass-border/10 animate-fade-in">
                            <div className="flex flex-col gap-4">
                                <Link
                                    to="/"
                                    onClick={() => setIsOpen(false)}
                                    className="text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    Home
                                </Link>
                                
                                <Link
                                    to="/#about"
                                    onClick={() => setIsOpen(false)}
                                    className="text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    About
                                </Link>
                                
                                <ThemeToggle />

                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full glass border-primary/30 hover:border-primary/50">
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}