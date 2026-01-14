'use client';

import { GachaResult } from '@/lib/dailyLuck';
import { Star, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PullResultsProps {
    results: GachaResult[];
}

// 单个卡片组件
function PullCard({
    result,
    index,
    isVisible
}: {
    result: GachaResult;
    index: number;
    isVisible: boolean;
}) {
    // 生成星星数量
    const renderStars = (count: number, colorClass: string) => {
        return (
            <div className="flex items-center justify-center gap-0.5">
                {Array.from({ length: count }).map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3 h-3 ${colorClass}`}
                        fill="currentColor"
                    />
                ))}
            </div>
        );
    };

    // 稀有度配置
    const rarityConfig = {
        5: {
            containerClass: `
        border-2 border-ww-gold/80
        bg-gradient-to-b from-yellow-500/20 via-yellow-900/10 to-black/40
        shadow-[0_0_20px_rgba(212,175,55,0.4),0_0_40px_rgba(212,175,55,0.2),inset_0_0_30px_rgba(212,175,55,0.1)]
        animate-[goldPulse_2s_ease-in-out_infinite]
      `,
            iconClass: 'text-ww-gold drop-shadow-[0_0_12px_rgba(212,175,55,1)]',
            starColor: 'text-ww-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]',
            hasShimmer: true,
            hasGlow: true,
        },
        4: {
            containerClass: `
        border border-ww-purple/70
        bg-gradient-to-b from-purple-500/15 via-purple-900/10 to-black/30
        shadow-[0_0_15px_rgba(155,89,182,0.3),inset_0_0_20px_rgba(155,89,182,0.05)]
      `,
            iconClass: 'text-ww-purple drop-shadow-[0_0_8px_rgba(155,89,182,0.8)]',
            starColor: 'text-ww-purple drop-shadow-[0_0_4px_rgba(155,89,182,0.6)]',
            hasShimmer: true,
            hasGlow: false,
        },
        3: {
            containerClass: `
        border border-blue-800/40
        bg-gradient-to-b from-blue-900/10 to-black/20
      `,
            iconClass: 'text-blue-400/50',
            starColor: 'text-blue-400/40',
            hasShimmer: false,
            hasGlow: false,
        },
    };

    const config = rarityConfig[result.rarity as 3 | 4 | 5];

    return (
        <div
            className={`
        relative w-[72px] h-[96px] rounded-xl overflow-hidden backdrop-blur-md
        transition-all duration-500 ease-out
        ${config.containerClass}
        ${isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-90'
                }
        hover:scale-110 hover:z-20
      `}
            style={{
                transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
            }}
        >
            {/* 5星金色光晕背景 */}
            {result.rarity === 5 && config.hasGlow && (
                <div className="absolute inset-0 bg-gradient-radial from-ww-gold/20 via-transparent to-transparent animate-pulse" />
            )}

            {/* UP 标识 */}
            {result.isUp && result.rarity >= 4 && (
                <div className="absolute top-1.5 right-1.5 z-20">
                    <span className="px-1.5 py-0.5 text-[8px] font-bold font-display
                         bg-ww-gold/30 text-ww-gold border border-ww-gold/40 
                         rounded backdrop-blur-sm">
                        UP
                    </span>
                </div>
            )}

            {/* 中心图标 */}
            <div className="absolute inset-0 flex items-center justify-center pb-4">
                {result.rarity === 5 ? (
                    <Sparkles className={`w-10 h-10 ${config.iconClass}`} />
                ) : (
                    <Star className={`w-8 h-8 ${config.iconClass}`} fill="currentColor" />
                )}
            </div>

            {/* 底部星星等级显示 */}
            <div className="absolute bottom-2 left-0 right-0">
                {renderStars(result.rarity, config.starColor)}
            </div>

            {/* 流光效果 - 5星和4星 */}
            {config.hasShimmer && (
                <div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    style={{
                        background: result.rarity === 5
                            ? 'linear-gradient(-60deg, transparent 0%, transparent 40%, rgba(244,229,176,0.4) 50%, transparent 60%, transparent 100%)'
                            : 'linear-gradient(-60deg, transparent 0%, transparent 40%, rgba(195,155,211,0.25) 50%, transparent 60%, transparent 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'shimmerFlow 2.5s ease-in-out infinite',
                    }}
                />
            )}

            {/* 5星额外边框呼吸 */}
            {result.rarity === 5 && (
                <div className="absolute inset-0 rounded-xl border border-ww-gold/50 animate-pulse pointer-events-none" />
            )}
        </div>
    );
}

export default function PullResults({ results }: PullResultsProps) {
    const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

    // 交错显示动画
    useEffect(() => {
        setVisibleCards(new Array(results.length).fill(false));

        // 依次显示每张卡片
        results.forEach((_, index) => {
            setTimeout(() => {
                setVisibleCards(prev => {
                    const next = [...prev];
                    next[index] = true;
                    return next;
                });
            }, index * 100 + 100); // 每张卡片间隔100ms
        });
    }, [results]);

    const fiveStarCount = results.filter(r => r.rarity === 5).length;
    const fourStarCount = results.filter(r => r.rarity === 4).length;
    const threeStarCount = results.length - fiveStarCount - fourStarCount;

    return (
        <div className="glass-card rounded-2xl p-6 overflow-hidden">
            {/* 统计头部 */}
            <div className="mb-5 flex items-center justify-between">
                <span className="text-white/40 text-sm font-display tracking-wider">
                    共 <span className="gold-number text-lg">{results.length}</span> 抽
                </span>
                <div className="flex items-center gap-5 text-sm font-display">
                    {fiveStarCount > 0 && (
                        <span className="gold-number flex items-center gap-1.5 text-base animate-pulse">
                            <Sparkles className="w-4 h-4" />
                            ×{fiveStarCount}
                        </span>
                    )}
                    {fourStarCount > 0 && (
                        <span className="text-ww-purple font-semibold flex items-center gap-1">
                            <Star className="w-4 h-4" fill="currentColor" />
                            ×{fourStarCount}
                        </span>
                    )}
                    <span className="text-blue-400/50">
                        ★3 ×{threeStarCount}
                    </span>
                </div>
            </div>

            {/* 卡片容器 */}
            <div className="flex flex-wrap gap-2.5 justify-center max-h-80 overflow-y-auto py-2">
                {results.map((result, index) => (
                    <PullCard
                        key={index}
                        result={result}
                        index={index}
                        isVisible={visibleCards[index] || false}
                    />
                ))}
            </div>

            {/* 分隔线 */}
            <div className="divider-gold my-5" />

            {/* 概率统计 */}
            <div className="flex items-center justify-between text-xs text-white/30 font-display">
                <span>综合概率分析</span>
                <div className="flex gap-4">
                    <span>
                        5★ <span className="gold-number">{((fiveStarCount / results.length) * 100).toFixed(1)}%</span>
                    </span>
                    <span>
                        4★ <span className="text-ww-purple">{((fourStarCount / results.length) * 100).toFixed(1)}%</span>
                    </span>
                </div>
            </div>

            {/* 添加动画 keyframes */}
            <style jsx>{`
        @keyframes goldPulse {
          0%, 100% {
            box-shadow: 
              0 0 15px rgba(212, 175, 55, 0.4),
              0 0 30px rgba(212, 175, 55, 0.2),
              inset 0 0 20px rgba(212, 175, 55, 0.1);
          }
          50% {
            box-shadow: 
              0 0 25px rgba(212, 175, 55, 0.6),
              0 0 50px rgba(212, 175, 55, 0.3),
              inset 0 0 30px rgba(212, 175, 55, 0.15);
          }
        }
        
        @keyframes shimmerFlow {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
      `}</style>
        </div>
    );
}
