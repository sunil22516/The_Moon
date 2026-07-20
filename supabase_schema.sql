-- ═══════════════════════════════════════════════
-- MOON — Production Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════

-- ── User Profiles ────────────────────────────────
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text default '',
  follower_count integer default 0,
  following_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Voice Posts ──────────────────────────────────
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  audio_url text not null,
  cover_url text,
  caption text default '',
  duration_seconds integer default 0,
  category text default 'music',
  tags text[] default '{}',
  is_demo boolean default false,
  like_count integer default 0,
  comment_count integer default 0,
  share_count integer default 0,
  play_count integer default 0,
  created_at timestamptz default now()
);

-- ── Likes ────────────────────────────────────────
create table if not exists likes (
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- ── Comments ─────────────────────────────────────
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- ── Follows ──────────────────────────────────────
create table if not exists follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

-- ── Saves / Bookmarks ───────────────────────────
create table if not exists saves (
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);


-- ═══════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════

alter table profiles enable row level security;
alter table posts    enable row level security;
alter table likes    enable row level security;
alter table comments enable row level security;
alter table follows  enable row level security;
alter table saves    enable row level security;

-- Profiles: anyone can read, users edit their own
create policy "profiles_read"   on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (id = auth.uid());
create policy "profiles_update" on profiles for update using (id = auth.uid());

-- Posts: anyone can read, users insert/delete their own
create policy "posts_read"   on posts for select using (true);
create policy "posts_insert" on posts for insert with check (user_id = auth.uid());
create policy "posts_delete" on posts for delete using (user_id = auth.uid());

-- Likes: anyone can read, users insert/delete their own
create policy "likes_read"   on likes for select using (true);
create policy "likes_insert" on likes for insert with check (user_id = auth.uid());
create policy "likes_delete" on likes for delete using (user_id = auth.uid());

-- Comments: anyone can read, users insert their own, delete their own
create policy "comments_read"   on comments for select using (true);
create policy "comments_insert" on comments for insert with check (user_id = auth.uid());
create policy "comments_delete" on comments for delete using (user_id = auth.uid());

-- Follows: anyone can read, users manage their own follows
create policy "follows_read"   on follows for select using (true);
create policy "follows_insert" on follows for insert with check (follower_id = auth.uid());
create policy "follows_delete" on follows for delete using (follower_id = auth.uid());

-- Saves: users read/insert/delete their own
create policy "saves_read"   on saves for select using (user_id = auth.uid());
create policy "saves_insert" on saves for insert with check (user_id = auth.uid());
create policy "saves_delete" on saves for delete using (user_id = auth.uid());


-- ═══════════════════════════════════════════════
-- Auto-create profile on signup
-- ═══════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ═══════════════════════════════════════════════
-- Auto-update like/comment counts
-- ═══════════════════════════════════════════════

create or replace function public.update_like_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update posts set like_count = like_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update posts set like_count = like_count - 1 where id = OLD.post_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create or replace trigger on_like_change
  after insert or delete on likes
  for each row execute function public.update_like_count();

create or replace function public.update_comment_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update posts set comment_count = comment_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update posts set comment_count = comment_count - 1 where id = OLD.post_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create or replace trigger on_comment_change
  after insert or delete on comments
  for each row execute function public.update_comment_count();


-- ═══════════════════════════════════════════════
-- Auto-update follower/following counts
-- ═══════════════════════════════════════════════

create or replace function public.update_follow_counts()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update profiles set following_count = following_count + 1 where id = NEW.follower_id;
    update profiles set follower_count = follower_count + 1 where id = NEW.following_id;
  elsif TG_OP = 'DELETE' then
    update profiles set following_count = following_count - 1 where id = OLD.follower_id;
    update profiles set follower_count = follower_count - 1 where id = OLD.following_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create or replace trigger on_follow_change
  after insert or delete on follows
  for each row execute function public.update_follow_counts();


-- ═══════════════════════════════════════════════
-- Indexes for performance
-- ═══════════════════════════════════════════════

create index if not exists idx_posts_user       on posts (user_id);
create index if not exists idx_posts_created     on posts (created_at desc);
create index if not exists idx_posts_category    on posts (category);
create index if not exists idx_likes_user        on likes (user_id);
create index if not exists idx_comments_post     on comments (post_id);
create index if not exists idx_follows_follower  on follows (follower_id);
create index if not exists idx_follows_following on follows (following_id);
