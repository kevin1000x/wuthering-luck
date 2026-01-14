'use client';

import { forwardRef } from 'react';
import { Flame, Wind, Zap, Snowflake, Radio, Atom, Sparkles, Star } from 'lucide-react';
import { DailyFortuneData, WutheringElement } from '@/lib/dailyLuck';

interface ShareCardProps {
    fortune: DailyFortuneData;
    pullStats: {
        star5: number;
        star4: number;
        star3: number;
    };
}

// 属性图标映射
const elementIcons: Record<WutheringElement, React.ReactNode> = {
    '热熔': <Flame size={28} color="#f97316" />,
    '衍射': <Radio size={28} color="#facc15" />,
    '气动': <Wind size={28} color="#34d399" />,
    '冷凝': <Snowflake size={28} color="#22d3ee" />,
    '导电': <Zap size={28} color="#c084fc" />,
    '湮灭': <Atom size={28} color="#ec4899" />,
};

// 属性颜色
const elementColors: Record<WutheringElement, string> = {
    '热熔': '#f97316',
    '衍射': '#facc15',
    '气动': '#34d399',
    '冷凝': '#22d3ee',
    '导电': '#c084fc',
    '湮灭': '#ec4899',
};

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ fortune, pullStats }, ref) => {
    const date = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const isHighScore = fortune.luckScore >= 75;
    const elementColor = elementColors[fortune.luckyElement];

    return (
        <div
            ref={ref}
            style={{
                width: '420px',
                padding: '32px',
                background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 50%, #0a0a12 100%)',
                borderRadius: '24px',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                color: '#ffffff',
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
            }}
        >
            {/* 顶部标题 */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '4px',
                    marginBottom: '8px'
                }}>
                    鸣潮运势检测仪
                </div>
                <div style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.3)'
                }}>
                    {date}
                </div>
            </div>

            {/* 分数区域 */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '20px',
                border: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '72px',
                        fontWeight: '800',
                        color: isHighScore ? '#d4af37' : '#ffffff',
                        lineHeight: '1',
                        textShadow: isHighScore ? '0 0 30px rgba(212,175,55,0.5)' : 'none',
                    }}>
                        {fortune.luckScore}
                    </div>
                    <div style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.4)',
                        marginTop: '4px'
                    }}>
                        / 100
                    </div>
                    <div style={{
                        marginTop: '16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 20px',
                        background: isHighScore ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        border: isHighScore ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <Sparkles size={16} color={isHighScore ? '#d4af37' : '#888'} />
                        <span style={{
                            fontSize: '14px',
                            color: isHighScore ? '#d4af37' : 'rgba(255,255,255,0.6)',
                            fontWeight: '600'
                        }}>
                            {fortune.luckLevel}
                        </span>
                    </div>
                </div>
            </div>

            {/* 幸运属性 + 模拟统计 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
            }}>
                {/* 幸运属性 */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid rgba(255,255,255,0.05)',
                }}>
                    <div style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.4)',
                        marginBottom: '12px',
                        letterSpacing: '2px'
                    }}>
                        幸运属性
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {elementIcons[fortune.luckyElement]}
                        </div>
                        <span style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: elementColor
                        }}>
                            {fortune.luckyElement}
                        </span>
                    </div>
                </div>

                {/* 模拟统计 */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid rgba(255,255,255,0.05)',
                }}>
                    <div style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.4)',
                        marginBottom: '12px',
                        letterSpacing: '2px'
                    }}>
                        模拟30抽
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={14} fill="#d4af37" color="#d4af37" />
                            <span style={{ color: '#d4af37', fontWeight: '700', fontSize: '16px' }}>
                                {pullStats.star5}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={14} fill="#a855f7" color="#a855f7" />
                            <span style={{ color: '#a855f7', fontWeight: '700', fontSize: '16px' }}>
                                {pullStats.star4}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={14} fill="#6b7280" color="#6b7280" />
                            <span style={{ color: '#6b7280', fontWeight: '700', fontSize: '16px' }}>
                                {pullStats.star3}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 今日建议 */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.02) 100%)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(212,175,55,0.15)',
                marginBottom: '24px',
            }}>
                <div style={{
                    fontSize: '11px',
                    color: 'rgba(212,175,55,0.6)',
                    marginBottom: '8px',
                    letterSpacing: '2px'
                }}>
                    今日建议
                </div>
                <div style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: '1.6'
                }}>
                    {fortune.recommendation}
                </div>
            </div>

            {/* 底部水印 */}
            <div style={{
                textAlign: 'center',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.25)',
                    letterSpacing: '1px'
                }}>
                    鸣潮运势检测仪 · 仅供娱乐
                </div>
            </div>
        </div>
    );
});

ShareCard.displayName = 'ShareCard';

export default ShareCard;
