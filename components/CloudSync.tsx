'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cloud, CloudUpload, X, LogOut, MailCheck } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
    sendMagicLink, signOut, onSessionChange,
    fetchWatchlist, addToWatchlist, removeFromWatchlist,
    WatchlistItem,
} from '@/lib/account';
import { isValidUid } from '@/lib/dailyLuck';

/**
 * 云端同步区块（首页检测台下方）。
 * 未配置 Supabase 时整个功能隐藏，线上站点行为与纯客户端版本完全一致。
 * 流程：邮箱魔法链接登录 → 收藏 UID 跨设备同步 → 点击即检测。
 */
export default function CloudSync() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [sessionEmail, setSessionEmail] = useState<string | null>(null);
    const [authReady, setAuthReady] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [newUid, setNewUid] = useState('');

    useEffect(() => {
        if (!isSupabaseConfigured) return;
        let alive = true;
        const detach = onSessionChange((mail) => {
            if (!alive) return;
            setSessionEmail(mail);
            setAuthReady(true);
            if (mail) {
                fetchWatchlist()
                    .then(list => alive && setItems(list))
                    .catch(() => alive && setItems([]));
            } else {
                setItems([]);
            }
        });
        return () => {
            alive = false;
            detach();
        };
    }, []);

    if (!isSupabaseConfigured) return null;

    const handleSendLink = async () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('请输入有效邮箱地址');
            return;
        }
        setBusy(true);
        setError('');
        try {
            await sendMagicLink(email.trim());
            setLinkSent(true);
        } catch {
            setError('发送失败，请稍后重试');
        } finally {
            setBusy(false);
        }
    };

    const handleAdd = async () => {
        const target = newUid.trim();
        if (!isValidUid(target)) {
            setError('UID必须是6-12位数字');
            return;
        }
        setBusy(true);
        setError('');
        try {
            setItems(await addToWatchlist(target));
            setNewUid('');
        } catch {
            setError('添加失败（可能已存在）');
        } finally {
            setBusy(false);
        }
    };

    const handleRemove = async (id: number) => {
        setBusy(true);
        try {
            setItems(await removeFromWatchlist(id));
        } catch {
            setError('删除失败');
        } finally {
            setBusy(false);
        }
    };

    const handleSignOut = async () => {
        setBusy(true);
        try {
            await signOut();
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-6 hud-panel corner-brackets p-5">
            <div className="flex items-center gap-3 mb-4">
                <Cloud className="w-4 h-4 text-ww-gold" />
                <span className="text-white/50 text-xs font-display tracking-[0.2em] uppercase">云端同步</span>
                {sessionEmail && (
                    <span className="text-white/35 text-xs font-display truncate max-w-[180px]">{sessionEmail}</span>
                )}
                <span className="rule flex-1 self-center h-px bg-[color:var(--gold-hair)]" />
                {sessionEmail && (
                    <button
                        onClick={handleSignOut}
                        disabled={busy}
                        aria-label="退出登录"
                        className="text-white/40 hover:text-ww-danger transition-colors disabled:opacity-50"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* 未登录：魔法链接邮箱登录 */}
            {!authReady || !sessionEmail ? (
                linkSent ? (
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                        <MailCheck className="w-5 h-5 text-ww-mint shrink-0" />
                        <span>登录链接已发送至 <span className="text-white/85">{email}</span>，请查收邮件并点击链接完成登录。</span>
                    </div>
                ) : (
                    <div>
                        <p className="text-white/40 text-sm mb-3 leading-relaxed">
                            登录后可跨设备同步收藏的 UID，历史运势依旧本地即时计算。
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="你的邮箱…"
                                autoComplete="email"
                                className="tech-input flex-1 min-w-0 px-4 py-2.5 rounded-sm text-white text-sm"
                            />
                            <button
                                onClick={handleSendLink}
                                disabled={busy}
                                className="tech-button shrink-0 px-4 py-2.5 rounded-sm text-ww-gold font-display text-sm
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CloudUpload className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                                发送登录链接
                            </button>
                        </div>
                    </div>
                )
            ) : (
                /* 已登录：收藏列表管理 */
                <div>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newUid}
                            onChange={(e) => setNewUid(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="收藏的UID，如 106971359…"
                            maxLength={12}
                            className="tech-input flex-1 min-w-0 px-4 py-2.5 rounded-sm text-white text-sm"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={busy}
                            className="tech-button shrink-0 px-4 py-2.5 rounded-sm text-ww-gold font-display text-sm
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            收藏
                        </button>
                    </div>

                    {items.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {items.map((it) => (
                                <span
                                    key={it.id}
                                    className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-sm text-xs font-display
                                             bg-white/5 border border-white/10 text-white/60"
                                >
                                    <button
                                        onClick={() => router.push(`/report?uid=${it.uid}`)}
                                        className="hover:text-ww-gold transition-colors"
                                    >
                                        {it.uid}
                                    </button>
                                    <button
                                        onClick={() => handleRemove(it.id)}
                                        disabled={busy}
                                        aria-label={`删除 ${it.uid}`}
                                        className="text-white/30 hover:text-ww-danger transition-colors disabled:opacity-50 p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    {items.length === 0 && (
                        <p className="text-white/30 text-xs font-display">收藏第一个 UID，同步到所有设备</p>
                    )}
                </div>
            )}

            {error && (
                <p className="text-red-400 text-xs mt-3 font-display" role="alert">⚠️ {error}</p>
            )}
        </div>
    );
}
