-- =========================
-- USERS TABLE (Clerk Sync)
-- =========================
create table if not exists users (
  id text primary key, -- Clerk user ID
  email text unique not null,
  first_name text,
  last_name text,
  image_url text,
  plan text default 'free', -- free | basic | advanced
  stripe_customer_id text,
  credits integer default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table users enable row level security;

create policy "Public profiles are viewable"
on users for select using (true);

create policy "Users can update their own profile"
on users for update using (auth.uid()::text = id);

-- =========================
-- SERIES TABLE
-- =========================
create table if not exists series (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id) on delete cascade,
  name text not null,
  topic text not null,
  style text, -- classic | highlight | modern | etc.
  frequency text, -- daily | weekly | etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table series enable row level security;

create policy "Users can view their own series"
on series for select using (auth.uid()::text = user_id);

create policy "Users can insert their own series"
on series for insert with check (auth.uid()::text = user_id);

create policy "Users can update their own series"
on series for update using (auth.uid()::text = user_id);

create policy "Users can delete their own series"
on series for delete using (auth.uid()::text = user_id);

-- =========================
-- VIDEOS TABLE
-- =========================
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id) on delete cascade,
  series_id uuid references series(id) on delete set null,
  title text,
  script text,
  hook text, -- First 3 seconds text
  caption text,
  hashtags text[],
  video_url text,
  thumbnail_url text,
  voice_id text,
  background_url text,
  music_url text,
  style_preset text,
  viral_score integer, -- 0-100
  status text default 'draft', -- draft | processing | generated | scheduled | posted | failed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table videos enable row level security;

create policy "Users can view their own videos"
on videos for select using (auth.uid()::text = user_id);

create policy "Users can insert their own videos"
on videos for insert with check (auth.uid()::text = user_id);

create policy "Users can update their own videos"
on videos for update using (auth.uid()::text = user_id);

create policy "Users can delete their own videos"
on videos for delete using (auth.uid()::text = user_id);

-- =========================
-- SOCIAL ACCOUNTS TABLE
-- =========================
create table if not exists social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id) on delete cascade,
  platform text not null, -- youtube | instagram | tiktok
  account_name text,
  access_token text, -- Encrypted? Ideally yes, but handled in app logic or Supabase Vault if available
  refresh_token text,
  expires_at timestamp with time zone,
  connected_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table social_accounts enable row level security;

create policy "Users can manage their social accounts"
on social_accounts for all using (auth.uid()::text = user_id);

-- =========================
-- SCHEDULE TABLE
-- =========================
create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references videos(id) on delete cascade,
  user_id text references users(id) on delete cascade,
  platform text not null,
  scheduled_time timestamp with time zone not null,
  status text default 'pending', -- pending | posted | failed
  posted_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table schedules enable row level security;

create policy "Users can manage their schedules"
on schedules for all using (auth.uid()::text = user_id);

-- =========================
-- SUBSCRIPTIONS TABLE
-- =========================
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id) on delete cascade unique,
  stripe_subscription_id text,
  status text not null, -- active | canceled | past_due
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table subscriptions enable row level security;

create policy "Users can view their own subscription"
on subscriptions for select using (auth.uid()::text = user_id);

-- =========================
-- UTILITIES
-- =========================
create extension if not exists "pgcrypto";
