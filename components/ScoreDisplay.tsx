'use client';

interface ScoreDisplayProps {
    score: number;
    level: string;
}

export default function ScoreDisplay({ score, level }: ScoreDisplayProps) {
    const isHighScore = score >= 90;
    const isMediumScore = score >= 60;

    return (
        <div className="glass-card rounded-2xl p-8 card-hover text-center relative overflow-hidden">
            {/* 高分背景光效 */}
            {isHighScore && (
                <div className="absolute inset-0 bg-gradient-to-br from-ww-gold/10 via-transparent to-transparent pointer-events-none" />
            )}

            <h3 className="text-white/40 text-sm uppercase tracking-[0.2em] mb-6 font-display relative z-10">
                今日运势评分
            </h3>

            {/* 巨大分数显示 */}
            <div className="relative inline-block z-10">
                <span
                    className={`text-8xl md:text-9xl font-bold font-display ${isHighScore
                            ? 'gold-glow'
                            : isMediumScore
                                ? 'gold-number'
                                : 'text-white/60'
                        }`}
                >
                    {score}
                </span>
                <span className="text-3xl text-white/30 ml-2 font-display">/100</span>

                {/* 高分光环效果 */}
                {isHighScore && (
                    <>
                        <div className="absolute -inset-8 bg-ww-gold/20 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute -inset-4 bg-ww-gold/10 rounded-full blur-2xl -z-10" />
                    </>
                )}
            </div>

            {/* 运势等级 */}
            <p className={`mt-6 text-xl font-display tracking-wide relative z-10 ${isHighScore ? 'gold-title' : 'text-white/60'
                }`}>
                {level}
            </p>
        </div>
    );
}
