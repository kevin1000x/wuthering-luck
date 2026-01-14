import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'ww-dark': '#1a1a1a',
                'ww-gold': '#d4af37',
                'ww-purple': '#9b59b6',
                'ww-blue': '#3498db',
                'ww-gray': '#2d2d2d',
                'ww-light-gray': '#404040',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'pulse-gold': 'pulseGold 2s ease-in-out infinite',
                'wave-flow': 'waveFlow 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseGold: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px #d4af37, 0 0 40px #d4af3780, 0 0 60px #d4af3740',
                        textShadow: '0 0 10px #d4af37, 0 0 20px #d4af3780'
                    },
                    '50%': {
                        boxShadow: '0 0 40px #d4af37, 0 0 80px #d4af3780, 0 0 120px #d4af3740',
                        textShadow: '0 0 20px #d4af37, 0 0 40px #d4af3780'
                    },
                },
                waveFlow: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f4e5b0 50%, #d4af37 100%)',
                'purple-gradient': 'linear-gradient(135deg, #9b59b6 0%, #c39bd3 50%, #9b59b6 100%)',
            },
        },
    },
    plugins: [],
};

export default config;
