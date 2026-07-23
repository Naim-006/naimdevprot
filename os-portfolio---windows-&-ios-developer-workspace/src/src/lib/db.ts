import { supabase } from './supabase';
import type { PersonalInfo, SkillItem, ProjectItem, ExperienceItem, EducationItem, TestimonialItem, ContactMessage, BlogPost, OSSettings } from '../types';

function table<T extends { id: string | number }>(name: string) {
  return {
    async getAll(): Promise<T[]> {
      const { data, error } = await supabase.from(name).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data as unknown as T[]) || [];
    },
    async getById(id: string): Promise<T | null> {
      const { data, error } = await supabase.from(name).select('*').eq('id', id).single();
      if (error) throw error;
      return data as unknown as T;
    },
    async insert(item: Record<string, unknown>): Promise<T> {
      const { data, error } = await supabase.from(name).insert(item).select().single();
      if (error) throw error;
      return data as unknown as T;
    },
    async update(id: string | number, updates: Record<string, unknown>): Promise<T> {
      const { data, error } = await supabase.from(name).update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as unknown as T;
    },
    async remove(id: string | number): Promise<void> {
      const { error } = await supabase.from(name).delete().eq('id', id);
      if (error) throw error;
    }
  };
}

export type Tables = {
  personal_info: PersonalInfo & { id: number };
  skills: SkillItem;
  projects: ProjectItem;
  experience: ExperienceItem;
  education: EducationItem;
  testimonials: TestimonialItem;
  contact_messages: ContactMessage;
  blog_posts: BlogPost;
  settings: OSSettings & { id: number };
};

export const db = {
  personalInfo: table<Tables['personal_info']>('personal_info'),
  skills: table<Tables['skills']>('skills'),
  projects: table<Tables['projects']>('projects'),
  experience: table<Tables['experience']>('experience'),
  education: table<Tables['education']>('education'),
  testimonials: table<Tables['testimonials']>('testimonials'),
  contactMessages: table<Tables['contact_messages']>('contact_messages'),
  blogPosts: table<Tables['blog_posts']>('blog_posts'),
  settings: table<Tables['settings']>('settings'),
};
