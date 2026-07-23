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

  sendMessage: (msg: { senderName: string; senderEmail: string; subject: string; message: string }) => Promise<void>;
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

  // Load all data from Supabase on mount
  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        // Try Supabase first
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
      } catch {
        // Supabase failed — restore from localStorage fallback
      }

      // Always apply localStorage fallback for any empty data
      try {
        const savedPI = localStorage.getItem(STORAGE_KEYS.PERSONAL_INFO);
        if (savedPI) setPersonalInfo((prev) => prev === DEFAULT_PERSONAL_INFO ? JSON.parse(savedPI) : prev);
        const savedSK = localStorage.getItem(STORAGE_KEYS.SKILLS);
        if (savedSK) setSkills((prev) => prev.length === 0 ? JSON.parse(savedSK) : prev);
        const savedPR = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        if (savedPR) setProjects((prev) => prev.length === 0 ? JSON.parse(savedPR) : prev);
        const savedEX = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
        if (savedEX) setExperience((prev) => prev.length === 0 ? JSON.parse(savedEX) : prev);
        const savedED = localStorage.getItem(STORAGE_KEYS.EDUCATION);
        if (savedED) setEducation((prev) => prev.length === 0 ? JSON.parse(savedED) : prev);
        const savedTE = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
        if (savedTE) setTestimonials((prev) => prev.length === 0 ? JSON.parse(savedTE) : prev);
        const savedME = localStorage.getItem(STORAGE_KEYS.MESSAGES);
        if (savedME) setMessages((prev) => prev.length === 0 ? JSON.parse(savedME) : prev);
        const savedBL = localStorage.getItem(STORAGE_KEYS.BLOGS);
        if (savedBL) setBlogs((prev) => prev.length === 0 ? JSON.parse(savedBL) : prev);
        const savedSE = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (savedSE) setSettingsState((prev) => JSON.parse(savedSE));
      } catch {}

      setDataLoaded(true);
    };
    loadData();
    return () => { cancelled = true; };
  }, []);

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

  // Persist to localStorage as fallback cache
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PERSONAL_INFO, JSON.stringify(personalInfo)); }, [personalInfo]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills)); }, [skills]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(experience)); }, [experience]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(education)); }, [education]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs)); }, [blogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);

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

  // CRUD Operations — try Supabase first, always update local state
  const updatePersonalInfo = async (info: PersonalInfo) => {
    setPersonalInfo(info);
    if (dataLoaded) {
      try { await db.personalInfo.update(1, info as unknown as Record<string, unknown>); } catch { /* tables may not exist yet */ }
    }
    showToast(t('notif.profileUpdated'), '');
  };

  const addSkill = async (skill: Omit<SkillItem, 'id'>) => {
    const withId = { ...skill, id: generateUniqueId() };
    if (dataLoaded) {
      try { const inserted = await db.skills.insert(withId as unknown as Record<string, unknown>); if (inserted) { setSkills((prev) => [inserted as unknown as SkillItem, ...prev]); return; } } catch {}
    }
    setSkills((prev) => [withId as SkillItem, ...prev]);
    showToast(t('notif.skillAdded'), '');
  };

  const updateSkill = async (id: string, updated: Partial<SkillItem>) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    if (dataLoaded) { try { await db.skills.update(id, updated as unknown as Record<string, unknown>); } catch {} }
    showToast(t('notif.skillAdded'), '');
  };

  const deleteSkill = async (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    if (dataLoaded) { try { await db.skills.remove(id); } catch {} }
    showToast(t('notif.skillRemoved'), '');
  };

  const addProject = async (project: Omit<ProjectItem, 'id'>) => {
    const withId = { ...project, id: generateUniqueId() };
    if (dataLoaded) {
      try { const inserted = await db.projects.insert(withId as unknown as Record<string, unknown>); if (inserted) { setProjects((prev) => [inserted as unknown as ProjectItem, ...prev]); return; } } catch {}
    }
    setProjects((prev) => [withId as ProjectItem, ...prev]);
    showToast(t('notif.projectPublished'), '');
  };

  const updateProject = async (id: string, updated: Partial<ProjectItem>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    if (dataLoaded) { try { await db.projects.update(id, updated as unknown as Record<string, unknown>); } catch {} }
    showToast(t('notif.projectPublished'), '');
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (dataLoaded) { try { await db.projects.remove(id); } catch {} }
    showToast(t('notif.projectDeleted'), '');
  };

  const addExperience = async (exp: Omit<ExperienceItem, 'id'>) => {
    const withId = { ...exp, id: generateUniqueId() };
    if (dataLoaded) {
      try { const inserted = await db.experience.insert(withId as unknown as Record<string, unknown>); if (inserted) { setExperience((prev) => [inserted as unknown as ExperienceItem, ...prev]); return; } } catch {}
    }
    setExperience((prev) => [withId as ExperienceItem, ...prev]);
    showToast(t('notif.experienceAdded'), '');
  };

  const updateExperience = async (id: string, updated: Partial<ExperienceItem>) => {
    setExperience((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    if (dataLoaded) { try { await db.experience.update(id, updated as unknown as Record<string, unknown>); } catch {} }
    showToast(t('notif.experienceAdded'), '');
  };

  const deleteExperience = async (id: string) => {
    setExperience((prev) => prev.filter((e) => e.id !== id));
    if (dataLoaded) { try { await db.experience.remove(id); } catch {} }
    showToast(t('notif.experienceAdded'), '');
  };

  const addEducation = async (edu: Omit<EducationItem, 'id'>) => {
    const withId = { ...edu, id: generateUniqueId() };
    if (dataLoaded) {
      try { const inserted = await db.education.insert(withId as unknown as Record<string, unknown>); if (inserted) { setEducation((prev) => [inserted as unknown as EducationItem, ...prev]); return; } } catch {}
    }
    setEducation((prev) => [withId as EducationItem, ...prev]);
    showToast(t('notif.experienceAdded'), '');
  };

  const updateEducation = async (id: string, updated: Partial<EducationItem>) => {
    setEducation((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    if (dataLoaded) { try { await db.education.update(id, updated as unknown as Record<string, unknown>); } catch {} }
    showToast(t('notif.experienceAdded'), '');
  };

  const deleteEducation = async (id: string) => {
    setEducation((prev) => prev.filter((e) => e.id !== id));
    if (dataLoaded) { try { await db.education.remove(id); } catch {} }
    showToast(t('notif.experienceAdded'), '');
  };

  const addTestimonial = async (test: Omit<TestimonialItem, 'id'>) => {
    const withId = { ...test, id: generateUniqueId() };
    if (dataLoaded) {
      try { const inserted = await db.testimonials.insert(withId as unknown as Record<string, unknown>); if (inserted) { setTestimonials((prev) => [inserted as unknown as TestimonialItem, ...prev]); return; } } catch {}
    }
    setTestimonials((prev) => [withId as TestimonialItem, ...prev]);
    showToast(t('notif.experienceAdded'), '');
  };

  const updateTestimonial = async (id: string, updated: Partial<TestimonialItem>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    if (dataLoaded) { try { await db.testimonials.update(id, updated as unknown as Record<string, unknown>); } catch {} }
    showToast(t('notif.experienceAdded'), '');
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    if (dataLoaded) { try { await db.testimonials.remove(id); } catch {} }
    showToast(t('notif.experienceAdded'), '');
  };

  const sendMessage = async (msg: { senderName: string; senderEmail: string; subject: string; message: string }) => {
    const newMsg: ContactMessage = { ...msg, id: generateUniqueId(), createdAt: new Date().toISOString(), read: false };
    if (dataLoaded) {
      try { const inserted = await db.contactMessages.insert(newMsg as unknown as Record<string, unknown>); if (inserted) { setMessages((prev) => [inserted as unknown as ContactMessage, ...prev]); return; } } catch {}
    }
    setMessages((prev) => [newMsg, ...prev]);
    showToast(t('notif.messageSent'), '');
  };

  const markMessageRead = async (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    if (dataLoaded) { try { await db.contactMessages.update(id, { read: true } as unknown as Record<string, unknown>); } catch {} }
  };

  const deleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (dataLoaded) { try { await db.contactMessages.remove(id); } catch {} }
    showToast(t('notif.messageDeleted'), '');
  };

  const addBlog = async (blog: Omit<BlogPost, 'id'>) => {
    const withId = { ...blog, id: generateUniqueId() };
    if (dataLoaded) {
      try { const inserted = await db.blogPosts.insert(withId as unknown as Record<string, unknown>); if (inserted) { setBlogs((prev) => [inserted as unknown as BlogPost, ...prev]); return; } } catch {}
    }
    setBlogs((prev) => [withId as BlogPost, ...prev]);
    showToast(t('notif.projectPublished'), '');
  };

  const updateBlog = async (id: string, updated: Partial<BlogPost>) => {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    if (dataLoaded) { try { await db.blogPosts.update(id, updated as unknown as Record<string, unknown>); } catch {} }
    showToast(t('notif.projectPublished'), '');
  };

  const deleteBlog = async (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    if (dataLoaded) { try { await db.blogPosts.remove(id); } catch {} }
    showToast(t('notif.projectPublished'), '');
  };

  const updateSettings = async (newSettings: Partial<OSSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
    if (dataLoaded) { try { await db.settings.update(1, newSettings as unknown as Record<string, unknown>); } catch {} }
    showToast(t('notif.settingsSaved'), '');
  };

  const resetAllData = async () => {
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
    // Also clear Supabase
    if (dataLoaded) {
      try {
        await supabase.from('personal_info').delete().neq('id', 0);
        await supabase.from('skills').delete().neq('id', '');
        await supabase.from('projects').delete().neq('id', '');
        await supabase.from('experience').delete().neq('id', '');
        await supabase.from('education').delete().neq('id', '');
        await supabase.from('testimonials').delete().neq('id', '');
        await supabase.from('contact_messages').delete().neq('id', '');
        await supabase.from('blog_posts').delete().neq('id', '');
        await supabase.from('settings').delete().neq('id', 0);
      } catch {}
    }
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
      settings: { ...settings, adminPasswordHash: '***' }
    };
    return JSON.stringify(fullData, null, 2);
  };

  const importJSONData = async (jsonStr: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.personalInfo) { setPersonalInfo(parsed.personalInfo); if (dataLoaded) try { await db.personalInfo.update(1, parsed.personalInfo); } catch {} }
      if (parsed.skills) { setSkills(parsed.skills); /* could iterate and insert each */ }
      if (parsed.projects) { setProjects(parsed.projects); }
      if (parsed.experience) { setExperience(parsed.experience); }
      if (parsed.education) { setEducation(parsed.education); }
      if (parsed.testimonials) { setTestimonials(parsed.testimonials); }
      if (parsed.blogs) { setBlogs(parsed.blogs); }
      showToast(t('notif.importSuccess'), '');
      return true;
    } catch {
      showToast(t('notif.importFailed'), '');
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
