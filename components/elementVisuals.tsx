import { Flame, Wind, Zap, Snowflake, Radio, Atom } from 'lucide-react';
import { WutheringElement } from '@/lib/dailyLuck';

// 属性图标映射（结果页/分享卡共用）
export const elementIcons: Record<WutheringElement, React.ReactNode> = {
    '热熔': <Flame className="w-8 h-8 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />,
    '衍射': <Radio className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />,
    '气动': <Wind className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />,
    '冷凝': <Snowflake className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />,
    '导电': <Zap className="w-8 h-8 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" />,
    '湮灭': <Atom className="w-8 h-8 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" />,
};

// 属性对应声骸套装
export const ELEMENT_ECHO_SETS: Record<WutheringElement, string[]> = {
    '热熔': ['熔山裂谷', '永夜长明'],
    '衍射': ['凝夜白霜', '隐世回光'],
    '气动': ['啸谷长风', '轻云出月'],
    '冷凝': ['凝夜白霜', '沉日劫明'],
    '导电': ['彻空冥雷', '此时此刻'],
    '湮灭': ['浮星祛暗', '不绝余音'],
};
