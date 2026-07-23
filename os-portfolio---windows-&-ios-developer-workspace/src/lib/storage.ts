import { supabase } from './supabase';

const BUCKET = 'images';

export type UploadResult = { url: string; path: string } | null;

export async function uploadImage(
  file: File,
  folder: 'avatars' | 'projects' | 'blogs' | 'covers' | 'testimonials'
): Promise<UploadResult> {
  const ext = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) return null;

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return { url: publicUrl.publicUrl, path: filePath };
}

export async function deleteImage(path: string): Promise<boolean> {
  if (!path || path.startsWith('http')) return true; // External URLs can't be deleted

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) return false;
  return true;
}

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
