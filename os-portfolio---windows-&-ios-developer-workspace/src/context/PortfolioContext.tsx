import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppId,
  OSMode,
  PersonalInfo,
  SkillItem,
  ProjectItem,
  ExperienceItem,
  EducationItem,
  TestimonialItem,
  ContactMessage,
  BlogPost,
  OSSettings,
  WindowState
} from '../types';
import { LANG_META, TRANSLATIONS, LangCode } from '../i18n/translations';
import {
  DEFAULT_PERSONAL_INFO,
  DEFAULT_SKILLS,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCE,
  DEFAULT_EDUCATION,
  DEFAULT_TESTIMONIALS,
  DEFAULT_MESSAGES,
  DEFAULT_BLOGS,
  DEFAULT_SETTINGS,
  SYSTEM_APPS
} from '../data/defaultData';
import { soundEngine } from '../utils/sound';
import { supabase } from '../lib/supabase';
import { loginWithEmail, logout as supabaseLogout } from '../lib/auth';
import { db } from '../lib/db';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

interface PortfolioContextType {
  // Data State
  personalInfo: PersonalInfo;
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  testimonials: TestimonialItem[];
  messages: ContactMessage[];
  blogs: BlogPost[];
  settings: OSSettings;
  notifications: ToastNotification[];

  // Windows State
  windows: Record<AppId, WindowState>;
  activeWindowId: AppId | null;

  // OS Display State
  activeOSMode: 'desktop' | 'mobile'; // effective mode
  userOSPreference: OSMode;
  isStartMenuOpen: boolean;
  isControlCenterOpen: boolean;
  isCalendarOpen: boolean;
  isSpotlightOpen: boolean;
  isTourOpen: boolean;

  // Quick Settings State
  brightness: number; // 20 - 100
  volume: number; // 0 - 100
  wifiConnected: boolean;
  nightLight: boolean;

  // Device State
  batteryLevel: number;
  batteryCharging: boolean;

  // Language
  currentLanguage: LangCode;
  setLanguage: (lang: LangCode) => void;
  t: (key: string) => string;
  langDir: 'ltr' | 'rtl';

  // Auth State
  isAdminAuthenticated: boolean;

  // Lock Screen
  isLocked: boolean;
  unlockScreen: () => void;
  lockScreen: () => void;

  // Window Controls
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updateWindowPos: (id: AppId, pos: { x: number; y: number }) => void;
  updateWindowSize: (id: AppId, size: { width: number; height: number }) => void;

  // Shell Toggles
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  toggleControlCenter: () => void;
  toggleCalendar: () => void;
  toggleSpotlight: () => void;
  openTour: () => void;
  closeTour: () => void;
  setBrightness: (val: number) => void;
  setVolume: (val: number) => void;
  toggleWifi: () => void;
  toggleNightLight: () => void;
  setOSMode: (mode: OSMode) => void;
  dismissNotification: (id: string) => void;
  showToast: (title: string, message: string) => void;

  // Auth Functions
  loginAdmin: (user: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;

  // CRUD Functions
  updatePersonalInfo: (info: PersonalInfo) => void;
  
  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<SkillItem>) => void;
  deleteSkill: (id: string) => void;

  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  addExperience: (exp: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;

  addEducation: (edu: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;

  addTestimonial: (test: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonial: (id: string, test: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;

  sendMessage: (msg: { senderName: string; senderEmail: string; subject: string; message: string }) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  addBlog: (blog: Omit<BlogPost, 'id'>) => void;
  updateBlog: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;

  updateSettings: (newSettings: Partial<OSSettings>) => void;
  resetAllData: () => void;
  exportJSONData: () => string;
  importJSONData: (jsonStr: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PERSONAL_INFO: 'os_portfolio_personal',
  SKILLS: 'os_portfolio_skills',
  PROJECTS: 'os_portfolio_projects',
  EXPERIENCE: 'os_portfolio_exp',
  EDUCATION: 'os_portfolio_edu',
  TESTIMONIALS: 'os_portfolio_testimonials',
  MESSAGES: 'os_portfolio_messages',
  BLOGS: 'os_portfolio_blogs',
  SETTINGS: 'os_portfolio_settings',
  ADMIN_AUTH: 'os_portfolio_admin_auth'
};

const createInitialWindows = (): Record<AppId, WindowState> => {
  const initial: Partial<Record<AppId, WindowState>> = {};
  let defaultX = 80;
  let defaultY = 40;

  SYSTEM_APPS.forEach((app, index) => {
    initial[app.id] = {
      id: app.id,
      title: app.title,
      icon: app.iconName,
      isOpen: app.id === 'about', // Open About Me by default
      isMinimized: false,
      isMaximized: false,
      position: { x: defaultX + (index * 25) % 150, y: defaultY + (index * 20) % 100 },
      size: { width: 900, height: 620 },
      zIndex: app.id === 'about' ? 10 : 1
    };
  });

  return initial as Record<AppId, WindowState>;
};

let idCounter = 0;
const generateUniqueId = (): string => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${++idCounter}`;

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial data from localStorage or fallback to defaults
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PERSONAL_INFO);
    return saved ? JSON.parse(saved) : DEFAULT_PERSONAL_INFO;
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
    return saved ? JSON.parse(saved) : DEFAULT_SKILLS;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  const [experience, setExperience] = useState<ExperienceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
    return saved ? JSON.parse(saved) : DEFAULT_EXPERIENCE;
  });

  const [education, setEducation] = useState<EducationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EDUCATION);
    return saved ? JSON.parse(saved) : DEFAULT_EDUCATION;
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    return saved ? JSON.parse(saved) : DEFAULT_TESTIMONIALS;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOGS);
    return saved ? JSON.parse(saved) : DEFAULT_BLOGS;
  });

  const [settings, setSettingsState] = useState<OSSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  // Check Supabase session on mount for admin auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setIsAdminAuthenticated(true);
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      }
    });
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsAdminAuthenticated(true);
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } else if (event === 'SIGNED_OUT') {
        setIsAdminAuthenticated(false);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      }
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  // Lock Screen (shows on new page load)
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return sessionStorage.getItem('os_portfolio_unlocked') !== 'true';
  });

  const unlockScreen = () => {
    setIsLocked(false);
    sessionStorage.setItem('os_portfolio_unlocked', 'true');
    soundEngine.playOpenWindow(settings.soundEnabled);
  };

  const lockScreen = () => {
    setIsLocked(true);
    sessionStorage.removeItem('os_portfolio_unlocked');
  };

  // Windows Management
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(createInitialWindows);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>('about');
  const [highestZIndex, setHighestZIndex] = useState<number>(10);

  // Shell Popups State
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(() => {
    return localStorage.getItem('os_portfolio_has_seen_tour') !== 'true';
  });

  // Quick Hardware / Control Center Settings
  const [brightness, setBrightnessState] = useState<number>(100);
  const [volume, setVolumeState] = useState<number>(85);
  const [wifiConnected, setWifiConnected] = useState<boolean>(true);
  const [nightLight, setNightLight] = useState<boolean>(false);

  // Device battery (Battery Status API)
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [batteryCharging, setBatteryCharging] = useState(false);

  useEffect(() => {
    const getBattery = async () => {
      try {
        const bat = await (navigator as any).getBattery?.();
        if (!bat) return;
        const update = () => {
          setBatteryLevel(Math.round(bat.level * 100));
          setBatteryCharging(bat.charging);
        };
        update();
        bat.addEventListener('levelchange', update);
        bat.addEventListener('chargingchange', update);
      } catch { /* API not available */ }
    };
    getBattery();
  }, []);

  // Language State
  const [currentLanguage, setCurrentLanguage] = useState<LangCode>(() => {
    return (localStorage.getItem('os_portfolio_language') as LangCode) || 'EN';
  });

  const setLanguage = (lang: LangCode) => {
    setCurrentLanguage(lang);
    localStorage.setItem('os_portfolio_language', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS.EN[key] || key;
  };

  const langDir = LANG_META[currentLanguage]?.dir || 'ltr';

  // Responsive OS Mode detection
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeOSMode: 'desktop' | 'mobile' =
    settings.osMode === 'auto'
      ? screenWidth < 768
        ? 'mobile'
        : 'desktop'
      : settings.osMode;

  // Persist helpers
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERSONAL_INFO, JSON.stringify(personalInfo));
  }, [personalInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(experience));
  }, [experience]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Notifications helper
  const showToast = (title: string, message: string) => {
    soundEngine.playNotification(settings.soundEnabled);
    const newNotif: ToastNotification = {
      id: generateUniqueId(),
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
    }, 3000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Window Controls
  const focusWindow = (id: AppId) => {
    setHighestZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((winMap) => ({
        ...winMap,
        [id]: {
          ...winMap[id],
          zIndex: nextZ,
          isMinimized: false
        }
      }));
      return nextZ;
    });
    setActiveWindowId(id);
  };

  const openWindow = (id: AppId) => {
    soundEngine.playOpenWindow(settings.soundEnabled);
    setIsStartMenuOpen(false);
    setIsSpotlightOpen(false);
    setWindows((winMap) => ({
      ...winMap,
      [id]: {
        ...winMap[id],
        isOpen: true,
        isMinimized: false
      }
    }));
    focusWindow(id);
  };

  const closeWindow = (id: AppId) => {
    soundEngine.playCloseWindow(settings.soundEnabled);
    setWindows((winMap) => ({
      ...winMap,
      [id]: {
        ...winMap[id],
        isOpen: false,
        isMaximized: false
      }
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: AppId) => {
    soundEngine.playClick(settings.soundEnabled);
    setWindows((winMap) => ({
      ...winMap,
      [id]: {
        ...winMap[id],
        isMinimized: true
      }
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (id: AppId) => {
    soundEngine.playClick(settings.soundEnabled);
    setWindows((winMap) => ({
      ...winMap,
      [id]: {
        ...winMap[id],
        isMaximized: !winMap[id].isMaximized
      }
    }));
  };

  const updateWindowPos = (id: AppId, pos: { x: number; y: number }) => {
    setWindows((winMap) => ({
      ...winMap,
      [id]: {
        ...winMap[id],
        position: pos
      }
    }));
  };

  const updateWindowSize = (id: AppId, size: { width: number; height: number }) => {
    setWindows((winMap) => ({
      ...winMap,
      [id]: {
        ...winMap[id],
        size
      }
    }));
  };

  // Shell Toggles
  const toggleStartMenu = () => {
    soundEngine.playClick(settings.soundEnabled);
    setIsStartMenuOpen((prev) => !prev);
    setIsControlCenterOpen(false);
    setIsCalendarOpen(false);
  };

  const closeStartMenu = () => setIsStartMenuOpen(false);

  const toggleControlCenter = () => {
    soundEngine.playClick(settings.soundEnabled);
    setIsControlCenterOpen((prev) => !prev);
    setIsStartMenuOpen(false);
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    soundEngine.playClick(settings.soundEnabled);
    setIsCalendarOpen((prev) => !prev);
    setIsStartMenuOpen(false);
    setIsControlCenterOpen(false);
  };

  const toggleSpotlight = () => {
    soundEngine.playClick(settings.soundEnabled);
    setIsSpotlightOpen((prev) => !prev);
    setIsStartMenuOpen(false);
    setIsControlCenterOpen(false);
  };

  const openTour = () => {
    setIsTourOpen(true);
    setIsStartMenuOpen(false);
  };

  const closeTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('os_portfolio_has_seen_tour', 'true');
  };

  const setBrightness = (val: number) => {
    setBrightnessState(Math.max(20, Math.min(100, val)));
  };

  const setVolume = (val: number) => {
    setVolumeState(Math.max(0, Math.min(100, val)));
  };

  const toggleWifi = () => {
    setWifiConnected((prev) => {
      const next = !prev;
      showToast('Wi-Fi Network', next ? 'Connected to Office Network' : 'Wi-Fi Disconnected');
      return next;
    });
  };

  const toggleNightLight = () => {
    setNightLight((prev) => {
      const next = !prev;
      showToast('Night Light', next ? 'Night Light ON (Warm Eye Care)' : 'Night Light OFF');
      return next;
    });
  };

  const setOSMode = (mode: OSMode) => {
    setSettingsState((prev) => ({ ...prev, osMode: mode }));
    showToast('OS Mode Changed', `Switched view mode to ${mode.toUpperCase()}`);
  };

  // Admin Auth
  const loginAdmin = async (user: string, pass: string): Promise<boolean> => {
    // Try Supabase Auth first
    try {
      const { data } = await supabase.auth.signInWithPassword({ email: user, password: pass });
      if (data.session) {
        setIsAdminAuthenticated(true);
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        showToast('Admin Logged In', 'Welcome back, Administrator.');
        return true;
      }
    } catch {
      // Fallback to localStorage
      if (user === settings.adminUsername && pass === settings.adminPasswordHash) {
        setIsAdminAuthenticated(true);
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        showToast('Admin Logged In', 'Welcome back, Administrator.');
        return true;
      }
    }
    showToast('Authentication Error', 'Invalid username or password.');
    return false;
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut().catch(() => {});
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    showToast('Admin Session', 'Logged out of admin panel.');
  };

  // CRUD Operations
  const updatePersonalInfo = (info: PersonalInfo) => {
    setPersonalInfo(info);
    showToast('Profile Updated', 'Personal information saved successfully.');
  };

  const addSkill = (skill: Omit<SkillItem, 'id'>) => {
    const newSkill: SkillItem = { ...skill, id: generateUniqueId() };
    setSkills((prev) => [newSkill, ...prev]);
    showToast('Skill Added', `Added ${newSkill.name} to portfolio.`);
  };

  const updateSkill = (id: string, updated: Partial<SkillItem>) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    showToast('Skill Updated', 'Skill information updated.');
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    showToast('Skill Removed', 'Skill removed from database.');
  };

  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newProject: ProjectItem = { ...project, id: generateUniqueId() };
    setProjects((prev) => [newProject, ...prev]);
    showToast('Project Published', `Published project ${newProject.title}.`);
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Project Updated', 'Project updated successfully.');
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project Deleted', 'Project removed.');
  };

  const addExperience = (exp: Omit<ExperienceItem, 'id'>) => {
    const newExp: ExperienceItem = { ...exp, id: generateUniqueId() };
    setExperience((prev) => [newExp, ...prev]);
    showToast('Experience Added', `Added role at ${newExp.company}.`);
  };

  const updateExperience = (id: string, updated: Partial<ExperienceItem>) => {
    setExperience((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    showToast('Experience Updated', 'Work entry updated.');
  };

  const deleteExperience = (id: string) => {
    setExperience((prev) => prev.filter((e) => e.id !== id));
    showToast('Experience Deleted', 'Work experience removed.');
  };

  const addEducation = (edu: Omit<EducationItem, 'id'>) => {
    const newEdu: EducationItem = { ...edu, id: generateUniqueId() };
    setEducation((prev) => [newEdu, ...prev]);
    showToast('Education Added', `Added ${newEdu.institution}.`);
  };

  const updateEducation = (id: string, updated: Partial<EducationItem>) => {
    setEducation((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    showToast('Education Updated', 'Education entry updated.');
  };

  const deleteEducation = (id: string) => {
    setEducation((prev) => prev.filter((e) => e.id !== id));
    showToast('Education Deleted', 'Entry removed.');
  };

  const addTestimonial = (test: Omit<TestimonialItem, 'id'>) => {
    const newTest: TestimonialItem = { ...test, id: generateUniqueId() };
    setTestimonials((prev) => [newTest, ...prev]);
    showToast('Testimonial Added', `Added review from ${newTest.clientName}.`);
  };

  const updateTestimonial = (id: string, updated: Partial<TestimonialItem>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    showToast('Testimonial Updated', 'Client review updated.');
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    showToast('Testimonial Removed', 'Review removed.');
  };

  const sendMessage = (msg: { senderName: string; senderEmail: string; subject: string; message: string }) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      read: false
    };
    setMessages((prev) => [newMsg, ...prev]);
    showToast('Message Sent!', 'Thank you! Your message has been delivered to Alex.');
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Message Deleted', 'Removed message from inbox.');
  };

  const addBlog = (blog: Omit<BlogPost, 'id'>) => {
    const newBlog: BlogPost = { ...blog, id: generateUniqueId() };
    setBlogs((prev) => [newBlog, ...prev]);
    showToast('Blog Post Added', `Created article: ${newBlog.title}`);
  };

  const updateBlog = (id: string, updated: Partial<BlogPost>) => {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    showToast('Article Updated', 'Saved changes to article.');
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    showToast('Article Deleted', 'Article deleted.');
  };

  const updateSettings = (newSettings: Partial<OSSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings Saved', 'OS configuration updated.');
  };

  const resetAllData = () => {
    localStorage.clear();
    setPersonalInfo(DEFAULT_PERSONAL_INFO);
    setSkills(DEFAULT_SKILLS);
    setProjects(DEFAULT_PROJECTS);
    setExperience(DEFAULT_EXPERIENCE);
    setEducation(DEFAULT_EDUCATION);
    setTestimonials(DEFAULT_TESTIMONIALS);
    setMessages(DEFAULT_MESSAGES);
    setBlogs(DEFAULT_BLOGS);
    setSettingsState(DEFAULT_SETTINGS);
    setIsAdminAuthenticated(false);
    showToast('Data Reset', 'Restored initial portfolio dataset.');
  };

  const exportJSONData = (): string => {
    const fullData = {
      personalInfo,
      skills,
      projects,
      experience,
      education,
      testimonials,
      blogs,
      settings: { ...settings, adminPasswordHash: '***' }
    };
    return JSON.stringify(fullData, null, 2);
  };

  const importJSONData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.personalInfo) setPersonalInfo(parsed.personalInfo);
      if (parsed.skills) setSkills(parsed.skills);
      if (parsed.projects) setProjects(parsed.projects);
      if (parsed.experience) setExperience(parsed.experience);
      if (parsed.education) setEducation(parsed.education);
      if (parsed.testimonials) setTestimonials(parsed.testimonials);
      if (parsed.blogs) setBlogs(parsed.blogs);
      showToast('Import Success', 'Portfolio database restored from JSON.');
      return true;
    } catch {
      showToast('Import Failed', 'Invalid JSON payload structure.');
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        personalInfo,
        skills,
        projects,
        experience,
        education,
        testimonials,
        messages,
        blogs,
        settings,
        notifications,
        windows,
        activeWindowId,
        activeOSMode,
        userOSPreference: settings.osMode,
        isStartMenuOpen,
        isControlCenterOpen,
        isCalendarOpen,
        isSpotlightOpen,
        isTourOpen,
        brightness,
        volume,
        wifiConnected,
        nightLight,
        batteryLevel,
        batteryCharging,
        currentLanguage,
        setLanguage,
        t,
        langDir,
        isAdminAuthenticated,
        isLocked,
        unlockScreen,
        lockScreen,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowPos,
        updateWindowSize,
        toggleStartMenu,
        closeStartMenu,
        toggleControlCenter,
        toggleCalendar,
        toggleSpotlight,
        openTour,
        closeTour,
        setBrightness,
        setVolume,
        toggleWifi,
        toggleNightLight,
        setOSMode,
        dismissNotification,
        showToast,
        loginAdmin,
        logoutAdmin,
        updatePersonalInfo,
        addSkill,
        updateSkill,
        deleteSkill,
        addProject,
        updateProject,
        deleteProject,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        sendMessage,
        markMessageRead,
        deleteMessage,
        addBlog,
        updateBlog,
        deleteBlog,
        updateSettings,
        resetAllData,
        exportJSONData,
        importJSONData
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
