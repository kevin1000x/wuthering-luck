'use client';

import { Star } from 'lucide-react';
import { WutheringElement } from '@/lib/dailyLuck';

interface ScoreDisplayProps {
    score: number;
    level: string;
    luckyElement: WutheringElement;
    elementIcon: React.ReactNode;
    echoSets: string[];
    recommendation: string;
    /** 区块头右侧的操作槽位（如分享按钮） */
    action?: React.ReactNode;
}

/**
 * 区块 01 · 检测报告头。
 * 非对称构成：左侧巨型分数数字，右侧等级/属性/声骸纵列，
 * 底部为今日建议横带——替代旧版"两张对称卡"的模板布局。
 */
export default function ScoreDisplay({
    score,
    level,
    luckyElement,
    elementIcon,
    echoSets,
    recommendation,
    action,
}: ScoreDisplayProps) {
    // 与趋势图例同一套三级色：75+ 金 / 50-74 薄荷 / <50 中性
    const isGreat = score >= 75;
    const isOkay = score >= 50;

    return (
        <div className="reveal-in">
            <div className="section-head mb-4">
                <span className="index">01</span>
                <h3 className="text-lg md:text-xl font-bold text-white font-display tracking-wide whitespace-nowrap">检测结果</h3>
                <span className="text-xs text-white/35 font-display tracking-[0.25em] uppercase">Fortune Report</span>
                <span className="rule" />
                {action}
            </div>

            <div className="hud-panel corner-brackets p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
                    {/* 巨型分数 */}
                    <div className="relative flex items-baseline justify-center sm:justify-start shrink-0 sm:pr-8 sm:border-r border-white/8 w-full sm:w-auto">
                        <span
                            className={`text-8xl md:text-9xl font-bold font-display tabular-nums leading-none ${isGreat
                                ? 'gold-glow'
                                : isOkay
                                    ? 'text-ww-mint'
                                    : 'text-white/60'
                                }`}
                        >
                            {score}
                        </span>
                        <span className="text-lg text-white/30 ml-2 font-display">/100</span>

                        {isGreat && (
                            <div className="absolute -inset-6 bg-ww-gold/15 rounded-full blur-3xl -z-10" />
                        )}
                    </div>

                    {/* 等级 / 属性 / 声骸纵列 */}
                    <div className="flex-1 min-w-0 space-y-4">
                        <p className={`text-2xl font-display tracking-wide ${isGreat ? 'gold-title' : isOkay ? 'text-ww-mint' : 'text-white/60'
                            }`}>
                            {level}
                        </p>

                        <div className="flex items-center gap-3">
                            <div className="p-2 panel panel-gold">{elementIcon}</div>
                            <div className="min-w-0">
                                <p className="text-white/40 text-[11px] font-display tracking-[0.2em] uppercase">幸运属性</p>
                                <p className="text-lg font-bold text-white font-display">{luckyElement}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {echoSets.map((set, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-sm border border-ww-purple/25 bg-ww-purple/10 text-ww-purple font-display text-xs"
                                >
                                    {set}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 今日建议横带 */}
                <div className="mt-6 pt-5 border-t border-[color:var(--gold-hair)] flex items-start gap-3">
                    <Star className="w-4 h-4 text-ww-gold mt-0.5 shrink-0" fill="currentColor" />
                    <p className="text-white/70 leading-relaxed text-sm md:text-base">{recommendation}</p>
                </div>
            </div>
        </div>
    );
}
