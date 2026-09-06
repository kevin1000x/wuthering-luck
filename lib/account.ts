/**
 * 账号与云端收藏：魔法链接邮箱登录 + watchlist CRUD。
 * 所有函数都要求已配置 Supabase；调用方用 isSupabaseConfigured 先行判断。
 */
import { getSupabase } from './supabase';

export interface WatchlistItem {
    id: number;
    uid: string;
    label: string | null;
}

/** 发送魔法链接登录邮件 */
export async function sendMagicLink(email: string): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) throw error;
}

export async function signOut(): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * 订阅会话变化（登录/登出/魔法链接回跳）。
 * 返回取消订阅函数。
 */
export function onSessionChange(
    callback: (email: string | null) => void
): () => void {
    const supabase = getSupabase();
    const notify = async () => {
        const { data } = await supabase.auth.getSession();
        callback(data.session?.user?.email ?? null);
    };
    notify();
    const { data } = supabase.auth.onAuthStateChange(() => {
        notify();
    });
    return () => data.subscription.unsubscribe();
}

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('watchlist')
        .select('id, uid, label')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function addToWatchlist(uid: string): Promise<WatchlistItem[]> {
    const supabase = getSupabase();
    const { error } = await supabase
        .from('watchlist')
        .insert({ uid });
    if (error) throw error;
    return fetchWatchlist();
}

export async function removeFromWatchlist(id: number): Promise<WatchlistItem[]> {
    const supabase = getSupabase();
    const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return fetchWatchlist();
}
