import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
  updatePersonalInfo: (info: PersonalInfo) => Promise<void>;
  
  addSkill: (skill: Omit<SkillItem, 'id'>) => Promise<void>;
  updateSkill: (id: string, skill: Partial<SkillItem>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;

  addProject: (project: Omit<ProjectItem, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<ProjectItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addExperience: (exp: Omit<ExperienceItem, 'id'>) => Promise<void>;
  updateExperience: (id: string, exp: Partial<ExperienceItem>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

  addEducation: (edu: Omit<EducationItem, 'id'>) => Promise<void>;
  updateEducation: (id: string, edu: Partial<EducationItem>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;

  addTestimonial: (test: Omit<TestimonialItem, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, test: Partial<TestimonialItem>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  sendMessage: (msg: { senderName: string; senderEmail: string; whatsapp: string; subject: string; message: string }) => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  addBlog: (blog: Omit<BlogPost, 'id'>) => Promise<void>;
  updateBlog: (id: string, blog: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  updateSettings: (newSettings: Partial<OSSettings>) => Promise<void>;
  resetAllData: () => Promise<void>;
  exportJSONData: () => string;
  importJSONData: (jsonStr: string) => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

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
  // Data State — initialized empty, loaded from Supabase on mount
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(DEFAULT_PERSONAL_INFO);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [settings, setSettingsState] = useState<OSSettings>(DEFAULT_SETTINGS);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load all data from Supabase on mount (single source of truth)
  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        const [pi, sk, pr, ex, ed, te, me, bl, se] = await Promise.allSettled([
          db.personalInfo.getAll(),
          db.skills.getAll(),
          db.projects.getAll(),
          db.experience.getAll(),
          db.education.getAll(),
          db.testimonials.getAll(),
          db.contactMessages.getAll(),
          db.blogPosts.getAll(),
          db.settings.getAll(),
        ]);

        if (cancelled) return;

        if (pi.status === 'fulfilled' && pi.value.length > 0) setPersonalInfo(pi.value[0] as unknown as PersonalInfo);
        if (sk.status === 'fulfilled') setSkills(sk.value as unknown as SkillItem[]);
        if (pr.status === 'fulfilled') setProjects(pr.value as unknown as ProjectItem[]);
        if (ex.status === 'fulfilled') setExperience(ex.value as unknown as ExperienceItem[]);
        if (ed.status === 'fulfilled') setEducation(ed.value as unknown as EducationItem[]);
        if (te.status === 'fulfilled') setTestimonials(te.value as unknown as TestimonialItem[]);
        if (me.status === 'fulfilled') setMessages(me.value as unknown as ContactMessage[]);
        if (bl.status === 'fulfilled') setBlogs(bl.value as unknown as BlogPost[]);
        if (se.status === 'fulfilled' && se.value.length > 0) setSettingsState(se.value[0] as unknown as OSSettings);
      } catch (err) {
        console.error('Failed to load data from Supabase:', err);
      }

      setDataLoaded(true);
    };
    loadData();
    return () => { cancelled = true; };
  }, []);

  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Check Supabase session on mount for admin auth (single source of truth)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdminAuthenticated(!!data.session);
    });
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      setIsAdminAuthenticated(event === 'SIGNED_IN');
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
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setScreenWidth(window.innerWidth), 150);
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); clearTimeout(timer); };
  }, []);

  const activeOSMode: 'desktop' | 'mobile' =
    settings.osMode === 'auto'
      ? screenWidth < 768
        ? 'mobile'
        : 'desktop'
      : settings.osMode;

  // Note: DB is the single source of truth. No localStorage caching.

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
    localStorage.removeItem('os_portfolio_has_seen_tour');
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

  // Admin Auth (pure Supabase Auth — single source of truth)
  const loginAdmin = async (user: string, pass: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: user, password: pass });
      if (error) throw error;
      if (data.session) {
        setIsAdminAuthenticated(true);
        showToast('Admin Logged In', 'Welcome back, Administrator.');
        return true;
      }
    } catch {
      // Auth failed
    }
    showToast('Authentication Error', 'Invalid email or password.');
    return false;
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut().catch(() => {});
    setIsAdminAuthenticated(false);
    showToast('Admin Session', 'Logged out of admin panel.');
  };

  // CRUD Operations — DB is the single source of truth
  const handleDbError = (err: unknown, label: string) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`DB ${label}:`, err);
    showToast('Database Error', `${label}: ${msg}`);
  };

  const updatePersonalInfo = async (info: PersonalInfo) => {
    setPersonalInfo(info);
    try {
      await db.personalInfo.update(1, info as unknown as Record<string, unknown>);
      showToast(t('notif.profileUpdated'), '');
    } catch (err) { handleDbError(err, 'Failed to save profile'); }
  };

  const addSkill = async (skill: Omit<SkillItem, 'id'>) => {
    try {
      const inserted = await db.skills.insert(skill as unknown as Record<string, unknown>);
      setSkills((prev) => [inserted as unknown as SkillItem, ...prev]);
      showToast(t('notif.skillAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to add skill'); }
  };

  const updateSkill = async (id: string, updated: Partial<SkillItem>) => {
    try {
      await db.skills.update(id, updated as unknown as Record<string, unknown>);
      setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
      showToast(t('notif.skillAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to update skill'); }
  };

  const deleteSkill = async (id: string) => {
    try {
      await db.skills.remove(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      showToast(t('notif.skillRemoved'), '');
    } catch (err) { handleDbError(err, 'Failed to delete skill'); }
  };

  const addProject = async (project: Omit<ProjectItem, 'id'>) => {
    try {
      const inserted = await db.projects.insert(project as unknown as Record<string, unknown>);
      setProjects((prev) => [inserted as unknown as ProjectItem, ...prev]);
      showToast(t('notif.projectPublished'), '');
    } catch (err) { handleDbError(err, 'Failed to add project'); }
  };

  const updateProject = async (id: string, updated: Partial<ProjectItem>) => {
    try {
      await db.projects.update(id, updated as unknown as Record<string, unknown>);
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      showToast(t('notif.projectPublished'), '');
    } catch (err) { handleDbError(err, 'Failed to update project'); }
  };

  const deleteProject = async (id: string) => {
    try {
      await db.projects.remove(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast(t('notif.projectDeleted'), '');
    } catch (err) { handleDbError(err, 'Failed to delete project'); }
  };

  const addExperience = async (exp: Omit<ExperienceItem, 'id'>) => {
    try {
      const inserted = await db.experience.insert(exp as unknown as Record<string, unknown>);
      setExperience((prev) => [inserted as unknown as ExperienceItem, ...prev]);
      showToast(t('notif.experienceAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to add experience'); }
  };

  const updateExperience = async (id: string, updated: Partial<ExperienceItem>) => {
    try {
      await db.experience.update(id, updated as unknown as Record<string, unknown>);
      setExperience((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
      showToast(t('notif.experienceAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to update experience'); }
  };

  const deleteExperience = async (id: string) => {
    try {
      await db.experience.remove(id);
      setExperience((prev) => prev.filter((e) => e.id !== id));
      showToast(t('notif.experienceAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to delete experience'); }
  };

  const addEducation = async (edu: Omit<EducationItem, 'id'>) => {
    try {
      const inserted = await db.education.insert(edu as unknown as Record<string, unknown>);
      setEducation((prev) => [inserted as unknown as EducationItem, ...prev]);
      showToast(t('notif.experienceAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to add education'); }
  };

  const updateEducation = async (id: string, updated: Partial<EducationItem>) => {
    try {
      await db.education.update(id, updated as unknown as Record<string, unknown>);
      setEducation((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
      showToast(t('notif.experienceAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to update education'); }
  };

  const deleteEducation = async (id: string) => {
    try {
      await db.education.remove(id);
      setEducation((prev) => prev.filter((e) => e.id !== id));
      showToast(t('notif.experienceAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to delete education'); }
  };

  const addTestimonial = async (test: Omit<TestimonialItem, 'id'>) => {
    try {
      const inserted = await db.testimonials.insert(test as unknown as Record<string, unknown>);
      setTestimonials((prev) => [inserted as unknown as TestimonialItem, ...prev]);
      showToast(t('notif.experienceAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to add testimonial'); }
  };

  const updateTestimonial = async (id: string, updated: Partial<TestimonialItem>) => {
    try {
      await db.testimonials.update(id, updated as unknown as Record<string, unknown>);
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      showToast(t('notif.experienceAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to update testimonial'); }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await db.testimonials.remove(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      showToast(t('notif.experienceAdded'), '');
    } catch (err) { handleDbError(err, 'Failed to delete testimonial'); }
  };

  const sendMessage = async (msg: { senderName: string; senderEmail: string; whatsapp: string; subject: string; message: string }) => {
    try {
      const inserted = await db.contactMessages.insert({
        ...msg,
        createdAt: new Date().toISOString(),
        read: false,
      } as unknown as Record<string, unknown>);
      setMessages((prev) => [inserted as unknown as ContactMessage, ...prev]);
      showToast(t('notif.messageSent'), '');
    } catch (err) { handleDbError(err, 'Failed to send message'); }
  };

  const markMessageRead = async (id: string) => {
    try {
      await db.contactMessages.update(id, { read: true } as unknown as Record<string, unknown>);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch (err) { handleDbError(err, 'Failed to mark message read'); }
  };

  const deleteMessage = async (id: string) => {
    try {
      await db.contactMessages.remove(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast(t('notif.messageDeleted'), '');
    } catch (err) { handleDbError(err, 'Failed to delete message'); }
  };

  const addBlog = async (blog: Omit<BlogPost, 'id'>) => {
    try {
      const inserted = await db.blogPosts.insert(blog as unknown as Record<string, unknown>);
      setBlogs((prev) => [inserted as unknown as BlogPost, ...prev]);
      showToast(t('notif.projectPublished'), '');
    } catch (err) { handleDbError(err, 'Failed to add blog post'); }
  };

  const updateBlog = async (id: string, updated: Partial<BlogPost>) => {
    try {
      await db.blogPosts.update(id, updated as unknown as Record<string, unknown>);
      setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      showToast(t('notif.projectPublished'), '');
    } catch (err) { handleDbError(err, 'Failed to update blog post'); }
  };

  const deleteBlog = async (id: string) => {
    try {
      await db.blogPosts.remove(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      showToast(t('notif.projectPublished'), '');
    } catch (err) { handleDbError(err, 'Failed to delete blog post'); }
  };

  const updateSettings = async (newSettings: Partial<OSSettings>) => {
    try {
      await db.settings.update(1, newSettings as unknown as Record<string, unknown>);
      setSettingsState((prev) => ({ ...prev, ...newSettings }));
      showToast(t('notif.settingsSaved'), '');
    } catch (err) { handleDbError(err, 'Failed to save settings'); }
  };

  const resetAllData = async () => {
    setIsAdminAuthenticated(false);
    // Clear all tables in Supabase
    if (dataLoaded) {
      try {
        await db.personalInfo.clear();
        await db.skills.clear();
        await db.projects.clear();
        await db.experience.clear();
        await db.education.clear();
        await db.testimonials.clear();
        await db.contactMessages.clear();
        await db.blogPosts.clear();
        await db.settings.clear();
      } catch (err) {
        console.error('Failed to reset data:', err);
      }
    }
    // Reset to defaults
    setPersonalInfo(DEFAULT_PERSONAL_INFO);
    setSkills([]);
    setProjects([]);
    setExperience([]);
    setEducation([]);
    setTestimonials([]);
    setMessages([]);
    setBlogs([]);
    setSettingsState(DEFAULT_SETTINGS);
    showToast(t('notif.dataReset'), '');
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
      settings: { ...settings }
    };
    return JSON.stringify(fullData, null, 2);
  };

  const importJSONData = async (jsonStr: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.personalInfo) {
        setPersonalInfo(parsed.personalInfo);
        if (dataLoaded) await db.personalInfo.update(1, parsed.personalInfo).catch(() => {});
      }
      if (parsed.skills) {
        setSkills(parsed.skills);
        if (dataLoaded) {
          await db.skills.clear();
          for (const skill of parsed.skills) { await db.skills.insert(skill).catch(() => {}); }
        }
      }
      if (parsed.projects) {
        setProjects(parsed.projects);
        if (dataLoaded) {
          await db.projects.clear();
          for (const project of parsed.projects) { await db.projects.insert(project).catch(() => {}); }
        }
      }
      if (parsed.experience) {
        setExperience(parsed.experience);
        if (dataLoaded) {
          await db.experience.clear();
          for (const exp of parsed.experience) { await db.experience.insert(exp).catch(() => {}); }
        }
      }
      if (parsed.education) {
        setEducation(parsed.education);
        if (dataLoaded) {
          await db.education.clear();
          for (const edu of parsed.education) { await db.education.insert(edu).catch(() => {}); }
        }
      }
      if (parsed.testimonials) {
        setTestimonials(parsed.testimonials);
        if (dataLoaded) {
          await db.testimonials.clear();
          for (const test of parsed.testimonials) { await db.testimonials.insert(test).catch(() => {}); }
        }
      }
      if (parsed.blogs) {
        setBlogs(parsed.blogs);
        if (dataLoaded) {
          await db.blogPosts.clear();
          for (const blog of parsed.blogs) { await db.blogPosts.insert(blog).catch(() => {}); }
        }
      }
      showToast(t('notif.importSuccess'), '');
      return true;
    } catch {
      showToast(t('notif.importFailed'), '');
      return false;
    }
  };

  const ctxValue = useMemo(() => ({
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
    importJSONData,
  }), [
    personalInfo, skills, projects, experience, education,
    testimonials, messages, blogs, settings, notifications,
    windows, activeWindowId, activeOSMode,
    isStartMenuOpen, isControlCenterOpen, isCalendarOpen, isSpotlightOpen, isTourOpen,
    brightness, volume, wifiConnected, nightLight,
    batteryLevel, batteryCharging,
    currentLanguage, t, langDir, isAdminAuthenticated, isLocked,
  ]);

  return (
    <PortfolioContext.Provider value={ctxValue}>
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
