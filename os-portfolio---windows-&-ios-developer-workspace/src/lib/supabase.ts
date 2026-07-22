/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vlmqlcqecamgxaelrlbp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbXFsY3FlY2FtZ3hhZWxybGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjgxNDksImV4cCI6MjEwMDMwNDE0OX0.uwftK3iiDAAmEb8RdHYc7b41kuPUPfyZx6_-_o1jPuE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
