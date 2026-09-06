'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Camera, Download, Copy, Scan } from 'lucide-react';
import { getDailyFortune, generateTrendData, isValidUid } from '@/lib/dailyLuck';
import ScoreDisplay from '@/components/ScoreDisplay';
import TrendChart from '@/components/TrendChart';
import PullResults from '@/components/PullResults';
import ROIAnalysis from '@/components/ROIAnalysis';
import ShareCard from '@/components/ShareCard';
import CompareCard from '@/components/CompareCard';
import WaveDecoration from '@/components/WaveDecoration';
import Navbar from '@/components/Navbar';
import { elementIcons, ELEMENT_ECHO_SETS } from '@/components/elementVisuals';
import { buildRecordText, buildCompareLink } from '@/lib/record';

/**
 * /report 结果页视图。
 * UID 与对比对象全部来自 URL 参数（可分享、可回退），
 * 数据由确定性算法同步计算，无需加载状态。
 */
export default function ReportView() {
    const searchParams = useSearchParams();
    const uid = searchParams.get('uid') ?? '';
    const compareUid = searchParams.get('compare') ?? '';

    const uidValid = isValidUid(uid);
    const compareValid = isValidUid(compareUid);

    const fortune = useMemo(
        () => (uidValid ? getDailyFortune(uid) : null),
        [uid, uidValid]
    );
    const trendData = useMemo(
        () => (uidValid ? generateTrendData(uid) : []),
        [uid, uidValid]
    );
    const compareData = useMemo(
        () => (compareValid ? getDailyFortune(compareUid) : null),
        [compareUid, compareValid]
    );

    const [copied, setCopied] = useState<'record' | 'link' | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const shareCardRef = useRef<HTMLDivElement>(null);

    const pullStats = useMemo(() => {
        if (!fortune) return { star5: 0, star4: 0, star3: 0 };
        const results = fortune.simulatedPull.results;
        return {
            star5: results.filter(r => r.rarity === 5).length,
            star4: results.filter(r => r.rarity === 4).length,
            star3: results.filter(r => r.rarity === 3).length,
        };
    }, [fortune]);

    const handleCopyRecord = async () => {
        if (!fortune) return;
        try {
            await navigator.clipboard.writeText(buildRecordText(fortune, window.location.origin));
            setCopied('record');
            setTimeout(() => setCopied(null), 2000);
        } catch {
            setCopied(null);
        }
    };

    const handleCopyCompareLink = async () => {
        if (!fortune) return;
        try {
            const link = buildCompareLink(fortune.userId, compareData?.userId ?? null, window.location.origin);
            await navigator.clipboard.writeText(link);
            setCopied('link');
            setTimeout(() => setCopied(null), 2000);
        } catch {
            setCopied(null);
        }
    };

    const handleGenerateCard = async () => {
        if (!shareCardRef.current || !fortune) return;

        setIsGenerating(true);
        try {
            // html2canvas 体积较大，按需加载以减小首屏包体
            const { default: html2canvas } = await import('html2canvas');
            shareCardRef.current.style.position = 'fixed';
            shareCardRef.current.style.left = '0';
            shareCardRef.current.style.top = '0';
            shareCardRef.current.style.zIndex = '-1';

            const canvas = await html2canvas(shareCardRef.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                logging: false,
            });

            shareCardRef.current.style.position = 'absolute';
            shareCardRef.current.style.left = '-9999px';
            shareCardRef.current.style.top = '-9999px';
            shareCardRef.current.style.zIndex = 'auto';

            const link = document.createElement('a');
            const date = fortune.date;
            link.download = `Wuthering_Luck_${date}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('生成分享卡片失败:', error);
            alert('生成失败，请重试');
        } finally {
            setIsGenerating(false);
        }
    };

    // 链接无效：给出去路而不是死页
    if (!fortune) {
        return (
            <main className="min-h-screen relative overflow-hidden">
                <Navbar />
                <WaveDecoration />
                <div className="relative z-10 max-w-6xl mx-auto px-4 pt-44 pb-12 text-center">
                    <Scan className="w-14 h-14 mx-auto mb-6 text-white/30" />
                    <p className="text-white/50 font-display tracking-wider mb-2">链接无效或缺少 UID</p>
                    <p className="text-white/30 text-sm font-display mb-8">
                        正确的分享链接形如 /report?uid=你的UID
                    </p>
                    <Link
                        href="/"
                        className="tech-button inline-flex items-center px-6 py-3 rounded-sm text-ww-gold font-display"
                    >
                        返回首页重新检测
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative overflow-hidden">
            <Navbar />
            <WaveDecoration />

            {/* 隐藏的分享卡片 */}
            <ShareCard
                ref={shareCardRef}
                fortune={fortune}
                pullStats={pullStats}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-12">
                {/* 返回条 */}
                <div className="flex justify-end mb-6">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-display
                                 text-white/50 hover:text-ww-gold transition-colors
                                 bg-white/5 border border-white/10 hover:border-ww-gold/40"
                    >
                        ← 返回重新检测
                    </Link>
                </div>

                <div className="space-y-12">
                    {/* 01 检测结果 */}
                    <ScoreDisplay
                        score={fortune.luckScore}
                        level={fortune.luckLevel}
                        luckyElement={fortune.luckyElement}
                        elementIcon={elementIcons[fortune.luckyElement]}
                        echoSets={ELEMENT_ECHO_SETS[fortune.luckyElement]}
                        recommendation={fortune.recommendation}
                        action={
                            <div className="shrink-0 self-center flex items-center gap-2">
                                <button
                                    onClick={handleCopyRecord}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-sm
                                             bg-white/5 border border-white/10 hover:border-ww-gold/40
                                             text-white/60 hover:text-ww-gold transition-colors
                                             font-display text-sm"
                                >
                                    <Copy className="w-4 h-4" />
                                    {copied === 'record' ? '已复制' : '复制战绩'}
                                </button>
                                <button
                                    onClick={handleGenerateCard}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 px-4 py-2 rounded-sm
                                             bg-white/5 border border-white/10 hover:border-ww-gold/40
                                             text-white/60 hover:text-ww-gold transition-colors
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             font-display text-sm"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Download className="w-4 h-4 animate-bounce" />
                                            生成中…
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="w-4 h-4" />
                                            生成运势卡
                                        </>
                                    )}
                                </button>
                            </div>
                        }
                    />

                    {/* 好友对比（?compare= 分享链接触发） */}
                    {compareData && (
                        <div className="reveal-in">
                            <CompareCard
                                mine={fortune}
                                theirs={compareData}
                                copied={copied === 'link'}
                                onCopyLink={handleCopyCompareLink}
                            />
                        </div>
                    )}

                    {/* 02 命运模拟 */}
                    <div className="reveal-in">
                        <div className="section-head mb-4">
                            <span className="index">02</span>
                            <h3 className="text-lg md:text-xl font-bold text-white font-display tracking-wide whitespace-nowrap">命运模拟七十连</h3>
                            <span className="text-xs text-white/35 font-display tracking-[0.25em] uppercase hidden sm:inline">Gacha Simulation</span>
                            <span className="text-white/35 text-xs hidden lg:inline">进入软保底区间，大概率出金</span>
                            <span className="rule" />
                        </div>
                        <PullResults results={fortune.simulatedPull.results} />
                    </div>

                    {/* 03 运势趋势 */}
                    <div className="reveal-in">
                        <div className="section-head mb-4">
                            <span className="index">03</span>
                            <h3 className="text-lg md:text-xl font-bold text-white font-display tracking-wide whitespace-nowrap">运势趋势预测</h3>
                            <span className="text-xs text-white/35 font-display tracking-[0.25em] uppercase">Trend</span>
                            <span className="rule" />
                        </div>
                        <div className="hud-panel p-6 md:p-8">
                            <TrendChart data={trendData} />
                        </div>
                    </div>

                    {/* 04 投资策略 */}
                    <div className="reveal-in">
                        <div className="section-head mb-4">
                            <span className="index">04</span>
                            <h3 className="text-lg md:text-xl font-bold text-white font-display tracking-wide whitespace-nowrap">投资策略分析</h3>
                            <span className="text-xs text-white/35 font-display tracking-[0.25em] uppercase">Strategy</span>
                            <span className="rule" />
                        </div>
                        <ROIAnalysis
                            score={fortune.luckScore}
                            luckyElement={fortune.luckyElement}
                        />
                    </div>

                    {/* 数据信息 */}
                    <footer className="text-center text-white/40 text-sm pt-8">
                        <div className="divider-gold w-32 mx-auto mb-6" />
                        <p className="font-display tracking-wider">
                            命运种子: <span className="gold-number">{fortune.seed}</span>
                            <span className="mx-4 opacity-30">|</span>
                            日期: <span className="text-white/55">{fortune.date}</span>
                        </p>
                        <p className="mt-2 text-white/35">* 同一用户ID同一天的结果始终一致</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
