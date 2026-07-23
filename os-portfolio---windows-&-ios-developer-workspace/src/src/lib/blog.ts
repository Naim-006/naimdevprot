import { BlogPost } from '../types';

const DEVTO_USERNAME = 'naim_hossain_43eadf058df2';
const CACHE_KEY = 'os_portfolio_devto_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface DevToArticle {
  title: string;
  slug: string;
  tags: string;
  description: string;
  body_markdown: string;
  readable_publish_date: string;
  cover_image: string | null;
  reading_time_minutes: number;
  url: string;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) return data;
  }

  try {
    const res = await fetch(`https://dev.to/api/articles?username=${DEVTO_USERNAME}&per_page=20`);
    if (!res.ok) throw new Error('Failed to fetch');
    const articles: DevToArticle[] = await res.json();

    const posts: BlogPost[] = articles.map((a, i) => ({
      id: `devto-${i}`,
      title: a.title,
      slug: a.slug,
      tag: a.tags?.split(',')[0] || 'General',
      excerpt: a.description || a.body_markdown?.slice(0, 150) || '',
      content: a.body_markdown || '',
      readTime: `${a.reading_time_minutes} min read`,
      date: a.readable_publish_date || '',
      coverImage: a.cover_image || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      published: true,
    }));

    // Cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: posts, timestamp: Date.now() }));
    return posts;
  } catch {
    // Return cached even if expired, or empty
    if (cached) return JSON.parse(cached).data;
    return [];
  }
}
