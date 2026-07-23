import { supabase } from './supabase';
import type { PersonalInfo, SkillItem, ProjectItem, ExperienceItem, EducationItem, TestimonialItem, ContactMessage, BlogPost, OSSettings } from '../types';

export class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    const detail = cause && typeof cause === 'object' ? `: ${JSON.stringify(cause)}` : '';
    super(`${message}${detail}`);
    this.name = 'DatabaseError';
  }
}

function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function transformKeys(obj: Record<string, unknown>, convert: (k: string) => string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    result[convert(key)] = obj[key];
  }
  return result;
}

function table<T extends { id: string | number }>(name: string) {
  return {
    async getAll(): Promise<T[]> {
      const { data, error } = await supabase.from(name).select('*').order('created_at', { ascending: false });
      if (error) throw new DatabaseError(`Failed to fetch ${name}`, error);
      return ((data as Record<string, unknown>[]) || []).map((row) => transformKeys(row, snakeToCamel)) as unknown as T[];
    },
    async getById(id: string): Promise<T | null> {
      const { data, error } = await supabase.from(name).select('*').eq('id', id).single();
      if (error) throw new DatabaseError(`Failed to fetch ${name} by id`, error);
      return transformKeys(data as Record<string, unknown>, snakeToCamel) as unknown as T;
    },
    async insert(item: Record<string, unknown>): Promise<T> {
      const snakeItem = transformKeys(item, camelToSnake);
      const { data, error } = await supabase.from(name).insert(snakeItem).select().single();
      if (error) throw new DatabaseError(`Failed to insert into ${name}`, error);
      return transformKeys(data as Record<string, unknown>, snakeToCamel) as unknown as T;
    },
    async update(id: string | number, updates: Record<string, unknown>): Promise<T> {
      const snakeUpdates = transformKeys(updates, camelToSnake);
      const { data, error } = await supabase.from(name).update(snakeUpdates).eq('id', id).select().single();
      if (error) throw new DatabaseError(`Failed to update ${name}`, error);
      return transformKeys(data as Record<string, unknown>, snakeToCamel) as unknown as T;
    },
    async remove(id: string | number): Promise<void> {
      const { error } = await supabase.from(name).delete().eq('id', id);
      if (error) throw new DatabaseError(`Failed to delete from ${name}`, error);
    },
    async clear(): Promise<void> {
      const { data: items } = await supabase.from(name).select('id');
      if (!items || items.length === 0) return;
      const ids = items.map((i: { id: string | number }) => i.id);
      const { error } = await supabase.from(name).delete().in('id', ids);
      if (error) throw new DatabaseError(`Failed to clear ${name}`, error);
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
