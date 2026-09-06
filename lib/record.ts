/**
 * 战绩分享与对比链接工具（纯客户端，零后端）
 */

import { DailyFortuneData } from './dailyLuck';

export interface RecentUid {
    uid: string;
    ts: number;
}

const RECENT_KEY = 'ww-luck-recent-uids';
const RECENT_LIMIT = 6;

/** 生成可发布到群聊的文字战绩（自带链接，接收者打开即见结果） */
export function buildRecordText(fortune: DailyFortuneData, origin: string): string {
    const results = fortune.simulatedPull.results;
    const star5 = results.filter(r => r.rarity === 5).length;
    const star4 = results.filter(r => r.rarity === 4).length;
    return [
        `🔮 鸣潮今日运势 ${fortune.luckScore}分 ${fortune.luckLevel}`,
        `七十连：${star5}金${star4}紫 | 幸运属性【${fortune.luckyElement}】`,
        `UID ${fortune.userId}`,
        `▶ ${origin}/?uid=${fortune.userId}`,
    ].join('\n');
}

/** 对比链接：打开即见 uid 的结果 + 与 compare 的对比 */
export function buildCompareLink(uid: string, compareUid: string | null, origin: string): string {
    const params = new URLSearchParams({ uid });
    if (compareUid) params.set('compare', compareUid);
    return `${origin}/?${params.toString()}`;
}

export function loadRecentUids(): RecentUid[] {
    try {
        const raw = localStorage.getItem(RECENT_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.slice(0, RECENT_LIMIT) : [];
    } catch {
        return [];
    }
}

/** 记录一次查询（去重置顶，超限截断） */
export function saveRecentUid(uid: string): RecentUid[] {
    const now = Date.now();
    const next = [
        { uid, ts: now },
        ...loadRecentUids().filter(r => r.uid !== uid),
    ].slice(0, RECENT_LIMIT);
    try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
        // 隐私模式等场景下写入失败不影响主流程
    }
    return next;
}

/** 距今的相对天数文案 */
export function relativeDayLabel(ts: number): string {
    const dayMs = 24 * 60 * 60 * 1000;
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const diff = Math.floor((startOfToday - new Date(ts).setHours(0, 0, 0, 0)) / dayMs);
    if (diff <= 0) return '今天';
    if (diff === 1) return '昨天';
    return `${diff}天前`;
}
