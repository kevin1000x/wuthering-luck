'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { TrendDataPoint } from '@/lib/dailyLuck';

interface TrendChartProps {
    data: TrendDataPoint[];
}

// 自定义 Tooltip
interface TooltipProps {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
        const score = payload[0].value;
        const isHigh = score >= 75;
        const isMedium = score >= 50;

        return (
            <div className="glass-card-dark rounded-xl px-5 py-4 border border-white/10">
                <p className="text-white/50 text-sm font-display tracking-wider mb-1">{label}</p>
                <p className={`text-4xl font-bold font-display ${isHigh ? 'gold-number' : isMedium ? 'text-emerald-400' : 'text-white/60'
                    }`}>
                    {score}
                    <span className="text-base text-white/30 ml-1">分</span>
                </p>
            </div>
        );
    }
    return null;
};

// 自定义数据点
interface DotProps {
    cx?: number;
    cy?: number;
    payload?: TrendDataPoint;
}

const CustomDot = (props: DotProps) => {
    const { cx, cy, payload } = props;
    const isToday = payload.label === '今天';
    const score = payload.score;

    if (isToday) {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill="#d4af37" opacity={0.15} />
                <circle cx={cx} cy={cy} r={8} fill="#d4af37" opacity={0.3} />
                <circle cx={cx} cy={cy} r={5} fill="#d4af37" />
                <circle cx={cx} cy={cy} r={2} fill="#f4e5b0" />
            </g>
        );
    }

    const color = score >= 75 ? '#d4af37' : score >= 50 ? '#10b981' : '#6b7280';
    return (
        <circle cx={cx} cy={cy} r={4} fill={color} stroke={color} strokeWidth={2} strokeOpacity={0.3} />
    );
};

// 悬停时发光点
interface ActiveDotProps {
    cx?: number;
    cy?: number;
}

const CustomActiveDot = (props: ActiveDotProps) => {
    const { cx, cy } = props;
    return (
        <g>
            <circle cx={cx} cy={cy} r={18} fill="#d4af37" opacity={0.2} />
            <circle cx={cx} cy={cy} r={10} fill="#d4af37" opacity={0.4} />
            <circle cx={cx} cy={cy} r={6} fill="#d4af37" />
            <circle cx={cx} cy={cy} r={2} fill="#fff" />
        </g>
    );
};

export default function TrendChart({ data }: TrendChartProps) {
    return (
        <div className="w-full space-y-6">
            {/* 图表区域 - 增加内边距 */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                        <defs>
                            <linearGradient id="goldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#d4af37" stopOpacity={0.35} />
                                <stop offset="60%" stopColor="#d4af37" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="goldLineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#d4af37" stopOpacity={0.5} />
                                <stop offset="50%" stopColor="#d4af37" stopOpacity={1} />
                                <stop offset="100%" stopColor="#d4af37" stopOpacity={0.5} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

                        <XAxis
                            dataKey="label"
                            stroke="transparent"
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 13 }}
                            tickLine={false}
                            axisLine={false}
                            dy={8}
                        />

                        <YAxis
                            domain={[0, 100]}
                            stroke="transparent"
                            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            ticks={[0, 25, 50, 75, 100]}
                            width={35}
                        />

                        <ReferenceLine y={75} stroke="#d4af37" strokeDasharray="6 4" strokeOpacity={0.35} />
                        <ReferenceLine y={50} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: 'rgba(212,175,55,0.25)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />

                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="url(#goldLineGradient)"
                            strokeWidth={3}
                            fill="url(#goldAreaGradient)"
                            dot={<CustomDot />}
                            activeDot={<CustomActiveDot />}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* 图例 - 单独区域，避免溢出 */}
            <div className="flex justify-center gap-8 text-sm font-display pt-2">
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-ww-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                    <span className="text-white/50">超吉 (75+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                    <span className="text-white/50">中吉 (50-74)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-gray-500" />
                    <span className="text-white/50">平/凶 (&lt;50)</span>
                </div>
            </div>
        </div>
    );
}
