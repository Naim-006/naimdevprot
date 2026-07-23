-- =============================================================
-- COMPLETE PORTFOLIO DATABASE SCHEMA
-- Run this entire file in your Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/vlmqlcqecamgxaelrlbp/sql/new
-- =============================================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. PERSONAL INFO (single row)
create table if not exists public.personal_info (
  id bigint primary key default 1,
  name text not null default 'Developer',
  title text not null default '',
  tagline text not null default '',
  bio text not null default '',
  detailed_bio text not null default '',
  avatar_url text not null default 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  location text not null default '',
  email text not null default '',
  phone text not null default '',
  availability text not null default '',
  resume_url text not null default '#',
  socials jsonb not null default '{"github":"#","linkedin":"#","twitter":"#","devto":"#","website":"#"}',
  metrics jsonb not null default '{"yearsExp":0,"projectsCompleted":0,"satisfiedClients":0,"codeQualityRating":"0%"}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint personal_info_single_row check (id = 1)
);

-- 2. SKILLS
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Frontend','Mobile','Backend & Database','Cloud & DevOps','Tools & Methods')),
  proficiency integer not null default 50 check (proficiency >= 0 and proficiency <= 100),
  icon_name text not null default 'Code',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. PROJECTS
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_desc text not null default '',
  full_desc text not null default '',
  category text not null default 'Full-Stack' check (category in ('Full-Stack','Mobile App','Frontend','Cloud & Systems','Open Source')),
  tech_stack text[] not null default '{}',
  image_url text not null default 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  demo_url text not null default '#',
  github_url text not null default '#',
  featured boolean not null default false,
  date text not null default '',
  stars integer not null default 0,
  created_at timestamptz not null default now()
);

-- 4. EXPERIENCE
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  period text not null default '',
  location text not null default '',
  description text not null default '',
  achievements text[] not null default '{}',
  technologies text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 5. EDUCATION
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null default '',
  field text not null default '',
  year text not null default '',
  grade text not null default '',
  highlights text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 6. TESTIMONIALS
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  role text not null default '',
  company text not null default '',
  avatar_url text not null default 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  quote text not null default '',
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now()
);

-- 7. CONTACT MESSAGES (inbox)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  sender_email text not null,
  subject text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 8. BLOG POSTS (managed from admin panel)
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  tag text not null default 'General',
  excerpt text not null default '',
  content text not null default '',
  read_time text not null default '5 min read',
  date text not null default '',
  cover_image text not null default 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- 9. SETTINGS (single row)
create table if not exists public.settings (
  id bigint primary key default 1,
  wallpaper text not null default 'win10-hero',
  lock_wallpaper text not null default 'ios-fluid',
  accent_color text not null default '#3b82f6',
  os_mode text not null default 'auto' check (os_mode in ('desktop','mobile','auto')),
  sound_enabled boolean not null default true,
  dark_mode boolean not null default true,
  admin_username text not null default 'admin',
  admin_password_hash text not null default 'admin123',
  visitor_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint settings_single_row check (id = 1)
);

-- =============================================================
-- INDEXES for performance
-- =============================================================
create index if not exists idx_skills_category on public.skills(category);
create index if not exists idx_skills_featured on public.skills(featured);
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_featured on public.projects(featured);
create index if not exists idx_experience_sort on public.experience(sort_order);
create index if not exists idx_contact_messages_read on public.contact_messages(read);
create index if not exists idx_blog_posts_published on public.blog_posts(published);
create index if not exists idx_blog_posts_tag on public.blog_posts(tag);

-- =============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- =============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_personal_info_updated_at on public.personal_info;
create trigger set_personal_info_updated_at
  before update on public.personal_info for each row execute function public.set_updated_at();
drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at
  before update on public.settings for each row execute function public.set_updated_at();

-- =============================================================
-- STORAGE BUCKET POLICIES (for image uploads)
-- =============================================================
-- Create the images bucket if it doesn't exist
insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;

-- Public read access on storage
drop policy if exists "Public Read" on storage.objects;
create policy "Public Read" on storage.objects for select using (bucket_id = 'images');

-- Authenticated users can upload/update/delete
drop policy if exists "Auth Upload" on storage.objects;
create policy "Auth Upload" on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');
drop policy if exists "Auth Update" on storage.objects;
create policy "Auth Update" on storage.objects for update using (bucket_id = 'images' and auth.role() = 'authenticated');
drop policy if exists "Auth Delete" on storage.objects;
create policy "Auth Delete" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');

-- =============================================================
-- ROW LEVEL SECURITY (database tables)
-- =============================================================
-- Enable RLS on all tables
alter table if exists public.personal_info enable row level security;
alter table if exists public.skills enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.experience enable row level security;
alter table if exists public.education enable row level security;
alter table if exists public.testimonials enable row level security;
alter table if exists public.contact_messages enable row level security;
alter table if exists public.blog_posts enable row level security;
alter table if exists public.settings enable row level security;

-- Drop all existing policies first for clean re-run
do $$
declare
  rec record;
begin
  for rec in select policyname, tablename from pg_policies where schemaname = 'public' loop
    execute format('drop policy if exists %I on %I.%I', rec.policyname, 'public', rec.tablename);
  end loop;
end $$;

-- PUBLIC READ — anyone can read these tables
create policy "public_read_personal_info" on public.personal_info for select using (true);
create policy "public_read_skills" on public.skills for select using (true);
create policy "public_read_projects" on public.projects for select using (true);
create policy "public_read_experience" on public.experience for select using (true);
create policy "public_read_education" on public.education for select using (true);
create policy "public_read_testimonials" on public.testimonials for select using (true);
create policy "public_read_blog_posts" on public.blog_posts for select using (true);
create policy "public_read_settings" on public.settings for select using (true);

-- ANYONE CAN INSERT — contact messages (no auth needed)
create policy "public_insert_contact_messages" on public.contact_messages for insert with check (true);

-- AUTHENTICATED FULL ACCESS — admin can do everything
create policy "auth_all_personal_info" on public.personal_info for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all_skills" on public.skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all_projects" on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all_experience" on public.experience for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all_education" on public.education for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all_testimonials" on public.testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all_contact_messages" on public.contact_messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all_blog_posts" on public.blog_posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all_settings" on public.settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =============================================================
-- SEED DATA — default portfolio content
-- =============================================================

-- Personal Info
insert into public.personal_info (id, name, title, tagline, bio, detailed_bio, location, email, phone, availability, resume_url, socials, metrics)
values (1, 'Naim Hossain', 'Senior Full-Stack & Mobile Software Architect',
  'Designing high-performance web, mobile & cloud systems with OS-grade UI precision.',
  'Building smooth digital products across web, mobile, and desktop. Specialist in React, Next.js, Node.js, React Native, and Cloud Systems.',
  E'Hello! I''m Naim Hossain, a Software Developer & Architect based in San Francisco. With over 7 years of professional experience, I bridge the gap between high-performance backends and delightful frontend user interfaces.\n\nMy philosophy centers around crafting applications that feel native, responsive, and tactile.',
  'San Francisco, CA (Open to Remote)', 'alex@rivera.dev', '+1 (555) 382-9014',
  'Available for Select Freelance & Full-time Roles', '#',
  '{"github":"#","linkedin":"#","twitter":"#","devto":"#","website":"#"}',
  '{"yearsExp":7,"projectsCompleted":48,"satisfiedClients":32,"codeQualityRating":"99.8%"}')
on conflict (id) do nothing;

-- Skills
insert into public.skills (name, category, proficiency, icon_name, featured, sort_order) values
  ('React / React 19', 'Frontend', 98, 'Code', true, 1),
  ('TypeScript', 'Frontend', 95, 'FileCode', true, 2),
  ('Next.js 15', 'Frontend', 92, 'Globe', true, 3),
  ('Tailwind CSS v4', 'Frontend', 96, 'Palette', true, 4),
  ('Motion / Animation', 'Frontend', 90, 'Sparkles', true, 5),
  ('React Native / Expo', 'Mobile', 92, 'Smartphone', true, 6),
  ('Swift / iOS SDK', 'Mobile', 82, 'Smartphone', false, 7),
  ('Mobile UI / Gestures', 'Mobile', 90, 'Sliders', true, 8),
  ('Node.js & Express', 'Backend & Database', 94, 'Server', true, 9),
  ('PostgreSQL & Drizzle', 'Backend & Database', 88, 'Database', true, 10),
  ('GraphQL & REST APIs', 'Backend & Database', 91, 'Cpu', false, 11),
  ('Firebase & Firestore', 'Backend & Database', 93, 'Flame', true, 12),
  ('Docker & Containers', 'Cloud & DevOps', 86, 'Box', true, 13),
  ('AWS & Cloud Run', 'Cloud & DevOps', 85, 'Cloud', false, 14),
  ('CI/CD Pipelines', 'Cloud & DevOps', 88, 'RefreshCw', false, 15),
  ('Git & GitHub Actions', 'Tools & Methods', 95, 'GitBranch', false, 16),
  ('Figma to Code', 'Tools & Methods', 92, 'Figma', true, 17),
  ('Jest / Playwright Testing', 'Tools & Methods', 86, 'CheckCircle', false, 18);

-- Projects
insert into public.projects (title, short_desc, full_desc, category, tech_stack, image_url, featured, date, stars) values
  ('Cloud Workspace OS', 'Web-based virtual desktop environment with multi-window orchestration, file manager, and cloud apps.',
   E'An ambitious browser-based operating system UI that emulates native desktop experience. Built with React, TypeScript, and Motion, it features draggable windows, taskbar system tray, file browser, terminal emulator, and custom cloud widgets.',
   'Full-Stack', '{React 19,TypeScript,Tailwind CSS,Motion,Express}',
   'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', true, '2026-03', 342),
  ('PulseFit - iOS Health & Analytics', 'Cross-platform mobile workout tracker featuring real-time telemetry, GPS routing, and sleep trends.',
   E'PulseFit empowers fitness enthusiasts to monitor physical metrics in real time. Designed with iOS Human Interface Guidelines in mind, featuring haptic feedback, dark mode optics, offline persistence, and interactive chart visualizations.',
   'Mobile App', '{React Native,Expo,Recharts,TypeScript,Node.js}',
   'https://images.unsplash.com/photo-1510519138161-58446232811f?auto=format&fit=crop&w=800&q=80', true, '2025-11', 218),
  ('Nexus Microservice Gateway', 'High-throughput API gateway with automated rate limiting, JWT validation, and GraphQL federation.',
   E'Nexus Gateway sits in front of distributed services to handle security, request caching, rate throttling, and telemetry. Tested under heavy synthetic load handling 25,000 requests/sec with minimal latency overhead.',
   'Cloud & Systems', '{Node.js,Express,Redis,Docker,PostgreSQL}',
   'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', true, '2025-08', 512),
  ('DevCanvas Realtime Whiteboard', 'Interactive vector canvas with live multi-user collaboration, shape tools, and code snippet cards.',
   E'A fast visual space built for remote engineering teams. Supports realtime websocket cursors, canvas zooming/panning, diagram export, and AI diagram generation.',
   'Frontend', '{React,HTML5 Canvas,WebSockets,Tailwind CSS}',
   'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', false, '2025-04', 189),
  ('CyberCLI Tooling Suite', 'Command line developer toolkit for rapid scaffolding, database migrations, and bundle diagnostics.',
   E'Custom Node.js binary CLI tool used by over 10,000 developers. Features interactive prompt menus, color logs, fast template generation, and automated GitHub release checks.',
   'Open Source', '{TypeScript,Node.js,Commander.js,Esbuild}',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80', true, '2024-12', 840);

-- Experience
insert into public.experience (company, role, period, location, description, achievements, technologies, sort_order) values
  ('Apex Tech Systems', 'Lead Full-Stack Engineer', '2023 - Present', 'San Francisco, CA',
   'Spearheaded frontend and backend architecture for cloud SaaS applications serving over 500k monthly active users.',
   ARRAY['Engineered an OS-styled web workspace that boosted user daily engagement by 34%.','Reduced server API latency by 45% using Node.js Redis caching and optimized PostgreSQL queries.','Mentored a team of 8 engineers and introduced automated end-to-end CI/CD testing.'],
   ARRAY['React','TypeScript','Node.js','AWS','Docker','PostgreSQL'], 1),
  ('Vanguard Mobile Labs', 'Senior Mobile & React Engineer', '2021 - 2023', 'San Jose, CA',
   'Architected iOS and Android cross-platform mobile apps for high-growth tech startups.',
   ARRAY['Published 4 top-rated iOS/Android apps with average App Store rating of 4.8 stars.','Implemented smooth 60fps animations and offline sync using React Native and SQLite.','Collaborated closely with product designers to implement pixel-perfect Figma components.'],
   ARRAY['React Native','Expo','TypeScript','Redux','Firebase','Swift'], 2),
  ('PixelCraft Creative Agency', 'Frontend Web Developer', '2019 - 2021', 'Remote',
   'Developed highly interactive client web applications, e-commerce portals, and interactive portfolios.',
   ARRAY['Delivered 25+ bespoke websites for enterprise and SMB clients on tight timelines.','Achieved 98+ Lighthouse performance scores across all client sites.'],
    ARRAY['React','JavaScript','Tailwind CSS','REST APIs','Figma'], 3);

-- Education
insert into public.education (institution, degree, field, year, grade, highlights) values
  ('University of California, Berkeley', 'Bachelor of Science (B.S.)', 'Computer Science & Software Systems', '2015 - 2019', '3.85 GPA',
    ARRAY['Dean''s Honor List for 6 consecutive semesters.','President of the Computer Science & Web Engineering Club.','Published undergrad research paper on Distributed Systems optimization.']);

-- Testimonials
insert into public.testimonials (client_name, role, company, avatar_url, quote, rating) values
  ('Sarah Jenkins', 'VP of Product', 'Apex Tech Systems',
   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
   'Alex is an exceptional engineer. His ability to deliver complex OS-grade user experiences with speed and precision is unmatched. Highly recommended!', 5),
  ('Marcus Vance', 'Founder & CEO', 'PulseFit Labs',
   'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
   'Working with Alex on our iOS app launch was seamless. He translated our design specs into smooth, responsive React Native code faster than expected.', 5),
  ('Elena Rostova', 'Engineering Director', 'Vanguard Labs',
   'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
   'Alex brings craftsmanship and deep technical rigor. He is the developer every team dreams of having.', 5);

-- Blog Posts
insert into public.blog_posts (title, slug, tag, excerpt, content, read_time, date, cover_image, published) values
  ('Building OS-Grade Desktop UIs in React 19',
   'building-os-grade-desktop-uis', 'Architecture',
   'How to handle z-index layers, drag handles, window snapping, and virtual taskbars in modern web apps.',
   E'Creating desktop-like user experiences in web browsers requires careful state management and fluid motion mechanics.\n\n### Key Considerations:\n1. **Z-Index Layer Management**: Window focus order must dynamically update whenever a user clicks or drags a window.\n2. **Performance Constraints**: Using hardware-accelerated transforms (CSS translate) instead of top/left positioning for 60fps window movement.\n3. **Responsive Degradation**: Gracefully adapting desktop layouts into mobile tabbed/sheet experiences.',
   '5 min read', 'July 15, 2026',
   'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', true),
  ('React Native vs Native Swift in 2026',
   'react-native-vs-swift-2026', 'Mobile Development',
   'An in-depth benchmark comparison of cross-platform React Native performance against iOS Swift.',
   E'With the arrival of React Native''s New Architecture (Fabric & TurboModules), cross-platform mobile apps are closer to pure native performance than ever.\n\nIn this benchmark study, we test gesture responsiveness, cold boot time, and memory footprint across complex dashboard applications.',
   '8 min read', 'June 28, 2026',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80', true);

-- Settings
insert into public.settings (id, wallpaper, lock_wallpaper, accent_color, os_mode, sound_enabled, dark_mode, admin_username, admin_password_hash)
values (1, 'premium-4k', 'ios-fluid', '#3b82f6', 'auto', true, true, 'admin', 'admin123')
on conflict (id) do nothing;
