'use client';

import { useMemo } from 'react';
import { CalendarDays, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getFortuneForDate, getLocalDateStr } from '@/lib/dailyLuck';

interface HistoryHeatmapProps {
    uid: string;
}

interface DayCell {
    date: string;
    dayNum: number;
    score: number;
    isToday: boolean;
}

/**
 * 05 · 历史规律：最近 30 天运势热力图 + 统计。
 * 运势是确定性纯函数——历史无需存储，按日期即时推演即可。
 */
export default function HistoryHeatmap({ uid }: HistoryHeatmapProps) {
    const { days } = useMemo(() => {
        const list: DayCell[] = [];
        const now = new Date();
        const today = getLocalDateStr(now);
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = getLocalDateStr(d);
            list.push({
                date: dateStr,
                dayNum: d.getDate(),
                score: getFortuneForDate(uid, dateStr),
                isToday: dateStr === today,
            });
        }
        return { days: list };
    }, [uid]);

    const stats = useMemo(() => {
        const scores = days.map(d => d.score);
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const max = Math.max(...scores);
        const maxDay = days.find(d => d.score === max);
        const delta = scores[scores.length - 1] - scores[scores.length - 2];
        return { avg, max, maxDay: maxDay!, delta };
    }, [days]);

    const cellClass = (score: number, isToday: boolean) => {
        const color = score >= 75
            ? 'bg-ww-gold/75 text-black/80'
            : score >= 50
                ? 'bg-ww-mint/40 text-white/85'
                : 'bg-white/[0.07] text-white/35';
        return `aspect-square rounded-sm flex items-center justify-center text-[10px] font-display tabular-nums
                transition-transform hover:scale-110 cursor-default ${color} ${isToday ? 'ring-1 ring-ww-gold' : ''}`;
    };

    const deltaView = stats.delta > 0
        ? { icon: <TrendingUp className="w-3.5 h-3.5" />, text: `较昨日 +${stats.delta}`, cls: 'text-ww-mint' }
        : stats.delta < 0
            ? { icon: <TrendingDown className="w-3.5 h-3.5" />, text: `较昨日 ${stats.delta}`, cls: 'text-ww-danger' }
            : { icon: <Minus className="w-3.5 h-3.5" />, text: '与昨日持平', cls: 'text-white/40' };

    return (
        <div className="reveal-in">
            <div className="section-head mb-4">
                <span className="index">05</span>
                <h3 className="text-lg md:text-xl font-bold text-white font-display tracking-wide whitespace-nowrap">历史规律</h3>
                <span className="text-xs text-white/35 font-display tracking-[0.25em] uppercase">Fortune History</span>
                <span className="rule" />
            </div>

            <div className="hud-panel p-6 md:p-8">
                <div className="grid grid-cols-10 gap-1.5 max-w-2xl">
                    {days.map((d) => (
                        <div
                            key={d.date}
                            className={cellClass(d.score, d.isToday)}
                            title={`${d.date}：${d.score}分`}
                            aria-label={`${d.date} 运势 ${d.score} 分`}
                        >
                            {d.dayNum}
                        </div>
                    ))}
                </div>

                <div className="mt-5 pt-4 border-t border-[color:var(--gold-hair)] flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-display">
                    <span className="flex items-center gap-2 text-white/50">
                        <CalendarDays className="w-4 h-4 text-ww-gold" />
                        近30天平均 <span className="text-white/85 tabular-nums font-semibold">{stats.avg}</span> 分
                    </span>
                    <span className="text-white/50">
                        峰值 <span className="gold-number tabular-nums font-semibold">{stats.max}</span>
                        <span className="text-white/30 text-xs ml-1">
                            （{stats.maxDay.date.slice(5).replace('-', '月')}日）
                        </span>
                    </span>
                    <span className={`flex items-center gap-1.5 ${deltaView.cls}`}>
                        {deltaView.icon}
                        {deltaView.text}
                    </span>
                    <span className="ml-auto text-white/25 text-xs">* 由确定性算法按日推演，无需上传记录</span>
                </div>
            </div>
        </div>
    );
}
