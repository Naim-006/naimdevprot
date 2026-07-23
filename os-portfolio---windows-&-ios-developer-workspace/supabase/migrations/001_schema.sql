-- ============================================================
-- OS Portfolio — Database Schema
-- PostgreSQL + Supabase with Row Level Security
-- Admin write, public read
--
-- Column names use snake_case (PostgreSQL convention).
-- The frontend db.ts layer transforms to/from camelCase.
-- ============================================================

-- 1. ENUM TYPES
-- ============================================================

CREATE TYPE skill_category AS ENUM (
  'Frontend',
  'Mobile',
  'Backend & Database',
  'Cloud & DevOps',
  'Tools & Methods'
);

CREATE TYPE project_category AS ENUM (
  'Full-Stack',
  'Mobile App',
  'Frontend',
  'Cloud & Systems',
  'Open Source'
);

CREATE TYPE os_mode AS ENUM (
  'desktop',
  'mobile',
  'auto'
);

-- 2. TABLES
-- ============================================================

-- 2a. Personal Info (single-row table)
CREATE TABLE IF NOT EXISTS personal_info (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL DEFAULT '',
  title           TEXT NOT NULL DEFAULT '',
  tagline         TEXT NOT NULL DEFAULT '',
  bio             TEXT NOT NULL DEFAULT '',
  detailed_bio    TEXT NOT NULL DEFAULT '',
  avatar_url      TEXT NOT NULL DEFAULT '',
  location        TEXT NOT NULL DEFAULT '',
  email           TEXT NOT NULL DEFAULT '',
  phone           TEXT NOT NULL DEFAULT '',
  availability    TEXT NOT NULL DEFAULT '',
  resume_url      TEXT NOT NULL DEFAULT '',
  socials         JSONB NOT NULL DEFAULT '{}',
  metrics         JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2b. Skills
CREATE TABLE IF NOT EXISTS skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  category    skill_category NOT NULL,
  proficiency SMALLINT NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  icon_name   TEXT,
  featured    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2c. Projects
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  short_desc  TEXT NOT NULL DEFAULT '',
  full_desc   TEXT NOT NULL DEFAULT '',
  category    project_category NOT NULL,
  tech_stack  TEXT[] NOT NULL DEFAULT '{}',
  image_url   TEXT NOT NULL DEFAULT '',
  media       JSONB NOT NULL DEFAULT '[]',
  links       JSONB NOT NULL DEFAULT '[]',
  demo_url    TEXT,
  github_url  TEXT,
  featured    BOOLEAN NOT NULL DEFAULT false,
  date        TEXT NOT NULL DEFAULT '',
  stars       INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2d. Experience
CREATE TABLE IF NOT EXISTS experience (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company       TEXT NOT NULL,
  role          TEXT NOT NULL,
  period        TEXT NOT NULL DEFAULT '',
  location      TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  achievements  TEXT[] NOT NULL DEFAULT '{}',
  technologies  TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2e. Education
CREATE TABLE IF NOT EXISTS education (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree      TEXT NOT NULL DEFAULT '',
  field       TEXT NOT NULL DEFAULT '',
  year        TEXT NOT NULL DEFAULT '',
  grade       TEXT,
  highlights  TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2f. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',
  company     TEXT NOT NULL DEFAULT '',
  avatar_url  TEXT NOT NULL DEFAULT '',
  quote       TEXT NOT NULL DEFAULT '',
  rating      SMALLINT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2g. Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name  TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  whatsapp     TEXT NOT NULL DEFAULT '',
  subject      TEXT NOT NULL DEFAULT '',
  message      TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  read         BOOLEAN NOT NULL DEFAULT false
);

-- 2h. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  tag         TEXT NOT NULL DEFAULT 'General',
  excerpt     TEXT NOT NULL DEFAULT '',
  content     TEXT NOT NULL DEFAULT '',
  read_time   TEXT NOT NULL DEFAULT '5 min read',
  date        TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  published   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2i. Settings (single-row — no admin credentials stored here)
CREATE TABLE IF NOT EXISTS settings (
  id              SERIAL PRIMARY KEY,
  wallpaper       TEXT NOT NULL DEFAULT 'win10-hero',
  lock_wallpaper  TEXT NOT NULL DEFAULT 'ios-fluid',
  accent_color    TEXT NOT NULL DEFAULT '#3b82f6',
  os_mode         os_mode NOT NULL DEFAULT 'auto',
  sound_enabled   BOOLEAN NOT NULL DEFAULT true,
  dark_mode       BOOLEAN NOT NULL DEFAULT true,
  visitor_count   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. AUTO-UPDATE updated_at TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['personal_info','skills','projects','experience','education','testimonials','blog_posts','settings']
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      t
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. ROW LEVEL SECURITY
-- ============================================================

-- 4a. Enable RLS on all tables
ALTER TABLE personal_info     ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills            ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience        ENABLE ROW LEVEL SECURITY;
ALTER TABLE education         ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings          ENABLE ROW LEVEL SECURITY;

-- 4b. Public read policies — anyone can SELECT
CREATE POLICY "Public read access" ON personal_info     FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills            FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects          FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experience        FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education         FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials      FOR SELECT USING (true);
CREATE POLICY "Public read access" ON blog_posts        FOR SELECT USING (true);
CREATE POLICY "Public read access" ON settings          FOR SELECT USING (true);

-- 4c. Admin write policies — only authenticated users can INSERT/UPDATE/DELETE
CREATE POLICY "Admin insert" ON personal_info     FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin insert" ON skills            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin insert" ON projects          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin insert" ON experience        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin insert" ON education         FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin insert" ON testimonials      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin insert" ON blog_posts        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin insert" ON settings          FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update" ON personal_info     FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON skills            FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON projects          FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON experience        FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON education         FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON testimonials      FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON blog_posts        FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON settings          FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete" ON personal_info     FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON skills            FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON projects          FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON experience        FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON education         FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON testimonials      FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON blog_posts        FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON settings          FOR DELETE USING (auth.role() = 'authenticated');

-- Special policy: visitors CAN insert contact messages (contact form)
DROP POLICY IF EXISTS "Admin insert" ON contact_messages;
CREATE POLICY "Anyone can send messages" ON contact_messages
  FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'anon'));

-- For contact_messages read: admin only
DROP POLICY IF EXISTS "Public read access" ON contact_messages;
CREATE POLICY "Admin read messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- For contact_messages update: admin only (mark as read)
CREATE POLICY "Admin update messages" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete messages" ON contact_messages
  FOR DELETE USING (auth.role() = 'authenticated');

-- 5. SCHEMA & TABLE PERMISSIONS
--    Required for the anon and authenticated roles to work with RLS.
--    Without these, Supabase blocks all operations with "permission denied for schema public".
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 6. STORAGE BUCKET RLS (run after creating 'images' bucket)
--    ============================================================
--
-- CREATE POLICY "Public read images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'images');
--
-- CREATE POLICY "Admin upload images" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
--
-- CREATE POLICY "Admin update images" ON storage.objects
--   FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
--
-- CREATE POLICY "Admin delete images" ON storage.objects
--   FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
