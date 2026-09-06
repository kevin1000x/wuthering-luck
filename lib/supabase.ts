/**
 * Supabase 客户端工厂。
 * 未配置环境变量时 isSupabaseConfigured 为 false，
 * 账号相关 UI 应据此优雅降级（整个功能隐藏）。
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (!isSupabaseConfigured) {
        throw new Error('Supabase 未配置：请设置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    if (!cached) {
        cached = createClient(url!, anonKey!, {
            auth: {
                // 魔法链接点击回来后自动解析 URL 中的会话
                detectSessionInUrl: true,
                persistSession: true,
                autoRefreshToken: true,
            },
        });
    }
    return cached;
}
