/**
 * 每日运势工具库
 * 使用 SHA-256 哈希生成确定性种子
 */

// ==================== 类型定义 ====================

export type WutheringElement = '热熔' | '衍射' | '气动' | '冷凝' | '导电' | '湮灭';
export type Rarity = 3 | 4 | 5;

export interface GachaResult {
    rarity: Rarity;
    isUp: boolean;
    pullNumber: number;
    /** 命中的角色/武器名（三星武器不分配名称） */
    name?: string;
}

export interface PullSimResult {
    results: GachaResult[];
    totalFiveStars: number;
    totalFourStars: number;
    pullCount: number;
}

export interface DailyFortuneData {
    userId: string;
    date: string;
    seed: number;
    luckScore: number;
    luckyElement: WutheringElement;
    luckLevel: string;
    recommendation: string;
    simulatedPull: PullSimResult;
}

export interface TrendDataPoint {
    date: string;
    score: number;
    label: string;
}

// ==================== 常量 ====================

const WUTHERING_ELEMENTS: WutheringElement[] = [
    '热熔', '衍射', '气动', '冷凝', '导电', '湮灭'
];

const BASE_5STAR_RATE = 0.008;
const BASE_4STAR_RATE = 0.06;
const HARD_PITY_5STAR = 80;
const HARD_PITY_4STAR = 10;
const SOFT_PITY_START = 66;

// 每日模拟抽数：70 抽进入软保底区间，绝大多数玩家能看到五星
const DAILY_PULL_COUNT = 70;

// ==================== 卡池数据 ====================

/** 五星UP候选池（每日UP结果由种子决定） */
const UP_FIVE_STAR_POOL: Record<string, string> = {
    '今汐': 'jinhsi',
    '折枝': 'zhezhi',
    '长离': 'changli',
    '吟霖': 'yinlin',
    '椿': 'camellya',
    '洛可可': 'roccia',
    '菲比': 'phoebe',
    '赞妮': 'zani',
    '卡提希娅': 'cantarella',
    '布兰特': 'brant',
    '露帕': 'lupa',
    '奥古斯塔': 'augusta',
};

/** 五星常驻池（歪了的时候出这些） */
const OFF_BANNER_FIVE_STAR_POOL: Record<string, string> = {
    '维里奈': 'verina',
    '安可': 'encore',
    '凌阳': 'lingyang',
    '鉴心': 'jianxin',
    '卡卡罗': 'calcharo',
    '相里要': 'xiangli-yao',
};

/** 四星共鸣者池 */
const FOUR_STAR_POOL: Record<string, string> = {
    '炽霞': 'chixia',
    '秧秧': 'yangyang',
    '桃祈': 'taoqi',
    '白芷': 'baizhi',
    '莫特斐': 'mortefi',
    '秋水': 'aalto',
    '散华': 'sanhua',
    '丹瑾': 'danjin',
    '渊武': 'yuanwu',
    '灯灯': 'lumi',
    '釉瑚': 'youhu',
};

/** 角色名 → public/characters/{slug}.png 的文件名 */
export function getCharacterImageSlug(name: string): string | undefined {
    return (
        UP_FIVE_STAR_POOL[name] ??
        OFF_BANNER_FIVE_STAR_POOL[name] ??
        FOUR_STAR_POOL[name]
    );
}

// ==================== 日期工具 ====================

/** UID 校验：6-12 位纯数字 */
export function isValidUid(value: string): boolean {
    return /^\d{6,12}$/.test(value);
}

/**
 * 本地时区日期字符串 YYYY-MM-DD。
 * 全站统一用本地日期而非 UTC：运势应在用户当地午夜翻转，
 * 而不是 UTC 午夜（对中国用户即早上 8 点）。
 */
export function getLocalDateStr(date?: Date): string {
    const d = date ?? new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// ==================== 哈希与随机数生成 ====================

/**
 * 简单的字符串哈希函数 (djb2变体 + 混淆)
 * 将 userId + date 转换为数字种子
 */
function hashToSeed(str: string): number {
    let hash = 5381;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) + hash) ^ char;
        hash = hash >>> 0; // 保持32位无符号
    }

    // 额外混淆
    hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
    hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
    hash = (hash >> 16) ^ hash;

    return hash >>> 0;
}

/**
 * 线性同余随机数生成器 (LCG)
 */
class SeededRNG {
    private seed: number;
    private readonly a = 48271;
    private readonly m = 2147483647;

    constructor(seed: number) {
        this.seed = Math.abs(seed) % this.m;
        if (this.seed === 0) this.seed = 1;
    }

    next(): number {
        this.seed = (this.a * this.seed) % this.m;
        return this.seed / this.m;
    }

    /** 从 Record 池中按键名等概率挑一个，尽量避免与 recent 重复 */
    pickName(pool: string[], recent: Set<string>): string {
        let name = pool[Math.floor(this.next() * pool.length)];
        if (recent.has(name) && pool.length > 1) {
            name = pool[Math.floor(this.next() * pool.length)];
        }
        return name;
    }

    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    pick<T>(array: T[]): T {
        return array[this.nextInt(0, array.length - 1)];
    }
}

// ==================== 抽卡模拟器 ====================

class SeededGachaSimulator {
    private rng: SeededRNG;
    private readonly baseSeed: number;
    private pity5 = 0;
    private pity4 = 0;
    private guaranteed5Up = false;
    private guaranteed4Up = false;

    constructor(seed: number) {
        this.rng = new SeededRNG(seed);
        // 命名走独立随机流，避免影响保底主随机流
        this.baseSeed = Math.abs(seed) % 2147483647 || 1;
    }

    private calculate5StarRate(pity: number): number {
        if (pity < SOFT_PITY_START) return BASE_5STAR_RATE;
        if (pity >= HARD_PITY_5STAR) return 1.0;

        const pullsIntoPity = pity - SOFT_PITY_START + 1;
        const totalSoftPityPulls = HARD_PITY_5STAR - SOFT_PITY_START;
        return Math.min(
            BASE_5STAR_RATE + (1.0 - BASE_5STAR_RATE) * (pullsIntoPity / totalSoftPityPulls),
            1.0
        );
    }

    private calculate4StarRate(pity: number): number {
        return pity >= HARD_PITY_4STAR ? 1.0 : BASE_4STAR_RATE;
    }

    pullOne(): GachaResult {
        this.pity5++;
        this.pity4++;

        const rate5 = this.calculate5StarRate(this.pity5);
        const rate4 = this.calculate4StarRate(this.pity4);
        const roll = this.rng.next();

        if (roll < rate5) {
            const isUp = this.guaranteed5Up || this.rng.next() < 0.5;
            this.pity5 = 0;
            this.guaranteed5Up = !isUp;
            return { rarity: 5, isUp, pullNumber: this.pity5 };
        }

        if (roll < rate5 + rate4 || this.pity4 >= HARD_PITY_4STAR) {
            const isUp = this.guaranteed4Up || this.rng.next() < 0.5;
            this.pity4 = 0;
            this.guaranteed4Up = !isUp;
            return { rarity: 4, isUp, pullNumber: this.pity4 };
        }

        return { rarity: 3, isUp: false, pullNumber: this.pity5 };
    }

    pullSimulated(count: number): PullSimResult {
        const results: GachaResult[] = [];

        for (let i = 0; i < count; i++) {
            results.push(this.pullOne());
        }

        this.assignNames(results);

        return {
            results,
            totalFiveStars: results.filter(r => r.rarity === 5).length,
            totalFourStars: results.filter(r => r.rarity === 4).length,
            pullCount: count,
        };
    }

    /**
     * 给已抽出的结果补充角色名。使用独立于主随机流的辅助 RNG：
     * 日后调整卡池内容不会改变出货序列，只改变展示名称。
     */
    private assignNames(results: GachaResult[]): void {
        const nameRng = new SeededRNG((this.baseSeed ^ 0x5bd1e995) || 1);
        const recentUp = new Set<string>();
        const recentOff = new Set<string>();
        const recentFour = new Set<string>();

        for (const result of results) {
            if (result.rarity === 5) {
                if (result.isUp) {
                    result.name = nameRng.pickName(Object.keys(UP_FIVE_STAR_POOL), recentUp);
                    recentUp.add(result.name);
                } else {
                    result.name = nameRng.pickName(Object.keys(OFF_BANNER_FIVE_STAR_POOL), recentOff);
                    recentOff.add(result.name);
                }
            } else if (result.rarity === 4) {
                result.name = nameRng.pickName(Object.keys(FOUR_STAR_POOL), recentFour);
                recentFour.add(result.name);
            }
            // 三星为武器，不命名
        }
    }
}

// ==================== 公开API ====================

/**
 * 生成每日种子
 * @param userId 用户ID
 * @param date 可选日期，默认为今天
 */
export function getDailySeed(userId: string, date?: string): number {
    const dateStr = date || getLocalDateStr();
    const combined = `${userId}_${dateStr}_wutheringwaves_fortune`;
    return hashToSeed(combined);
}

/**
 * 获取运势等级文字
 */
function getLuckLevel(score: number): string {
    if (score >= 90) return '🌟 超吉 - 天命所归！';
    if (score >= 75) return '✨ 大吉 - 欧气护体！';
    if (score >= 60) return '🍀 中吉 - 小有运气';
    if (score >= 40) return '😊 小吉 - 平稳度日';
    if (score >= 25) return '😐 平 - 中规中矩';
    if (score >= 10) return '😔 小凶 - 稍有不顺';
    return '💀 大凶 - 今日宜挂机';
}

/**
 * 获取运势建议
 */
function getRecommendation(score: number, element: WutheringElement): string {
    if (score >= 75) {
        return `今天欧气满满！推荐使用【${element}】属性角色，适合抽卡！`;
    }
    if (score >= 50) {
        return `运势尚可，使用【${element}】属性角色可能带来好运。`;
    }
    if (score >= 25) {
        return `今日运势一般，建议专注日常任务，佩戴【${element}】角色转运。`;
    }
    return `今日不宜抽卡！建议挂机刷声骸，多用【${element}】角色积攒人品。`;
}

/**
 * 获取今日完整运势
 * @param userId 用户ID
 */
export function getDailyFortune(userId: string): DailyFortuneData {
    const date = getLocalDateStr();
    const seed = getDailySeed(userId, date);

    // 使用种子生成各项数据
    const rng = new SeededRNG(seed);
    const luckScore = rng.nextInt(0, 100);
    const luckyElement = rng.pick(WUTHERING_ELEMENTS);

    // 模拟抽卡
    const gachaSeed = rng.nextInt(1, 2147483647);
    const simulator = new SeededGachaSimulator(gachaSeed);
    const simulatedPull = simulator.pullSimulated(DAILY_PULL_COUNT);

    return {
        userId,
        date,
        seed,
        luckScore,
        luckyElement,
        luckLevel: getLuckLevel(luckScore),
        recommendation: getRecommendation(luckScore, luckyElement),
        simulatedPull,
    };
}

/**
 * 获取指定日期的运势分数
 */
export function getFortuneForDate(userId: string, date: string): number {
    const seed = getDailySeed(userId, date);
    const rng = new SeededRNG(seed);
    return rng.nextInt(0, 100);
}

/**
 * 生成运势趋势数据 (过去2天 + 今天 + 未来4天)
 */
export function generateTrendData(userId: string): TrendDataPoint[] {
    const today = new Date();
    const data: TrendDataPoint[] = [];

    const dayLabels = ['前天', '昨天', '今天', '明天', '后天', '大后天', '第四天'];

    for (let i = -2; i <= 4; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = getLocalDateStr(date);
        const score = getFortuneForDate(userId, dateStr);

        data.push({
            date: dateStr,
            score,
            label: dayLabels[i + 2],
        });
    }

    return data;
}
