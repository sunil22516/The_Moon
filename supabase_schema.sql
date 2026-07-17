-- Run this once in Supabase Dashboard -> SQL Editor -> New query

create table tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  uploader_id uuid references auth.users(id) not null,
  audio_url text not null,
  cover_url text,
  approved boolean default false,
  created_at timestamptz default now()
);

create table likes (
  track_id uuid references tracks(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (track_id, user_id)
);

alter table tracks enable row level security;
alter table likes enable row level security;

-- anyone logged in can read approved tracks
create policy "read approved tracks"
  on tracks for select
  using (approved = true or uploader_id = auth.uid());

-- users can insert their own tracks
create policy "insert own tracks"
  on tracks for insert
  with check (uploader_id = auth.uid());

-- likes: anyone logged in can read, insert/delete only their own
create policy "read likes"
  on likes for select
  using (true);

create policy "insert own likes"
  on likes for insert
  with check (user_id = auth.uid());

create policy "delete own likes"
  on likes for delete
  using (user_id = auth.uid());

-- To approve a track yourself (run manually per track for now):
-- update tracks set approved = true where id = 'paste-track-id-here';
