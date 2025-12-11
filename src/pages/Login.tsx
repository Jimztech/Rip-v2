import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulating login, to be replaced with actual auth later on.
        setTimeout(() => {
            if(email && password) {
                toast.success("Login successful");
                navigate("/chat");
            } else {
                toast.error("Please fill in all fields")
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="glass-card p-8 animate-fade-up">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <h1 className="text-3xl font-bold text-sky-500">Rip</h1>
                        </div>
                        <h2 className="text-2xl font-semibold">Welcome Back</h2>
                        <p className="text-muted-foreground mt-2">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="glass"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="glass"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        Don't have an account? {" "}
                        <Link to="/signup" className="text-primary hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}