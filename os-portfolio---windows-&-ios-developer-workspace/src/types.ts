export type AppId = 
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'testimonials'
  | 'contact'
  | 'blog'
  | 'terminal'
  | 'settings'
  | 'admin'
  | 'gamehub';

export type OSMode = 'desktop' | 'mobile' | 'auto';

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  detailedBio: string;
  avatarUrl: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  resumeUrl: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    devto: string;
    website: string;
  };
  metrics: {
    yearsExp: number;
    projectsCompleted: number;
    satisfiedClients: number;
    codeQualityRating: string;
  };
}

export type SkillCategory = 'Frontend' | 'Mobile' | 'Backend & Database' | 'Cloud & DevOps' | 'Tools & Methods';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  iconName?: string;
  featured?: boolean;
}

export type ProjectCategory = 'Full-Stack' | 'Mobile App' | 'Frontend' | 'Cloud & Systems' | 'Open Source';

export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: ProjectCategory;
  techStack: string[];
  imageUrl: string;
  media: ProjectMedia[];
  links: ProjectLink[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  date: string;
  stars?: number;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
  grade?: string;
  highlights: string[];
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatarUrl: string;
  quote: string;
  rating: number;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  whatsapp: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
  coverImage: string;
  published: boolean;
}

export interface OSSettings {
  wallpaper: string;
  lockWallpaper: string;
  accentColor: string;
  osMode: OSMode;
  soundEnabled: boolean;
  darkMode: boolean;
  visitorCount: number;
}

export interface WindowState {
  id: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface AppDefinition {
  id: AppId;
  title: string;
  iconName: string;
  category: 'core' | 'portfolio' | 'system';
  badge?: string;
  color: string;
  bgGradient: string;
}
