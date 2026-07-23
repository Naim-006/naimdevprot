-- ============================================================
-- OS Portfolio — Fix Schema Permissions
-- Run this in Supabase SQL Editor to fix:
--   "permission denied for schema public" (code 42501)
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
