'use client';

import { useState, useRef, useMemo } from 'react';
import {
    Flame, Wind, Zap, Snowflake, Radio, Atom,
    Sparkles, Play, Scan, Camera, Download
} from 'lucide-react';
import {
    getDailyFortune,
    generateTrendData,
    getLocalDateStr,
    DailyFortuneData,
    TrendDataPoint,
    WutheringElement
} from '@/lib/dailyLuck';
import ScoreDisplay from '@/components/ScoreDisplay';
import TrendChart from '@/components/TrendChart';
import PullResults from '@/components/PullResults';
import WaveDecoration from '@/components/WaveDecoration';
import ROIAnalysis from '@/components/ROIAnalysis';
import ShareCard from '@/components/ShareCard';
import Navbar from '@/components/Navbar';

// 属性图标映射
const elementIcons: Record<WutheringElement, React.ReactNode> = {
    '热熔': <Flame className="w-8 h-8 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />,
    '衍射': <Radio className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />,
    '气动': <Wind className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />,
    '冷凝': <Snowflake className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />,
    '导电': <Zap className="w-8 h-8 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" />,
    '湮灭': <Atom className="w-8 h-8 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" />,
};

// 属性对应声骸套装
const ELEMENT_ECHO_SETS: Record<WutheringElement, string[]> = {
    '热熔': ['熔山裂谷', '永夜长明'],
    '衍射': ['凝夜白霜', '隐世回光'],
    '气动': ['啸谷长风', '轻云出月'],
    '冷凝': ['凝夜白霜', '沉日劫明'],
    '导电': ['彻空冥雷', '此时此刻'],
    '湮灭': ['浮星祛暗', '不绝余音'],
};

export default function Home() {
    const [uid, setUid] = useState('');
    const [nickname, setNickname] = useState('');
    const [uidError, setUidError] = useState('');
    const [fortune, setFortune] = useState<DailyFortuneData | null>(null);
    const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const shareCardRef = useRef<HTMLDivElement>(null);

    // 处理导航切换
    const handleNavigate = (pageId: string) => {
        setCurrentPage(pageId);
        // 目前只有首页功能，其他页面后续扩展
        if (pageId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // UID验证 - 必须是6-12位纯数字
    const validateUid = (value: string): boolean => {
        const uidRegex = /^\d{6,12}$/;
        return uidRegex.test(value);
    };

    const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 只允许输入数字
        if (value === '' || /^\d+$/.test(value)) {
            setUid(value);
            if (value && !validateUid(value)) {
                setUidError('UID必须是6-12位数字');
            } else {
                setUidError('');
            }
        }
    };

    const handleDetect = () => {
        if (!uid.trim()) {
            setUidError('请输入UID');
            return;
        }
        if (!validateUid(uid)) {
            setUidError('UID格式错误，必须是6-12位数字');
            return;
        }

        setIsAnimating(true);
        setShowResults(false);
        setUidError('');

        // 模拟加载动画
        setTimeout(() => {
            const fortuneData = getDailyFortune(uid.trim());
            const trend = generateTrendData(uid.trim());

            setFortune(fortuneData);
            setTrendData(trend);
            setShowResults(true);
            setIsAnimating(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleDetect();
        }
    };

    // 检查是否可以提交
    const canSubmit = uid.trim().length >= 6 && !uidError && !isAnimating;

    // 生成分享卡片
    const handleGenerateCard = async () => {
        if (!shareCardRef.current || !fortune) return;

        setIsGenerating(true);
        try {
            // html2canvas 体积较大，按需加载以减小首屏包体
            const { default: html2canvas } = await import('html2canvas');
            // 临时显示分享卡片以便截图
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

            // 恢复隐藏
            shareCardRef.current.style.position = 'absolute';
            shareCardRef.current.style.left = '-9999px';
            shareCardRef.current.style.top = '-9999px';
            shareCardRef.current.style.zIndex = 'auto';

            // 生成下载链接
            const link = document.createElement('a');
            const date = getLocalDateStr();
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

    // 计算抽卡统计
    const pullStats = useMemo(() => {
        if (!fortune) return { star5: 0, star4: 0, star3: 0 };
        const results = fortune.simulatedPull.results;
        return {
            star5: results.filter(r => r.rarity === 5).length,
            star4: results.filter(r => r.rarity === 4).length,
            star3: results.filter(r => r.rarity === 3).length,
        };
    }, [fortune]);

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* 导航栏 */}
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

            {/* 背景波形装饰 */}
            <WaveDecoration />

            {/* 隐藏的分享卡片 */}
            {fortune && (
                <ShareCard
                    ref={shareCardRef}
                    fortune={fortune}
                    pullStats={pullStats}
                />
            )}
            {/* 主内容区域 - 添加顶部间距以容纳固定导航栏 */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-12">
                {/* Header */}
                <header className="text-center mb-10 md:mb-14 animate-fade-in-up">
                    {/* 顶部装饰线 */}
                    <div className="divider-gold w-32 mx-auto mb-6" />

                    <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display tracking-wider [text-wrap:balance]">
                        <span className="gold-title">鸣潮</span>
                        <span className="text-white/90">运势检测器</span>
                    </h1>
                    <p className="text-white/40 text-lg font-display tracking-widest uppercase">
                        Wuthering Waves Fortune Detector
                    </p>

                    {/* 波形分隔线 */}
                    <div className="wave-line h-8 mt-5" />
                </header>

                {/* ID 输入区域 —— 命运检测台 */}
                <section className="max-w-lg mx-auto mb-12 md:mb-14 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    <div className="hud-panel corner-brackets relative overflow-hidden p-6 md:p-8">
                        {/* 命运扫描线：点击检测后一次性扫过 */}
                        {isAnimating && <div className="scanline" />}
                        {/* UID 输入 */}
                        <div className="mb-6">
                            <label className="block text-white/50 mb-3 text-sm uppercase tracking-[0.2em] font-display">
                                <Scan className="w-4 h-4 inline-block mr-2 opacity-60" />
                                共鸣者 UID <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={uid}
                                onChange={handleUidChange}
                                onKeyDown={handleKeyPress}
                                inputMode="numeric"
                                autoComplete="off"
                                placeholder="输入你的游戏UID，如 106971359…"
                                maxLength={12}
                                className={`tech-input w-full px-5 py-4 rounded-sm text-white text-lg ${uidError ? 'border-red-500/50 focus:border-red-500' : ''
                                    }`}
                            />
                            {uidError && (
                                <p className="text-red-400 text-sm mt-2 font-display">
                                    ⚠️ {uidError}
                                </p>
                            )}
                            <p className="text-white/30 text-xs mt-2">
                                UID为6-12位数字，可在游戏内个人资料查看
                            </p>
                        </div>

                        {/* 昵称输入 */}
                        <div className="mb-6">
                            <label className="block text-white/50 mb-3 text-sm uppercase tracking-[0.2em] font-display">
                                昵称 <span className="text-white/30">(可选)</span>
                            </label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                onKeyDown={handleKeyPress}
                                autoComplete="off"
                                placeholder="输入你的游戏昵称…"
                                maxLength={20}
                                className="tech-input w-full px-5 py-4 rounded-sm text-white text-lg"
                            />
                            <p className="text-white/30 text-xs mt-2">
                                昵称仅用于显示，不影响运势计算
                            </p>
                        </div>

                        {/* 提交按钮 */}
                        <button
                            onClick={handleDetect}
                            disabled={!canSubmit}
                            className="tech-button w-full px-8 py-4 rounded-sm text-ww-gold font-semibold font-display
                                     disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2
                                     text-base tracking-wide"
                        >
                            {isAnimating ? (
                                <Sparkles className="w-5 h-5 animate-spin" />
                            ) : (
                                <Play className="w-5 h-5" />
                            )}
                            开始监测
                        </button>
                    </div>
                </section>

                {/* Dashboard 仪表盘 —— 编号分区叙事 */}
                {showResults && fortune && (
                    <div className="space-y-12">
                        {/* 01 检测结果（报告头 + 分享按钮） */}
                        <ScoreDisplay
                            score={fortune.luckScore}
                            level={fortune.luckLevel}
                            luckyElement={fortune.luckyElement}
                            elementIcon={elementIcons[fortune.luckyElement]}
                            echoSets={ELEMENT_ECHO_SETS[fortune.luckyElement]}
                            recommendation={fortune.recommendation}
                            action={
                                <button
                                    onClick={handleGenerateCard}
                                    disabled={isGenerating}
                                    className="shrink-0 self-center flex items-center gap-2 px-4 py-2 rounded-sm
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
                            }
                        />

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
                        <footer className="text-center text-white/40 text-sm animate-fade-in-up pt-8">
                            <div className="divider-gold w-32 mx-auto mb-6" />
                            <p className="font-display tracking-wider">
                                命运种子: <span className="gold-number">{fortune.seed}</span>
                                <span className="mx-4 opacity-30">|</span>
                                日期: <span className="text-white/55">{fortune.date}</span>
                            </p>
                            <p className="mt-2 text-white/35">* 同一用户ID同一天的结果始终一致</p>
                        </footer>
                    </div>
                )}

                {/* 空状态提示 */}
                {!showResults && !isAnimating && (
                    <div className="text-center text-white/35 py-14 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <Scan className="w-14 h-14 mx-auto mb-5 opacity-40" />
                        <p className="text-lg font-display tracking-wider">输入共鸣者ID，启动命运扫描</p>
                    </div>
                )}
            </div>
        </main>
    );
}
