import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./use-theme";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if(!mounted) {
        return(
            <Button variant="outline" size="icon" className="h-10 w-10">
                <Sun className="h-5 w-5" />
            </Button>
        )
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-10 transition-all hover:shadow-glow border-primary/20 hover:border-primary/40"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all" />
            ) : (
                <Moon className="h-5 w-5 rotate-0 scale-100 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

export default ThemeToggle;
