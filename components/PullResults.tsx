'use client';

import { GachaResult, getCharacterImageSlug } from '@/lib/dailyLuck';
import { Star, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

interface PullResultsProps {
    results: GachaResult[];
}

// 角色头像：优先加载 public/characters/{slug}.png，缺失时用稀有度渐变占位
function CharacterAvatar({ name, rarity }: { name?: string; rarity: number }) {
    const [imgFailed, setImgFailed] = useState(false);
    const slug = name ? getCharacterImageSlug(name) : undefined;

    if (!slug || imgFailed) {
        const fallbackBg = rarity === 5
            ? 'linear-gradient(160deg, rgba(212,175,55,0.35) 0%, rgba(120,90,20,0.25) 55%, rgba(0,0,0,0.45) 100%)'
            : 'linear-gradient(160deg, rgba(155,89,182,0.32) 0%, rgba(60,30,90,0.28) 55%, rgba(0,0,0,0.45) 100%)';
        return (
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: fallbackBg }}
            >
                <span className="text-xl font-bold font-display text-white/85">
                    {name?.charAt(0) ?? '?'}
                </span>
            </div>
        );
    }

    return (
        // 原生 <img> 是刻意选择：需要 onError 回退到渐变占位头像
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`/characters/${slug}.png`}
            alt={name}
            onError={() => setImgFailed(true)}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover object-top"
        />
    );
}

// 单个卡片组件（入场由 .deal-card 的 CSS animation-delay 驱动）
function PullCard({
    result,
    index
}: {
    result: GachaResult;
    index: number;
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
            hasShimmer: false,
            hasGlow: false,
        },
        3: {
            containerClass: `
        border border-ww-blue/30
        bg-gradient-to-b from-ww-blue/8 to-black/25
      `,
            iconClass: 'text-ww-blue/70',
            starColor: 'text-ww-blue/60',
            hasShimmer: false,
            hasGlow: false,
        },
    };

    const config = rarityConfig[result.rarity as 3 | 4 | 5];

    return (
        <div
            className={`
        pull-card deal-card relative w-[80px] h-[112px] rounded-md overflow-hidden
        ${config.containerClass}
      `}
            style={{ animationDelay: `${index * 24}ms` }}
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

            {/* 角色立绘 / 占位 */}
            <div className="absolute inset-0">
                {result.name ? (
                    <CharacterAvatar name={result.name} rarity={result.rarity} />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center pb-6">
                        <Star className={`w-8 h-8 ${config.iconClass}`} fill="currentColor" />
                    </div>
                )}
            </div>

            {/* 底部名称与星级 */}
            <div className="absolute bottom-1.5 left-0 right-0 z-10 flex flex-col items-center gap-1">
                {result.name && (
                    <span className="max-w-[76px] truncate text-[10px] leading-none font-medium text-white/90">
                        {result.name}
                    </span>
                )}
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
    const [onlyHighRarity, setOnlyHighRarity] = useState(false);

    // 展示列表：可切换为"仅4星以上"，避免70张长列表难翻。
    // 必须 useMemo：引用稳定才不会重复触发卡片重挂载动画。
    const displayResults = useMemo(
        () => (onlyHighRarity ? results.filter(r => r.rarity >= 4) : results),
        [results, onlyHighRarity]
    );

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
                    <span className="text-ww-blue/60">
                        ★3 ×{threeStarCount}
                    </span>
                </div>
            </div>

            {/* 筛选条 */}
            <div className="mb-3 flex items-center gap-2">
                {([
                    ['all', '全部'],
                    ['high', '仅4★以上'],
                ] as const).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setOnlyHighRarity(key === 'high')}
                        aria-pressed={onlyHighRarity === (key === 'high')}
                        className={`px-3 py-1 rounded-lg text-xs font-display transition-colors ${onlyHighRarity === (key === 'high')
                            ? 'bg-ww-gold/15 text-ww-gold border border-ww-gold/30'
                            : 'text-white/50 border border-white/10 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {label}
                        {key === 'high' && fourStarCount + fiveStarCount > 0 && (
                            <span className="ml-1.5 opacity-70">{fourStarCount + fiveStarCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* 卡片容器 */}
            <div className="pull-scroll flex flex-wrap gap-2.5 justify-center max-h-[520px] overflow-y-auto py-2">
                {displayResults.map((result, index) => (
                    <PullCard
                        key={`${result.pullNumber}-${index}`}
                        result={result}
                        index={index}
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
