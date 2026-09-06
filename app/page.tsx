'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Play, Scan } from 'lucide-react';
import { isValidUid } from '@/lib/dailyLuck';
import Navbar from '@/components/Navbar';
import WaveDecoration from '@/components/WaveDecoration';
import { loadRecentUids, saveRecentUid, relativeDayLabel, RecentUid } from '@/lib/record';

export default function Home() {
    const router = useRouter();
    const [uid, setUid] = useState('');
    const [nickname, setNickname] = useState('');
    const [uidError, setUidError] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [recentUids, setRecentUids] = useState<RecentUid[]>([]);

    // 初始化：恢复最近查询；旧版分享链接 /?uid= 兼容跳转到结果页
    useEffect(() => {
        setRecentUids(loadRecentUids());

        const params = new URLSearchParams(window.location.search);
        const urlUid = params.get('uid') ?? '';
        const urlCompare = params.get('compare');
        if (isValidUid(urlUid)) {
            const target = new URLSearchParams({ uid: urlUid });
            if (urlCompare) target.set('compare', urlCompare);
            router.replace(`/report?${target.toString()}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setUid(value);
            if (value && !isValidUid(value)) {
                setUidError('UID必须是6-12位数字');
            } else {
                setUidError('');
            }
        }
    };

    const handleDetect = () => {
        const target = uid.trim();
        if (!target) {
            setUidError('请输入UID');
            return;
        }
        if (!isValidUid(target)) {
            setUidError('UID格式错误，必须是6-12位数字');
            return;
        }

        setUidError('');
        setIsAnimating(true);
        // 命运扫描仪式：扫描线扫过检测台后跳转结果页
        setTimeout(() => {
            setRecentUids(saveRecentUid(target));
            setIsAnimating(false);
            router.push(`/report?uid=${target}`);
        }, 600);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleDetect();
        }
    };

    const canSubmit = uid.trim().length >= 6 && !uidError && !isAnimating;

    return (
        <main className="min-h-screen relative overflow-hidden">
            <Navbar />

            {/* 背景波形装饰 */}
            <WaveDecoration />

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
                            onClick={() => handleDetect()}
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

                    {/* 最近查询（本地保存，点击直接复查） */}
                    {recentUids.length > 0 && !isAnimating && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 justify-center">
                            <span className="text-white/30 text-xs font-display tracking-widest">最近查询</span>
                            {recentUids.map((r) => (
                                <button
                                    key={r.uid}
                                    onClick={() => {
                                        setUid(r.uid);
                                        handleDetect();
                                    }}
                                    className="px-3 py-1 rounded-sm text-xs font-display bg-white/5 border border-white/10
                                             text-white/50 hover:text-ww-gold hover:border-ww-gold/40 transition-colors"
                                >
                                    {r.uid}
                                    <span className="ml-1.5 opacity-60">{relativeDayLabel(r.ts)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* 特性速览 */}
                <section className="max-w-3xl mx-auto text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="divider-gold w-24 mx-auto mb-8" />
                    <div className="grid sm:grid-cols-3 gap-6 text-left">
                        {[
                            { title: '确定性运势', desc: '同 UID 同一天结果始终一致，纯本地计算不上传任何数据' },
                            { title: '模拟七十连', desc: '进入软保底区间，大概率出金，命中结果带角色立绘' },
                            { title: '好友对比', desc: '分享链接即可比欧，输入对方 UID 一秒见分晓' },
                        ].map((f) => (
                            <div key={f.title} className="panel rounded-md p-5">
                                <p className="text-ww-gold font-display font-semibold tracking-wide mb-2">{f.title}</p>
                                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
