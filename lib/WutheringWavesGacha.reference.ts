/**
 * Wuthering Waves Gacha Simulator
 * 精确模拟《鸣潮》抽卡机制
 */

// ==================== 类型定义 ====================

/** 稀有度定义 */
type Rarity = 3 | 4 | 5;

/** 卡池类型 */
type BannerType = 'CharacterEvent' | 'WeaponEvent';

/** 单次抽卡结果 */
interface GachaResult {
    rarity: Rarity;
    isUp: boolean;
    pullNumber: number; // 当前是第几抽
}

/** 十连抽卡结果 */
interface TenPullResult {
    results: GachaResult[];
    totalFiveStars: number;
    totalFourStars: number;
}

/** 卡池状态（用于保底追踪） */
interface BannerState {
    pity5: number;        // 距离上次5星的抽数
    pity4: number;        // 距离上次4星的抽数
    guaranteed5Up: boolean; // 是否5星大保底
    guaranteed4Up: boolean; // 是否4星大保底
}

/** 模拟统计结果 */
interface SimulationStats {
    totalPulls: number;
    fiveStarCount: number;
    fourStarCount: number;
    fiveStarRate: number;
    fourStarRate: number;
    upFiveStarCount: number;
    upFiveStarRate: number;
    averagePullsPerFiveStar: number;
}

// ==================== 常量定义 ====================

/** 基础概率 */
const BASE_5STAR_RATE = 0.008;  // 0.8%
const BASE_4STAR_RATE = 0.06;   // 6.0%

/** 硬保底抽数 */
const HARD_PITY_5STAR = 80;
const HARD_PITY_4STAR = 10;

/** 软保底起始点 */
const SOFT_PITY_START = 66;

// ==================== 主类 ====================

class WutheringWavesGacha {
    /** 各卡池状态 */
    private bannerStates: Map<BannerType, BannerState> = new Map();

    constructor() {
        this.initBannerStates();
    }

    /** 初始化卡池状态 */
    private initBannerStates(): void {
        const initialState: BannerState = {
            pity5: 0,
            pity4: 0,
            guaranteed5Up: false,
            guaranteed4Up: false,
        };

        this.bannerStates.set('CharacterEvent', { ...initialState });
        this.bannerStates.set('WeaponEvent', { ...initialState });
    }

    /** 重置指定卡池 */
    public resetBanner(bannerType: BannerType): void {
        this.bannerStates.set(bannerType, {
            pity5: 0,
            pity4: 0,
            guaranteed5Up: false,
            guaranteed4Up: false,
        });
    }

    /** 重置所有卡池 */
    public resetAll(): void {
        this.initBannerStates();
    }

    /**
     * 计算当前5星概率（含软保底）
     * 使用线性插值：从第66抽开始，概率从基础值线性增长到第80抽的100%
     */
    private calculate5StarRate(currentPity: number): number {
        if (currentPity < SOFT_PITY_START) {
            return BASE_5STAR_RATE;
        }

        if (currentPity >= HARD_PITY_5STAR) {
            return 1.0;
        }

        // 线性插值: 从第66抽(0.8%)到第80抽(100%)
        // 每抽增加的概率 = (1.0 - 0.008) / (80 - 66) = 0.992 / 14 ≈ 0.0709
        const pullsIntoPity = currentPity - SOFT_PITY_START + 1;
        const totalSoftPityPulls = HARD_PITY_5STAR - SOFT_PITY_START;
        const rate = BASE_5STAR_RATE + (1.0 - BASE_5STAR_RATE) * (pullsIntoPity / totalSoftPityPulls);

        return Math.min(rate, 1.0);
    }

    /**
     * 计算当前4星概率
     * 第10抽必出4星
     */
    private calculate4StarRate(currentPity: number): number {
        if (currentPity >= HARD_PITY_4STAR) {
            return 1.0;
        }
        return BASE_4STAR_RATE;
    }

    /**
     * 判断是否为UP角色/武器
     * @param bannerType 卡池类型
     * @param isGuaranteed 是否大保底
     */
    private isUpItem(bannerType: BannerType, isGuaranteed: boolean): boolean {
        if (bannerType === 'WeaponEvent') {
            // 武器池100%出UP武器
            return true;
        }

        // 角色池: 50%概率出UP，若已触发大保底则必出UP
        if (isGuaranteed) {
            return true;
        }

        return Math.random() < 0.5;
    }

    /**
     * 单次抽卡
     * @param bannerType 卡池类型
     */
    public pullOne(bannerType: BannerType): GachaResult {
        const state = this.bannerStates.get(bannerType)!;

        // 增加保底计数
        state.pity5++;
        state.pity4++;

        const currentPullNumber = state.pity5;

        // 计算当前概率
        const rate5Star = this.calculate5StarRate(state.pity5);
        const rate4Star = this.calculate4StarRate(state.pity4);

        const roll = Math.random();

        // 判定5星
        if (roll < rate5Star) {
            const isUp = this.isUpItem(bannerType, state.guaranteed5Up);

            // 更新状态
            state.pity5 = 0;

            // 角色池: 如果歪了，下次必出UP
            if (bannerType === 'CharacterEvent') {
                state.guaranteed5Up = !isUp;
            }

            return {
                rarity: 5,
                isUp,
                pullNumber: currentPullNumber,
            };
        }

        // 判定4星（5星判定失败后才判定4星）
        if (roll < rate5Star + rate4Star || state.pity4 >= HARD_PITY_4STAR) {
            const isUp = this.isUpItem(bannerType, state.guaranteed4Up);

            // 更新状态
            state.pity4 = 0;

            // 角色池: 4星也有小保底机制
            if (bannerType === 'CharacterEvent') {
                state.guaranteed4Up = !isUp;
            }

            return {
                rarity: 4,
                isUp,
                pullNumber: currentPullNumber,
            };
        }

        // 3星
        return {
            rarity: 3,
            isUp: false,
            pullNumber: currentPullNumber,
        };
    }

    /**
     * 十连抽
     * 保证至少包含一个4星或以上
     * @param bannerType 卡池类型
     */
    public pullTen(bannerType: BannerType): TenPullResult {
        const results: GachaResult[] = [];
        let hasHighRarity = false;

        for (let i = 0; i < 10; i++) {
            const result = this.pullOne(bannerType);
            results.push(result);

            if (result.rarity >= 4) {
                hasHighRarity = true;
            }
        }

        // 十连保底：如果没有4星以上，最后一发强制变成4星
        // 注意：由于4星硬保底是10抽，正常情况下十连必定有4星
        // 这里作为额外保险措施
        if (!hasHighRarity && results.length > 0) {
            const lastResult = results[results.length - 1];
            lastResult.rarity = 4;
            lastResult.isUp = this.isUpItem(bannerType, false);
        }

        const totalFiveStars = results.filter(r => r.rarity === 5).length;
        const totalFourStars = results.filter(r => r.rarity === 4).length;

        return {
            results,
            totalFiveStars,
            totalFourStars,
        };
    }

    /** 获取当前卡池状态（用于调试） */
    public getBannerState(bannerType: BannerType): BannerState {
        return { ...this.bannerStates.get(bannerType)! };
    }
}

// ==================== 每日运势模块 (DailyFortune) ====================

/** 鸣潮六大属性 */
type WutheringElement = '热熔' | '衍射' | '气动' | '冷凝' | '导电' | '湮灭';

const WUTHERING_ELEMENTS: WutheringElement[] = [
    '热熔', '衍射', '气动', '冷凝', '导电', '湮灭'
];

/** 每日运势结果 */
interface DailyFortuneResult {
    userId: string;
    date: string;
    seed: number;
    luckScore: number;
    luckyElement: WutheringElement;
    luckyPullSimulation: TenPullResult;
    luckLevel: string;
    recommendation: string;
}

/**
 * 确定性随机数生成器 (Seeded RNG)
 * 使用线性同余生成器 (LCG) 算法
 */
class SeededRNG {
    private seed: number;

    // LCG 参数 (使用 MINSTD 参数)
    private readonly a = 48271;
    private readonly m = 2147483647; // 2^31 - 1

    constructor(seed: number) {
        // 确保种子为正整数
        this.seed = Math.abs(seed) % this.m;
        if (this.seed === 0) this.seed = 1;
    }

    /**
     * 生成下一个随机数 [0, 1)
     */
    public next(): number {
        this.seed = (this.a * this.seed) % this.m;
        return this.seed / this.m;
    }

    /**
     * 生成指定范围内的整数 [min, max]
     */
    public nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    /**
     * 从数组中随机选择一个元素
     */
    public pick<T>(array: T[]): T {
        const index = this.nextInt(0, array.length - 1);
        return array[index];
    }

    /** 获取当前种子值 */
    public getSeed(): number {
        return this.seed;
    }
}

/**
 * djb2 哈希函数
 * 经典的字符串哈希算法，由 Daniel J. Bernstein 创建
 */
function djb2Hash(str: string): number {
    let hash = 5381;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        // hash * 33 + char (使用位运算优化)
        hash = ((hash << 5) + hash) + char;
        // 保持在32位整数范围内
        hash = hash >>> 0;
    }

    return hash;
}

/**
 * 使用种子的抽卡模拟器
 * 不影响真实抽卡状态，仅用于运势预测
 */
class SeededWutheringWavesGacha {
    private rng: SeededRNG;
    private pity5: number = 0;
    private pity4: number = 0;
    private guaranteed5Up: boolean = false;
    private guaranteed4Up: boolean = false;

    constructor(seed: number) {
        this.rng = new SeededRNG(seed);
    }

    private calculate5StarRate(currentPity: number): number {
        if (currentPity < SOFT_PITY_START) {
            return BASE_5STAR_RATE;
        }
        if (currentPity >= HARD_PITY_5STAR) {
            return 1.0;
        }
        const pullsIntoPity = currentPity - SOFT_PITY_START + 1;
        const totalSoftPityPulls = HARD_PITY_5STAR - SOFT_PITY_START;
        return Math.min(
            BASE_5STAR_RATE + (1.0 - BASE_5STAR_RATE) * (pullsIntoPity / totalSoftPityPulls),
            1.0
        );
    }

    private calculate4StarRate(currentPity: number): number {
        return currentPity >= HARD_PITY_4STAR ? 1.0 : BASE_4STAR_RATE;
    }

    private isUpItem(bannerType: BannerType, isGuaranteed: boolean): boolean {
        if (bannerType === 'WeaponEvent') return true;
        if (isGuaranteed) return true;
        return this.rng.next() < 0.5;
    }

    public pullOne(bannerType: BannerType): GachaResult {
        this.pity5++;
        this.pity4++;

        const currentPullNumber = this.pity5;
        const rate5Star = this.calculate5StarRate(this.pity5);
        const rate4Star = this.calculate4StarRate(this.pity4);
        const roll = this.rng.next();

        if (roll < rate5Star) {
            const isUp = this.isUpItem(bannerType, this.guaranteed5Up);
            this.pity5 = 0;
            if (bannerType === 'CharacterEvent') {
                this.guaranteed5Up = !isUp;
            }
            return { rarity: 5, isUp, pullNumber: currentPullNumber };
        }

        if (roll < rate5Star + rate4Star || this.pity4 >= HARD_PITY_4STAR) {
            const isUp = this.isUpItem(bannerType, this.guaranteed4Up);
            this.pity4 = 0;
            if (bannerType === 'CharacterEvent') {
                this.guaranteed4Up = !isUp;
            }
            return { rarity: 4, isUp, pullNumber: currentPullNumber };
        }

        return { rarity: 3, isUp: false, pullNumber: currentPullNumber };
    }

    public pullTen(bannerType: BannerType): TenPullResult {
        const results: GachaResult[] = [];
        let hasHighRarity = false;

        for (let i = 0; i < 10; i++) {
            const result = this.pullOne(bannerType);
            results.push(result);
            if (result.rarity >= 4) hasHighRarity = true;
        }

        if (!hasHighRarity && results.length > 0) {
            const lastResult = results[results.length - 1];
            lastResult.rarity = 4;
            lastResult.isUp = this.isUpItem(bannerType, false);
        }

        return {
            results,
            totalFiveStars: results.filter(r => r.rarity === 5).length,
            totalFourStars: results.filter(r => r.rarity === 4).length,
        };
    }
}

/**
 * 每日运势模块
 * 基于用户ID和日期生成确定性的运势结果
 */
class DailyFortune {
    private userId: string;
    private date: string;
    private seed: number;
    private rng: SeededRNG;

    /**
     * @param userId 用户唯一标识
     * @param date 日期字符串，格式如 "2024-05-23"
     */
    constructor(userId: string, date: string) {
        this.userId = userId;
        this.date = date;

        // 使用 djb2 哈希生成种子
        const combinedString = `${userId}_${date}_wutheringwaves`;
        this.seed = djb2Hash(combinedString);
        this.rng = new SeededRNG(this.seed);
    }

    /**
     * 获取今日运势分数 (0-100)
     */
    public getLuckScore(): number {
        // 使用新的 RNG 实例确保每次调用结果一致
        const rng = new SeededRNG(this.seed);
        return rng.nextInt(0, 100);
    }

    /**
     * 获取今日幸运属性
     */
    public getLuckyElement(): WutheringElement {
        const rng = new SeededRNG(this.seed);
        // 跳过第一个随机数（被 luckScore 使用）
        rng.next();
        return rng.pick(WUTHERING_ELEMENTS);
    }

    /**
     * 模拟今日抽卡运势
     * 重要：这是虚构模拟，不消耗真实资源
     */
    public simulateLuckyPull(bannerType: BannerType = 'CharacterEvent'): TenPullResult {
        const rng = new SeededRNG(this.seed);
        // 跳过前两个随机数
        rng.next();
        rng.next();

        // 使用种子创建独立的模拟抽卡器
        const seededGacha = new SeededWutheringWavesGacha(rng.nextInt(1, 2147483647));
        return seededGacha.pullTen(bannerType);
    }

    /**
     * 根据分数获取运势等级
     */
    private getLuckLevel(score: number): string {
        if (score >= 90) return '🌟 超吉 - 天命所归！';
        if (score >= 75) return '✨ 大吉 - 欧气护体！';
        if (score >= 60) return '🍀 中吉 - 小有运气';
        if (score >= 40) return '😊 小吉 - 平稳度日';
        if (score >= 25) return '😐 平 - 中规中矩';
        if (score >= 10) return '😔 小凶 - 稍有不顺';
        return '💀 大凶 - 今日宜挂机';
    }

    /**
     * 根据运势生成建议
     */
    private getRecommendation(score: number, element: WutheringElement): string {
        if (score >= 75) {
            return `今天欧气满满！推荐使用【${element}】属性角色会有意想不到的收获。适合抽卡！`;
        }
        if (score >= 50) {
            return `运势尚可，使用【${element}】属性角色可能带来好运。可以考虑小抽怡情。`;
        }
        if (score >= 25) {
            return `今日运势一般，建议专注日常任务。佩戴【${element}】属性角色或许能转运。`;
        }
        return `今日不宜抽卡！建议挂机刷声骸，多使用【${element}】属性角色积攒人品。`;
    }

    /**
     * 获取完整的每日运势报告
     */
    public getFullFortune(bannerType: BannerType = 'CharacterEvent'): DailyFortuneResult {
        const luckScore = this.getLuckScore();
        const luckyElement = this.getLuckyElement();
        const luckyPullSimulation = this.simulateLuckyPull(bannerType);

        return {
            userId: this.userId,
            date: this.date,
            seed: this.seed,
            luckScore,
            luckyElement,
            luckyPullSimulation,
            luckLevel: this.getLuckLevel(luckScore),
            recommendation: this.getRecommendation(luckScore, luckyElement),
        };
    }

    /** 获取种子值（用于调试） */
    public getSeed(): number {
        return this.seed;
    }
}

/**
 * 打印每日运势报告
 */
function printDailyFortune(fortune: DailyFortuneResult): void {
    console.log('\n' + '═'.repeat(50));
    console.log('🎴 《鸣潮》每日运势');
    console.log('═'.repeat(50));
    console.log(`👤 共鸣者: ${fortune.userId}`);
    console.log(`📅 日期: ${fortune.date}`);
    console.log(`🎲 命运种子: ${fortune.seed}`);
    console.log('-'.repeat(50));
    console.log(`📊 今日运势分数: ${fortune.luckScore}/100`);
    console.log(`🔮 运势等级: ${fortune.luckLevel}`);
    console.log(`⚡ 幸运属性: ${fortune.luckyElement}`);
    console.log('-'.repeat(50));
    console.log(`💡 建议: ${fortune.recommendation}`);
    console.log('-'.repeat(50));
    console.log('🎰 今日模拟十连 (仅供参考，不消耗资源):');

    const pull = fortune.luckyPullSimulation;
    const pullSummary = pull.results.map((r, i) => {
        const stars = '★'.repeat(r.rarity);
        const upTag = r.isUp && r.rarity >= 4 ? ' [UP]' : '';
        return `  ${(i + 1).toString().padStart(2, '0')}. ${stars}${upTag}`;
    }).join('\n');

    console.log(pullSummary);
    console.log(`\n  📈 结果统计: ${pull.totalFiveStars}个5星, ${pull.totalFourStars}个4星`);
    console.log('═'.repeat(50));
}

/**
 * 测试每日运势模块
 */
function testDailyFortune(): void {
    console.log('\n\n');
    console.log('='.repeat(60));
    console.log('每日运势模块测试');
    console.log('='.repeat(60));

    // 测试同一用户同一天的结果是否一致
    const fortune1 = new DailyFortune('player123', '2024-05-23');
    const fortune2 = new DailyFortune('player123', '2024-05-23');

    console.log('\n【一致性测试】同一用户同一天:');
    console.log(`用户 player123 @ 2024-05-23:`);
    console.log(`  第一次: 分数=${fortune1.getLuckScore()}, 属性=${fortune1.getLuckyElement()}`);
    console.log(`  第二次: 分数=${fortune2.getLuckScore()}, 属性=${fortune2.getLuckyElement()}`);
    console.log(`  种子一致: ${fortune1.getSeed() === fortune2.getSeed() ? '✅' : '❌'}`);

    // 测试不同日期的结果
    console.log('\n【差异性测试】同一用户不同天:');
    const dates = ['2024-05-23', '2024-05-24', '2024-05-25'];
    dates.forEach(date => {
        const f = new DailyFortune('player123', date);
        console.log(`  ${date}: 分数=${f.getLuckScore()}, 属性=${f.getLuckyElement()}`);
    });

    // 测试不同用户同一天
    console.log('\n【差异性测试】不同用户同一天:');
    const users = ['player123', 'VIP_user_456', 'newbie_789'];
    users.forEach(userId => {
        const f = new DailyFortune(userId, '2024-05-23');
        console.log(`  ${userId}: 分数=${f.getLuckScore()}, 属性=${f.getLuckyElement()}`);
    });

    // 展示完整运势报告
    console.log('\n【完整运势报告示例】');
    const fullFortune = new DailyFortune('漂泊者_2024', '2024-05-23').getFullFortune('CharacterEvent');
    printDailyFortune(fullFortune);
}

// ==================== 测试模拟函数 ====================

/**
 * 模拟测试函数
 * 模拟100万次抽卡，验证综合获取率
 */
function testSimulation(): void {
    const TOTAL_PULLS = 1_000_000;
    const gacha = new WutheringWavesGacha();

    console.log('='.repeat(60));
    console.log('《鸣潮》抽卡模拟器 - 百万次抽卡测试');
    console.log('='.repeat(60));

    // 测试角色池
    console.log('\n【角色活动卡池 (CharacterEvent)】');
    const charStats = runSimulation(gacha, 'CharacterEvent', TOTAL_PULLS);
    printStats(charStats);

    // 重置后测试武器池
    gacha.resetAll();
    console.log('\n【武器活动卡池 (WeaponEvent)】');
    const weaponStats = runSimulation(gacha, 'WeaponEvent', TOTAL_PULLS);
    printStats(weaponStats);

    console.log('\n' + '='.repeat(60));
    console.log('模拟完成！');
    console.log('='.repeat(60));
}

/**
 * 执行模拟
 */
function runSimulation(
    gacha: WutheringWavesGacha,
    bannerType: BannerType,
    totalPulls: number
): SimulationStats {
    gacha.resetBanner(bannerType);

    let fiveStarCount = 0;
    let fourStarCount = 0;
    let upFiveStarCount = 0;

    for (let i = 0; i < totalPulls; i++) {
        const result = gacha.pullOne(bannerType);

        if (result.rarity === 5) {
            fiveStarCount++;
            if (result.isUp) {
                upFiveStarCount++;
            }
        } else if (result.rarity === 4) {
            fourStarCount++;
        }
    }

    return {
        totalPulls,
        fiveStarCount,
        fourStarCount,
        fiveStarRate: (fiveStarCount / totalPulls) * 100,
        fourStarRate: (fourStarCount / totalPulls) * 100,
        upFiveStarCount,
        upFiveStarRate: (upFiveStarCount / totalPulls) * 100,
        averagePullsPerFiveStar: totalPulls / fiveStarCount,
    };
}

/**
 * 打印统计结果
 */
function printStats(stats: SimulationStats): void {
    console.log(`\n总抽数: ${stats.totalPulls.toLocaleString()}`);
    console.log('-'.repeat(40));
    console.log(`5星数量: ${stats.fiveStarCount.toLocaleString()}`);
    console.log(`5星综合概率: ${stats.fiveStarRate.toFixed(4)}%`);
    console.log(`平均出货抽数: ${stats.averagePullsPerFiveStar.toFixed(2)} 抽`);
    console.log('-'.repeat(40));
    console.log(`UP 5星数量: ${stats.upFiveStarCount.toLocaleString()}`);
    console.log(`UP 5星综合概率: ${stats.upFiveStarRate.toFixed(4)}%`);
    console.log('-'.repeat(40));
    console.log(`4星数量: ${stats.fourStarCount.toLocaleString()}`);
    console.log(`4星综合概率: ${stats.fourStarRate.toFixed(4)}%`);
}

// ==================== 导出 ====================

export {
    // 抽卡系统
    WutheringWavesGacha,
    testSimulation,
    GachaResult,
    TenPullResult,
    BannerType,
    BannerState,
    SimulationStats,
    Rarity,
    // 每日运势模块
    DailyFortune,
    DailyFortuneResult,
    WutheringElement,
    SeededRNG,
    djb2Hash,
    testDailyFortune,
    printDailyFortune,
};

// 直接运行测试
testSimulation();
testDailyFortune();
