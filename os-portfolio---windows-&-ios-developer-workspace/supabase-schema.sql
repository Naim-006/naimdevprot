-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/vlmqlcqecamgxaelrlbp/sql/new)
-- Creates all tables needed for the portfolio app

-- 1. personal_info
create table if not exists personal_info (
  id bigint primary key default 1,
  name text not null default 'Developer',
  title text default '',
  tagline text default '',
  bio text default '',
  detailed_bio text default '',
  avatar_url text default '',
  location text default '',
  email text default '',
  phone text default '',
  availability text default '',
  resume_url text default '',
  socials jsonb default '{}',
  metrics jsonb default '{}',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- 2. skills
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  proficiency int check (proficiency between 0 and 100),
  icon_name text default '',
  featured boolean default false,
  created_at timestamptz default now()
);

-- 3. projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_desc text default '',
  full_desc text default '',
  category text default '',
  tech_stack text[] default '{}',
  image_url text default '',
  demo_url text default '',
  github_url text default '',
  featured boolean default false,
  date text default '',
  stars int default 0,
  created_at timestamptz default now()
);

-- 4. experience
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  period text default '',
  location text default '',
  description text default '',
  achievements text[] default '{}',
  technologies text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 5. education
create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text default '',
  field text default '',
  year text default '',
  grade text default '',
  highlights text[] default '{}',
  created_at timestamptz default now()
);

-- 6. testimonials
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  role text default '',
  company text default '',
  avatar_url text default '',
  quote text default '',
  rating int check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- 7. contact_messages
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  sender_email text not null,
  subject text default '',
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- 8. settings
create table if not exists settings (
  id bigint primary key default 1,
  wallpaper text default 'sleek-blue',
  accent_color text default '#3b82f6',
  os_mode text default 'auto',
  sound_enabled boolean default true,
  dark_mode boolean default true,
  visitor_count int default 0,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- Enable Row Level Security
alter table personal_info enable row level security;
alter table skills enable row level security;
alter table projects enable row level security;
alter table experience enable row level security;
alter table education enable row level security;
alter table testimonials enable row level security;
alter table contact_messages enable row level security;
alter table settings enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public can read personal_info" on personal_info;
drop policy if exists "Public can read skills" on skills;
drop policy if exists "Public can read projects" on projects;
drop policy if exists "Public can read experience" on experience;
drop policy if exists "Public can read education" on education;
drop policy if exists "Public can read testimonials" on testimonials;
drop policy if exists "Public can read settings" on settings;
drop policy if exists "Anyone can insert contact_messages" on contact_messages;

-- Public read policies
create policy "Public can read personal_info" on personal_info for select using (true);
create policy "Public can read skills" on skills for select using (true);
create policy "Public can read projects" on projects for select using (true);
create policy "Public can read experience" on experience for select using (true);
create policy "Public can read education" on education for select using (true);
create policy "Public can read testimonials" on testimonials for select using (true);
create policy "Public can read settings" on settings for select using (true);

-- Anyone can submit contact messages
create policy "Anyone can insert contact_messages" on contact_messages for insert with check (true);

-- Authenticated user (admin) full access policies
drop policy if exists "Auth full access personal_info" on personal_info;
drop policy if exists "Auth full access skills" on skills;
drop policy if exists "Auth full access projects" on projects;
drop policy if exists "Auth full access experience" on experience;
drop policy if exists "Auth full access education" on education;
drop policy if exists "Auth full access testimonials" on testimonials;
drop policy if exists "Auth full access contact_messages" on contact_messages;
drop policy if exists "Auth full access settings" on settings;

create policy "Auth full access personal_info" on personal_info for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth full access skills" on skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth full access projects" on projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth full access experience" on experience for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth full access education" on education for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth full access testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth full access contact_messages" on contact_messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth full access settings" on settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
