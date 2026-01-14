'use client';

export default function WaveDecoration() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
            {/* 顶部波形 */}
            <svg
                className="absolute top-0 left-0 w-full h-32"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
                        <stop offset="50%" stopColor="#d4af37" stopOpacity="1" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60"
                    fill="none"
                    stroke="url(#waveGradient1)"
                    strokeWidth="2"
                    className="animate-pulse"
                />
                <path
                    d="M0,80 C240,20 480,100 720,80 C960,60 1200,100 1440,80"
                    fill="none"
                    stroke="url(#waveGradient1)"
                    strokeWidth="1"
                    opacity="0.5"
                />
            </svg>

            {/* 底部波形 */}
            <svg
                className="absolute bottom-0 left-0 w-full h-32"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
            >
                <path
                    d="M0,60 C360,0 720,120 1080,60 C1260,30 1380,90 1440,60"
                    fill="none"
                    stroke="url(#waveGradient1)"
                    strokeWidth="2"
                    className="animate-pulse"
                />
            </svg>

            {/* 侧边装饰线 */}
            <div className="absolute left-4 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-ww-gold/30 to-transparent" />
            <div className="absolute right-4 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-ww-gold/30 to-transparent" />

            {/* 角落装饰 */}
            <div className="absolute top-4 left-4 w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-ww-gold/50 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-ww-gold/50 to-transparent" />
            </div>
            <div className="absolute top-4 right-4 w-16 h-16">
                <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-ww-gold/50 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-ww-gold/50 to-transparent" />
            </div>
            <div className="absolute bottom-4 left-4 w-16 h-16">
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-ww-gold/50 to-transparent" />
                <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-ww-gold/50 to-transparent" />
            </div>
            <div className="absolute bottom-4 right-4 w-16 h-16">
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-ww-gold/50 to-transparent" />
                <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-ww-gold/50 to-transparent" />
            </div>

            {/* 浮动粒子效果 */}
            <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-ww-gold/40"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.3}s`,
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
      `}</style>
        </div>
    );
}
