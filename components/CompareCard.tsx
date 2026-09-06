'use client';

import { Copy, Swords } from 'lucide-react';
import { DailyFortuneData } from '@/lib/dailyLuck';

interface CompareCardProps {
    mine: DailyFortuneData;
    theirs: DailyFortuneData;
    onCopyLink: () => void;
    copied: boolean;
}

/**
 * 好友对比条：两方分数并排，高的一侧点亮。
 * 插在 01 检测结果之后——"我欧还是他欧"一秒见分晓。
 */
export default function CompareCard({ mine, theirs, onCopyLink, copied }: CompareCardProps) {
    const iWin = mine.luckScore >= theirs.luckScore;

    const sideClass = (win: boolean) =>
        win ? 'text-ww-gold' : 'text-white/45';

    return (
        <div className="panel panel-gold rounded-md p-5">
            <div className="flex items-center gap-3 mb-4">
                <Swords className="w-4 h-4 text-ww-gold" />
                <span className="text-white/50 text-xs font-display tracking-[0.2em] uppercase">好友对比</span>
                <span className="rule flex-1 self-center h-px bg-[color:var(--gold-hair)]" />
                <button
                    onClick={onCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-display
                             bg-white/5 border border-white/10 hover:border-ww-gold/40
                             text-white/60 hover:text-ww-gold transition-colors"
                >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? '已复制链接' : '复制对比链接'}
                </button>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="text-center sm:text-left">
                    <p className="text-white/35 text-[11px] font-display tracking-widest">UID {mine.userId}</p>
                    <p className={`text-4xl font-bold font-display tabular-nums ${sideClass(iWin)}`}>
                        {mine.luckScore}
                    </p>
                </div>

                <div className="flex flex-col items-center px-2">
                    <span className="text-ww-gold/70 font-display text-sm tracking-widest">VS</span>
                    <span className="text-white/30 text-xs font-display mt-0.5">
                        {iWin ? '你更欧' : '对方更欧'}
                    </span>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-white/35 text-[11px] font-display tracking-widest">UID {theirs.userId}</p>
                    <p className={`text-4xl font-bold font-display tabular-nums ${sideClass(!iWin)}`}>
                        {theirs.luckScore}
                    </p>
                </div>
            </div>
        </div>
    );
}
