'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Calendar, History, Info, ExternalLink } from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
    isExternal?: boolean;
    isActive?: boolean;
}

interface NavbarProps {
    currentPage?: string;
    onNavigate?: (pageId: string) => void;
}

export default function Navbar({ currentPage = 'home', onNavigate }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 监听滚动
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems: NavItem[] = [
        {
            id: 'home',
            label: '首页',
            icon: <Sparkles className="w-4 h-4" />,
        },
        {
            id: 'gacha',
            label: '当期卡池',
            icon: <Calendar className="w-4 h-4" />,
        },
        {
            id: 'history',
            label: '历史记录',
            icon: <History className="w-4 h-4" />,
        },
        {
            id: 'about',
            label: '关于',
            icon: <Info className="w-4 h-4" />,
        },
    ];

    const handleNavClick = (item: NavItem) => {
        if (item.isExternal && item.href) {
            window.open(item.href, '_blank');
        } else if (onNavigate) {
            onNavigate(item.id);
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'py-2 bg-black/60 backdrop-blur-xl border-b border-white/10'
                    : 'py-4 bg-transparent'
                }`}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => onNavigate?.('home')}
                    >
                        {/* 音频波形 Logo */}
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-ww-gold/20 to-ww-purple/20 
                                          group-hover:from-ww-gold/30 group-hover:to-ww-purple/30 transition-all" />
                            <div className="relative flex items-end gap-0.5 h-5">
                                <span className="w-1 bg-ww-gold rounded-full animate-[wave_1s_ease-in-out_infinite]"
                                    style={{ height: '40%', animationDelay: '0ms' }} />
                                <span className="w-1 bg-ww-gold rounded-full animate-[wave_1s_ease-in-out_infinite]"
                                    style={{ height: '70%', animationDelay: '150ms' }} />
                                <span className="w-1 bg-ww-gold rounded-full animate-[wave_1s_ease-in-out_infinite]"
                                    style={{ height: '100%', animationDelay: '300ms' }} />
                                <span className="w-1 bg-ww-gold rounded-full animate-[wave_1s_ease-in-out_infinite]"
                                    style={{ height: '70%', animationDelay: '450ms' }} />
                                <span className="w-1 bg-ww-gold rounded-full animate-[wave_1s_ease-in-out_infinite]"
                                    style={{ height: '40%', animationDelay: '600ms' }} />
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold font-display tracking-wide">
                                <span className="text-ww-gold">鸣潮</span>
                                <span className="text-white/90">运势</span>
                            </h1>
                            <p className="text-[10px] text-white/30 font-display tracking-widest uppercase -mt-0.5">
                                Fortune Detector
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display text-sm
                                          transition-all duration-200 ${currentPage === item.id
                                        ? 'bg-ww-gold/15 text-ww-gold border border-ww-gold/30'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                {item.isExternal && <ExternalLink className="w-3 h-3 opacity-50" />}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-80 mt-4' : 'max-h-0'
                        }`}
                >
                    <div className="glass-card rounded-xl p-2 space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-display text-sm
                                          transition-all duration-200 ${currentPage === item.id
                                        ? 'bg-ww-gold/15 text-ww-gold'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                {item.isExternal && <ExternalLink className="w-3 h-3 opacity-50 ml-auto" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
