'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, Info, ExternalLink } from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href: string;
    isExternal?: boolean;
}

// 只保留真实存在的页面：未实现的功能不进入导航（诚实的界面）
const NAV_ITEMS: NavItem[] = [
    {
        id: 'home',
        label: '首页',
        icon: <Sparkles className="w-4 h-4" />,
        href: '/',
    },
    {
        id: 'about',
        label: '关于',
        icon: <Info className="w-4 h-4" />,
        href: 'https://github.com/kevin1000x/wuthering-luck',
        isExternal: true,
    },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // 监听滚动（passive：不阻塞滚动合成）
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const itemClass = (active: boolean) =>
        `flex items-center gap-2 px-4 py-2 rounded-xl font-display text-sm
         transition-colors duration-200 ${active
            ? 'bg-ww-gold/15 text-ww-gold border border-ww-gold/30'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,border-color] duration-300 ${isScrolled
                ? 'py-2 bg-black/60 backdrop-blur-xl border-b border-white/10'
                : 'py-4 bg-transparent'
                }`}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 cursor-pointer group"
                        aria-label="返回首页"
                    >
                        {/* 音频波形 Logo */}
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-ww-gold/20 to-ww-purple/20
                                          group-hover:from-ww-gold/30 group-hover:to-ww-purple/30" />
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
                            <p className="text-lg font-bold font-display tracking-wide">
                                <span className="text-ww-gold">鸣潮</span>
                                <span className="text-white/90">运势</span>
                            </p>
                            <p className="text-[10px] text-white/30 font-display tracking-widest uppercase -mt-0.5">
                                Fortune Detector
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_ITEMS.map((item) =>
                            item.isExternal ? (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={itemClass(false)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    <ExternalLink className="w-3 h-3 opacity-50" />
                                </a>
                            ) : (
                                <Link key={item.id} href={item.href} className={itemClass(pathname === item.href)}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            )
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
                        aria-expanded={isMobileMenuOpen}
                        className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
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
                    className={`md:hidden overflow-hidden transition-[max-height,margin] duration-300 ${isMobileMenuOpen ? 'max-h-80 mt-4' : 'max-h-0'
                        }`}
                >
                    <div className="glass-card rounded-xl p-2 space-y-1">
                        {NAV_ITEMS.map((item) =>
                            item.isExternal ? (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-display text-sm
                                              transition-colors duration-200 text-white/60 hover:text-white hover:bg-white/5"
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    <ExternalLink className="w-3 h-3 opacity-50 ml-auto" />
                                </a>
                            ) : (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-display text-sm
                                              transition-colors duration-200 ${pathname === item.href
                                        ? 'bg-ww-gold/15 text-ww-gold'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
