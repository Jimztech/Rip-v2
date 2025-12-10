import { Github, Heart  } from 'lucide-react';

export default function Footer() {
    return(
        <footer className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="glass-card px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>Built with</span>
                            <Heart className='fill-red-500' />
                            <span>Rip | © {new Date().getFullYear()}</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <a 
                                href="https://x.com/Engr_Jamie"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href="https://github.com/Jimztech"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};