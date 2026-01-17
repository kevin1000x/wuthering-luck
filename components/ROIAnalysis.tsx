'use client';

import { TrendingUp, TrendingDown, Minus, Zap, BarChart3, MapPin, Navigation } from 'lucide-react';
import { WutheringElement } from '@/lib/dailyLuck';

interface ROIAnalysisProps {
    score: number;
    userId: string;
    luckyElement: WutheringElement;
}

// 地点信息类型
interface LocationInfo {
    name: string;
    region: string; // 大区域
    area: string;   // 小区域
    tip: string;
}

// 鸣潮地图玄学抽卡地点配置 - 覆盖所有大区域
const LUCKY_LOCATIONS: Record<WutheringElement, {
    locations: LocationInfo[];
    echoSets: string[];
}> = {
    '热熔': {
        locations: [
            {
                name: '荒石高地 · 伏波阵前',
                region: '瑝珑',
                area: '今州城西部',
                tip: '站在烽火台顶端抽卡，火焰气息最强',
            },
            {
                name: '归墟港市 · 焚焰海',
                region: '瑝珑',
                area: '今州城东南',
                tip: '面朝燃烧的海面冥想后抽卡',
            },
            {
                name: '黑海岸 · 熔岩暗礁',
                region: '黑海岸',
                area: '深海区域',
                tip: '在地热喷涌处感受火元素共鸣',
            },
            {
                name: '乘霄山 · 卧龙冈',
                region: '瑝珑',
                area: '乘霄山东部',
                tip: '在龙息温泉旁积蓄火属性',
            },
            {
                name: '黎那汐塔 · 炎阳祭坛',
                region: '黎那汐塔',
                area: '拉古那城外',
                tip: '在祭坛火焰永燃处祈愿',
            },
            {
                name: '七丘 · 罗马浴场遗迹',
                region: '七丘',
                area: '中央广场',
                tip: '古老的温泉蕴含火元素记忆',
            },
        ],
        echoSets: ['熔山裂谷', '永夜长明', '凌冽决绝之心'],
    },
    '衍射': {
        locations: [
            {
                name: '中曲台地 · 原点科考站',
                region: '瑝珑',
                area: '今州城核心',
                tip: '在研究设备旁静候数据波动后抽卡',
            },
            {
                name: '今州城 · 声骸研究所',
                region: '瑝珑',
                area: '今州城界',
                tip: '在传送点激活瞬间立即抽卡',
            },
            {
                name: '乘霄山 · 璇玑岭观星台',
                region: '瑝珑',
                area: '乘霄山巅',
                tip: '仰望星空，让衍射光芒指引',
            },
            {
                name: '黎那汐塔 · 水晶灯塔',
                region: '黎那汐塔',
                area: '拂风水畔',
                tip: '在灯塔光芒折射处祈愿',
            },
            {
                name: '七丘 · 神谕殿堂',
                region: '七丘',
                area: '圣殿区',
                tip: '在彩色玻璃穹顶下让光分散',
            },
            {
                name: '拉海洛 · 星炬学院',
                region: '拉海洛',
                area: '学院核心',
                tip: '在知识与光的交汇处冥想',
            },
        ],
        echoSets: ['凝夜白霜', '隐世回光', '轻云出月'],
    },
    '气动': {
        locations: [
            {
                name: '虎口山脉 · 泷垂川',
                region: '瑝珑',
                area: '今州城北部',
                tip: '站在瀑布顶端，让风水共鸣后抽卡',
            },
            {
                name: '乘霄山 · 游龙脊',
                region: '瑝珑',
                area: '乘霄山脊',
                tip: '在龙脊最高点迎风而立',
            },
            {
                name: '北落野 · 北落峡谷',
                region: '瑝珑',
                area: '瑝珑北境',
                tip: '峡谷风口处风属性最为纯粹',
            },
            {
                name: '黑海岸 · 风暴海角',
                region: '黑海岸',
                area: '西北海岬',
                tip: '在海风呼啸处张开双臂',
            },
            {
                name: '黎那汐塔 · 风车高塔',
                region: '黎那汐塔',
                area: '阿维纽林',
                tip: '在风车旋转时抽卡，风神眷顾',
            },
            {
                name: '七丘 · 竞技场风道',
                region: '七丘',
                area: '斗兽场',
                tip: '在古老竞技场的穿堂风中祈愿',
            },
        ],
        echoSets: ['啸谷长风', '轻云出月', '不绝余音'],
    },
    '冷凝': {
        locations: [
            {
                name: '归墟港市 · 潮音海丘',
                region: '瑝珑',
                area: '今州城东南',
                tip: '在潮汐最高点的浪花中抽卡',
            },
            {
                name: '无明湾 · 弦月礁',
                region: '瑝珑',
                area: '今州城东部',
                tip: '月光照在礁石上时水元素加持',
            },
            {
                name: '中曲台地 · 萤泊海',
                region: '瑝珑',
                area: '今州城中部',
                tip: '在萤火与水光交汇处祈愿',
            },
            {
                name: '黑海岸 · 深海冰窟',
                region: '黑海岸',
                area: '海底洞穴',
                tip: '在冰冷的海水中感受冷凝之力',
            },
            {
                name: '黎那汐塔 · 月神喷泉',
                region: '黎那汐塔',
                area: '拉古那城中心',
                tip: '在喷泉水幕中让月光洗礼',
            },
            {
                name: '拉海洛 · 冰原极地',
                region: '拉海洛',
                area: '北境冻土',
                tip: '在寒冰覆盖的大地上祈愿',
            },
        ],
        echoSets: ['凝夜白霜', '沉日劫明', '此时此刻'],
    },
    '导电': {
        locations: [
            {
                name: '无明湾 · 荒弃岩壑',
                region: '瑝珑',
                area: '今州城东部',
                tip: '等待雷暴来临的前一秒抽卡',
            },
            {
                name: '乘霄山 · 璇玑岭',
                region: '瑝珑',
                area: '乘霄山巅',
                tip: '在雷云聚集的山顶静候闪电',
            },
            {
                name: '黑海岸 · 雷暴海域',
                region: '黑海岸',
                area: '东部海岸',
                tip: '紫电贯穿海面时元素浓度最高',
            },
            {
                name: '黎那汐塔 · 闪电尖塔',
                region: '黎那汐塔',
                area: '赞悼圣迹',
                tip: '在尖塔引雷针旁感受电流',
            },
            {
                name: '七丘 · 雷神祭坛',
                region: '七丘',
                area: '神殿山',
                tip: '在古老雷神像前祈求庇佑',
            },
            {
                name: '拉海洛 · 磁暴研究站',
                region: '拉海洛',
                area: '学院分部',
                tip: '在人工雷电场中激发导电潜能',
            },
        ],
        echoSets: ['彻空冥雷', '此时此刻', '凌冽决绝之心'],
    },
    '湮灭': {
        locations: [
            {
                name: '无光之森 · 中央巨榕',
                region: '瑝珑',
                area: '瑝珑深处',
                tip: '在巨榕根系深处找到虚空裂隙',
            },
            {
                name: '怨鸟泽 · 稷廷遗址',
                region: '瑝珑',
                area: '今州城南部',
                tip: '遗址中心的湮灭能量最为浓郁',
            },
            {
                name: '北落野 · 悬浮废墟',
                region: '瑝珑',
                area: '瑝珑北部',
                tip: '在悬浮岛屿的裂隙边缘抽卡',
            },
            {
                name: '黑海岸 · 深渊裂口',
                region: '黑海岸',
                area: '海沟深处',
                tip: '在虚空能量溢出处感受湮灭',
            },
            {
                name: '黎那汐塔 · 冥界入口',
                region: '黎那汐塔',
                area: '地下遗迹',
                tip: '在通往冥界的门前祈愿',
            },
            {
                name: '七丘 · 废弃神殿地下',
                region: '七丘',
                area: '遗忘墓穴',
                tip: '在被遗忘的神像前献上祈祷',
            },
        ],
        echoSets: ['浮星祛暗', '不绝余音', '沉日劫明'],
    },
};

export default function ROIAnalysis({ score, luckyElement }: ROIAnalysisProps) {
    // 计算ROI
    const calculateROI = (score: number): number => {
        if (score >= 90) return 180 + (score - 90) * 12;
        if (score >= 75) return 80 + (score - 75) * 6.7;
        if (score >= 60) return 20 + (score - 60) * 4;
        if (score >= 50) return (score - 50) * 2;
        if (score >= 40) return (score - 50) * 3;
        if (score >= 25) return -30 + (score - 40) * -2;
        return -60 + (25 - score) * -1.6;
    };

    // 预期出货计算 - 简化算法，保证正数
    // 分数0-100 映射到 80抽-15抽 (线性插值)
    const calculateExpectedPulls = (score: number): number => {
        // 确保分数在0-100范围内
        const clampedScore = Math.max(0, Math.min(100, score));
        // 线性映射: 分数越高，出货越快
        // 0分 = 80抽保底, 100分 = 15抽就出
        const pulls = 80 - (clampedScore * 0.65);
        return Math.round(Math.max(15, pulls));
    };

    const roi = calculateROI(score);
    const expectedPulls = calculateExpectedPulls(score);
    const isPositive = roi >= 0;
    const isHighROI = roi >= 100;
    const isLowROI = roi <= -50;

    const locationData = LUCKY_LOCATIONS[luckyElement];

    // 根据分数选择展示的地点数量
    const locationsToShow = score >= 75 ? 4 : score >= 50 ? 3 : 2;

    // 投资建议
    const getAdvice = () => {
        if (roi >= 150) return { text: '满命冲刺时机！', icon: <Zap className="w-5 h-5" />, color: 'text-ww-gold' };
        if (roi >= 80) return { text: '建议大额投入', icon: <TrendingUp className="w-5 h-5" />, color: 'text-ww-gold' };
        if (roi >= 20) return { text: '可适度投入', icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-400' };
        if (roi >= 0) return { text: '保守观望', icon: <Minus className="w-5 h-5" />, color: 'text-white/60' };
        if (roi >= -30) return { text: '建议囤积星声', icon: <TrendingDown className="w-5 h-5" />, color: 'text-orange-400' };
        if (roi >= -60) return { text: '高风险预警', icon: <TrendingDown className="w-5 h-5" />, color: 'text-red-400' };
        return { text: '禁止交易日！', icon: <TrendingDown className="w-5 h-5" />, color: 'text-red-500' };
    };

    const advice = getAdvice();

    // 风险等级
    const getRiskLevel = () => {
        if (roi >= 100) return { level: '极低', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
        if (roi >= 30) return { level: '低', color: 'bg-emerald-400', textColor: 'text-emerald-400' };
        if (roi >= 0) return { level: '中等', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
        if (roi >= -40) return { level: '高', color: 'bg-orange-500', textColor: 'text-orange-400' };
        return { level: '极高', color: 'bg-red-500', textColor: 'text-red-400' };
    };

    const risk = getRiskLevel();

    // 区域颜色
    const getRegionColor = (region: string) => {
        switch (region) {
            case '瑝珑': return 'text-emerald-400 bg-emerald-500/10';
            case '黑海岸': return 'text-blue-400 bg-blue-500/10';
            case '黎那汐塔': return 'text-amber-400 bg-amber-500/10';
            case '七丘': return 'text-rose-400 bg-rose-500/10';
            case '拉海洛': return 'text-purple-400 bg-purple-500/10';
            default: return 'text-white/60 bg-white/5';
        }
    };

    return (
        <div className="space-y-6">
            {/* ROI 分析卡片 */}
            <div className="glass-card rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-ww-gold" />
                    <h3 className="text-xl font-bold text-white font-display tracking-wide">
                        投资回报分析
                    </h3>
                    <span className="text-sm text-white/30">(ROI Analysis)</span>
                </div>

                {/* 主要指标 */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="glass-card-dark rounded-xl p-4 text-center">
                        <p className="text-white/40 text-sm font-display mb-2">投入产出比</p>
                        <p className={`text-3xl font-bold font-display ${isHighROI ? 'gold-number' : isPositive ? 'text-emerald-400' : isLowROI ? 'text-red-400' : 'text-orange-400'
                            }`}>
                            {isPositive ? '+' : ''}{roi.toFixed(0)}%
                        </p>
                    </div>

                    <div className="glass-card-dark rounded-xl p-4 text-center">
                        <p className="text-white/40 text-sm font-display mb-2">风险等级</p>
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${risk.color}`} />
                            <span className={`text-xl font-bold font-display ${risk.textColor}`}>{risk.level}</span>
                        </div>
                    </div>

                    <div className="glass-card-dark rounded-xl p-4 text-center">
                        <p className="text-white/40 text-sm font-display mb-2">预期出货</p>
                        <p className={`text-2xl font-bold font-display ${expectedPulls <= 50 ? 'gold-number' : expectedPulls <= 70 ? 'text-white' : 'text-orange-400'
                            }`}>
                            <span className="text-base text-white/40 mr-1">约</span>{expectedPulls}<span className="text-base text-white/40 ml-1">抽</span>
                        </p>
                    </div>
                </div>

                {/* 投资建议 */}
                <div className={`glass-card rounded-xl p-4 border ${isHighROI ? 'border-ww-gold/30' : isLowROI ? 'border-red-500/30' : 'border-white/10'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isHighROI ? 'bg-ww-gold/20' : isLowROI ? 'bg-red-500/20' : 'bg-white/5'
                            }`}>
                            <span className={advice.color}>{advice.icon}</span>
                        </div>
                        <div>
                            <p className="text-white/50 text-sm font-display">今日策略建议</p>
                            <p className={`text-lg font-bold font-display ${advice.color}`}>
                                {advice.text}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 玄学抽卡地点 */}
            <div className="glass-card rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-ww-gold" />
                    <h3 className="text-xl font-bold text-white font-display tracking-wide">
                        今日玄学抽卡地点
                    </h3>
                    <span className="text-sm text-white/30">({luckyElement}属性 · {locationsToShow}个推荐)</span>
                </div>

                {/* 地点列表 */}
                <div className="space-y-3">
                    {locationData.locations.slice(0, locationsToShow).map((loc, idx) => (
                        <div
                            key={idx}
                            className={`glass-card-dark rounded-xl p-4 ${idx === 0 ? 'border border-ww-gold/20' : ''
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${idx === 0 ? 'bg-ww-gold/20' : idx === 1 ? 'bg-ww-purple/20' : 'bg-white/5'
                                    }`}>
                                    <span className={`font-bold font-display ${idx === 0 ? 'text-ww-gold' : idx === 1 ? 'text-ww-purple' : 'text-white/40'
                                        }`}>{idx + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className={`text-xs font-display px-2 py-0.5 rounded ${getRegionColor(loc.region)}`}>
                                            {loc.region}
                                        </span>
                                        <span className="text-white/30 text-xs">{loc.area}</span>
                                        {idx === 0 && (
                                            <span className="text-xs text-ww-gold font-display px-2 py-0.5 bg-ww-gold/10 rounded">
                                                首选
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white font-display font-semibold">{loc.name}</p>
                                    <p className="text-white/40 text-sm mt-1">💡 {loc.tip}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 底部提示 */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-white/30" />
                        <span className="text-white/40 font-display">置信度</span>
                        <span className="text-white/60 font-display font-semibold">
                            {Math.min(95, 60 + score * 0.35).toFixed(0)}%
                        </span>
                    </div>
                    <div className="text-white/30 font-display text-xs">
                        * 仅供娱乐，玄学无科学依据
                    </div>
                </div>
            </div>
        </div>
    );
}
