-- wuthering-luck Supabase 建表脚本
-- 在 Supabase Dashboard -> SQL Editor 中整段执行

-- 收藏的 UID 列表（跨设备同步）
create table if not exists public.watchlist (
    id bigint generated always as identity primary key,
    user_id uuid not null references auth.users on delete cascade,
    uid text not null check (uid ~ '^\d{6,12}$'),
    label text,
    created_at timestamptz not null default now(),
    unique (user_id, uid)
);

alter table public.watchlist enable row level security;

-- 每个用户只能读写自己的收藏
create policy "watchlist_select_own"
    on public.watchlist for select
    using (auth.uid() = user_id);

create policy "watchlist_insert_own"
    on public.watchlist for insert
    with check (auth.uid() = user_id);

create policy "watchlist_delete_own"
    on public.watchlist for delete
    using (auth.uid() = user_id);

create policy "watchlist_update_own"
    on public.watchlist for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- 邮箱魔法链接的发送限流可在 Dashboard -> Auth -> Rate Limits 调整
-- （默认每小时 2 封，开发期建议调高）
