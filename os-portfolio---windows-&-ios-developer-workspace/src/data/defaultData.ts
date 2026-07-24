import {
  PersonalInfo,
  SkillItem,
  ProjectItem,
  ExperienceItem,
  EducationItem,
  TestimonialItem,
  ContactMessage,
  BlogPost,
  OSSettings,
  AppDefinition
} from '../types';

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  name: 'Naim Hossain',
  title: 'Senior Full-Stack & Mobile Software Architect',
  tagline: 'Designing high-performance web, mobile & cloud systems with OS-grade UI precision.',
  bio: 'Building smooth digital products across web, mobile, and desktop. Specialist in React, Next.js, Node.js, React Native, and Cloud Systems.',
  detailedBio: `Hello! I'm Naim Hossain, a Software Developer & Architect based in San Francisco. With over 7 years of professional experience, I bridge the gap between high-performance backends and delightful frontend user interfaces.

My philosophy centers around crafting applications that feel native, responsive, and tactile. Whether building complex cloud management dashboards, cross-platform mobile apps, or high-throughput microservices, I prioritize scalable clean architecture and visual perfection.`,
  avatarUrl: '',
  location: 'San Francisco, CA (Open to Remote)',
  email: 'alex@rivera.dev',
  phone: '+1 (555) 382-9014',
  availability: 'Available for Select Freelance & Full-time Opportunities',
  resumeUrl: '#',
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
    devto: 'https://dev.to',
    website: 'https://alexrivera.dev'
  },
  metrics: {
    yearsExp: 7,
    projectsCompleted: 48,
    satisfiedClients: 32,
    codeQualityRating: '99.8%'
  }
};

export const DEFAULT_SKILLS: SkillItem[] = [
  // Frontend
  { id: '1', name: 'React / React 19', category: 'Frontend', proficiency: 98, iconName: 'Code', featured: true },
  { id: '2', name: 'TypeScript', category: 'Frontend', proficiency: 95, iconName: 'FileCode', featured: true },
  { id: '3', name: 'Next.js 15', category: 'Frontend', proficiency: 92, iconName: 'Globe', featured: true },
  { id: '4', name: 'Tailwind CSS v4', category: 'Frontend', proficiency: 96, iconName: 'Palette', featured: true },
  { id: '5', name: 'Motion / Animation', category: 'Frontend', proficiency: 90, iconName: 'Sparkles', featured: true },
  
  // Mobile
  { id: '6', name: 'React Native / Expo', category: 'Mobile', proficiency: 92, iconName: 'Smartphone', featured: true },
  { id: '7', name: 'Swift / iOS SDK', category: 'Mobile', proficiency: 82, iconName: 'Smartphone', featured: false },
  { id: '8', name: 'Mobile UI / Gestures', category: 'Mobile', proficiency: 90, iconName: 'Sliders', featured: true },

  // Backend & Database
  { id: '9', name: 'Node.js & Express', category: 'Backend & Database', proficiency: 94, iconName: 'Server', featured: true },
  { id: '10', name: 'PostgreSQL & Drizzle', category: 'Backend & Database', proficiency: 88, iconName: 'Database', featured: true },
  { id: '11', name: 'GraphQL & REST APIs', category: 'Backend & Database', proficiency: 91, iconName: 'Cpu', featured: false },
  { id: '12', name: 'Firebase & Firestore', category: 'Backend & Database', proficiency: 93, iconName: 'Flame', featured: true },

  // Cloud & DevOps
  { id: '13', name: 'Docker & Containers', category: 'Cloud & DevOps', proficiency: 86, iconName: 'Box', featured: true },
  { id: '14', name: 'AWS & Cloud Run', category: 'Cloud & DevOps', proficiency: 85, iconName: 'Cloud', featured: false },
  { id: '15', name: 'CI/CD Pipelines', category: 'Cloud & DevOps', proficiency: 88, iconName: 'RefreshCw', featured: false },

  // Tools
  { id: '16', name: 'Git & GitHub Actions', category: 'Tools & Methods', proficiency: 95, iconName: 'GitBranch', featured: false },
  { id: '17', name: 'Figma to Code', category: 'Tools & Methods', proficiency: 92, iconName: 'Figma', featured: true },
  { id: '18', name: 'Jest / Playwright Testing', category: 'Tools & Methods', proficiency: 86, iconName: 'CheckCircle', featured: false }
];

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Cloud Workspace OS',
    shortDesc: 'Web-based virtual desktop environment with multi-window orchestration, file manager, and cloud apps.',
    fullDesc: 'An ambitious browser-based operating system UI that emulates native desktop experience. Built with React, TypeScript, and Motion, it features draggable windows, taskbar system tray, file browser, terminal emulator, and custom cloud widgets.',
    category: 'Full-Stack',
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Motion', 'Express'],
    imageUrl: '',
    media: [],
    links: [],
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
    date: '2026-03',
    stars: 342
  },
  {
    id: 'p2',
    title: 'PulseFit - iOS Health & Analytics',
    shortDesc: 'Cross-platform mobile workout tracker featuring real-time telemetry, GPS routing, and sleep trends.',
    fullDesc: 'PulseFit empowers fitness enthusiasts to monitor physical metrics in real time. Designed with iOS Human Interface Guidelines in mind, featuring haptic feedback, dark mode optics, offline persistence, and interactive chart visualizations.',
    category: 'Mobile App',
    techStack: ['React Native', 'Expo', 'Recharts', 'TypeScript', 'Node.js'],
    imageUrl: '',
    media: [],
    links: [],
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
    date: '2025-11',
    stars: 218
  },
  {
    id: 'p3',
    title: 'Nexus Microservice Gateway',
    shortDesc: 'High-throughput API gateway with automated rate limiting, JWT validation, and GraphQL federation.',
    fullDesc: 'Nexus Gateway sits in front of distributed services to handle security, request caching, rate throttling, and telemetry. Tested under heavy synthetic load handling 25,000 requests/sec with minimal latency overhead.',
    category: 'Cloud & Systems',
    techStack: ['Node.js', 'Express', 'Redis', 'Docker', 'PostgreSQL'],
    imageUrl: '',
    media: [],
    links: [],
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
    date: '2025-08',
    stars: 512
  },
  {
    id: 'p4',
    title: 'DevCanvas Realtime Whiteboard',
    shortDesc: 'Interactive vector canvas with live multi-user collaboration, shape tools, and code snippet cards.',
    fullDesc: 'A fast visual space built for remote engineering teams. Supports realtime websocket cursors, canvas zooming/panning, diagram export, and AI diagram generation.',
    category: 'Frontend',
    techStack: ['React', 'HTML5 Canvas', 'WebSockets', 'Tailwind CSS'],
    imageUrl: '',
    media: [],
    links: [],
    demoUrl: '#',
    githubUrl: '#',
    featured: false,
    date: '2025-04',
    stars: 189
  },
  {
    id: 'p5',
    title: 'CyberCLI Tooling Suite',
    shortDesc: 'Command line developer toolkit for rapid scaffolding, database migrations, and bundle diagnostics.',
    fullDesc: 'Custom Node.js binary CLI tool used by over 10,000 developers. Features interactive prompt menus, color logs, fast template generation, and automated GitHub release checks.',
    category: 'Open Source',
    techStack: ['TypeScript', 'Node.js', 'Commander.js', 'Esbuild'],
    imageUrl: '',
    media: [],
    links: [],
    demoUrl: 'https://example.com/cybercli',
    githubUrl: 'https://github.com/example/cybercli',
    featured: true,
    date: '2024-12',
    stars: 840
  }
];

export const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'e1',
    company: 'Apex Tech Systems',
    role: 'Lead Full-Stack Engineer',
    period: '2023 - Present',
    location: 'San Francisco, CA',
    description: 'Spearheaded frontend and backend architecture for cloud SaaS applications serving over 500k monthly active users.',
    achievements: [
      'Engineered an OS-styled web workspace that boosted user daily engagement by 34%.',
      'Reduced server API latency by 45% using Node.js Redis caching and optimized PostgreSQL queries.',
      'Mentored a team of 8 engineers and introduced automated end-to-end CI/CD testing.'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'PostgreSQL']
  },
  {
    id: 'e2',
    company: 'Vanguard Mobile Labs',
    role: 'Senior Mobile & React Engineer',
    period: '2021 - 2023',
    location: 'San Jose, CA',
    description: 'Architected iOS and Android cross-platform mobile apps for high-growth tech startups.',
    achievements: [
      'Published 4 top-rated iOS/Android apps with average App Store rating of 4.8 stars.',
      'Implemented smooth 60fps animations and offline sync using React Native and SQLite.',
      'Collaborated closely with product designers to implement pixel-perfect Figma components.'
    ],
    technologies: ['React Native', 'Expo', 'TypeScript', 'Redux', 'Firebase', 'Swift']
  },
  {
    id: 'e3',
    company: 'PixelCraft Creative Agency',
    role: 'Frontend Web Developer',
    period: '2019 - 2021',
    location: 'Remote',
    description: 'Developed highly interactive client web applications, e-commerce portals, and interactive portfolios.',
    achievements: [
      'Delivered 25+ bespoke websites for enterprise and SMB clients on tight timelines.',
      'Achieved 98+ Lighthouse performance scores across all client sites.'
    ],
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs', 'Figma']
  }
];

export const DEFAULT_EDUCATION: EducationItem[] = [
  {
    id: 'ed1',
    institution: 'University of California, Berkeley',
    degree: 'Bachelor of Science (B.S.)',
    field: 'Computer Science & Software Systems',
    year: '2015 - 2019',
    grade: '3.85 GPA',
    highlights: [
      'Dean’s Honor List for 6 consecutive semesters.',
      'President of the Computer Science & Web Engineering Club.',
      'Published undergrad research paper on Distributed Systems optimization.'
    ]
  }
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    clientName: 'Sarah Jenkins',
    role: 'VP of Product',
    company: 'Apex Tech Systems',
    avatarUrl: '',
    quote: 'Alex is an exceptional engineer. His ability to deliver complex OS-grade user experiences with speed and precision is unmatched. Highly recommended!',
    rating: 5
  },
  {
    id: 't2',
    clientName: 'Marcus Vance',
    role: 'Founder & CEO',
    company: 'PulseFit Labs',
    avatarUrl: '',
    quote: 'Working with Alex on our iOS app launch was seamless. He translated our design specs into smooth, responsive React Native code faster than expected.',
    rating: 5
  },
  {
    id: 't3',
    clientName: 'Elena Rostova',
    role: 'Engineering Director',
    company: 'Vanguard Labs',
    avatarUrl: '',
    quote: 'Alex brings craftsmanship and deep technical rigor. He is the developer every team dreams of having.',
    rating: 5
  }
];

export const DEFAULT_MESSAGES: ContactMessage[] = [
  {
    id: 'm1',
    senderName: 'David Miller',
    senderEmail: 'david@enterprise.io',
    whatsapp: '+14155551234',
    subject: 'Inquiry regarding Senior Architect Role',
    message: 'Hi Alex, loved your portfolio OS design! We have an exciting lead full-stack position for our cloud platform. Would love to schedule a call.',
    createdAt: '2026-07-20T14:22:00Z',
    read: false
  },
  {
    id: 'm2',
    senderName: 'Jessica Taylor',
    senderEmail: 'jessica@studio.design',
    whatsapp: '+8801712345678',
    subject: 'Freelance Project Consultation',
    message: 'Hey Alex! We need a high-end web app with custom desktop-like drag and drop interactions for a client campaign. Are you open for freelance work next month?',
    createdAt: '2026-07-18T09:15:00Z',
    read: true
  }
];

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Building OS-Grade Desktop UIs in React 19',
    slug: 'building-os-grade-desktop-uis',
    tag: 'Architecture',
    excerpt: 'How to handle z-index layers, drag handles, window snapping, and virtual taskbars in modern web apps.',
    content: `Creating desktop-like user experiences in web browsers requires careful state management and fluid motion mechanics.

### Key Considerations:
1. **Z-Index Layer Management**: Window focus order must dynamically update whenever a user clicks or drags a window.
2. **Performance Constraints**: Using hardware-accelerated transforms (CSS translate) instead of top/left positioning for 60fps window movement.
3. **Responsive Degradation**: Gracefully adapting desktop layouts into mobile tabbed/sheet experiences.`,
    readTime: '5 min read',
    date: 'July 15, 2026',
    coverImage: '',
    published: true
  },
  {
    id: 'b2',
    title: 'React Native vs Native Swift in 2026',
    slug: 'react-native-vs-swift-2026',
    tag: 'Mobile Development',
    excerpt: 'An in-depth benchmark comparison of cross-platform React Native performance against iOS Swift.',
    content: `With the arrival of React Native's New Architecture (Fabric & TurboModules), cross-platform mobile apps are closer to pure native performance than ever.

In this benchmark study, we test gesture responsiveness, cold boot time, and memory footprint across complex dashboard applications.`,
    readTime: '8 min read',
    date: 'June 28, 2026',
    coverImage: '',
    published: true
  }
];

export const DEFAULT_SETTINGS: OSSettings = {
  wallpaper: 'win10-hero',
  lockWallpaper: 'ios-fluid',
  accentColor: '#3b82f6',
  osMode: 'auto',
  soundEnabled: true,
  darkMode: true,
  visitorCount: 1284
};

export const SYSTEM_APPS: AppDefinition[] = [
  { id: 'about', title: 'About Me', iconName: 'User', category: 'core', color: '#3b82f6', bgGradient: 'from-blue-500 to-indigo-600' },
  { id: 'skills', title: 'Skills & Tech', iconName: 'Cpu', category: 'core', color: '#10b981', bgGradient: 'from-emerald-500 to-teal-600' },
  { id: 'projects', title: 'Projects', iconName: 'FolderGit2', category: 'portfolio', badge: '5', color: '#8b5cf6', bgGradient: 'from-purple-500 to-violet-600' },
  { id: 'experience', title: 'Experience', iconName: 'Briefcase', category: 'portfolio', color: '#f59e0b', bgGradient: 'from-amber-500 to-orange-600' },
  { id: 'testimonials', title: 'Testimonials', iconName: 'Star', category: 'portfolio', color: '#ec4899', bgGradient: 'from-pink-500 to-rose-600' },
  { id: 'contact', title: 'Contact Me', iconName: 'Mail', category: 'core', badge: 'Live', color: '#06b6d4', bgGradient: 'from-cyan-500 to-blue-600' },
  { id: 'blog', title: 'Blog', iconName: 'Newspaper', category: 'portfolio', color: '#3b82f6', bgGradient: 'from-blue-500 to-cyan-400' },
  { id: 'terminal', title: 'CLI Terminal', iconName: 'Terminal', category: 'system', color: '#22c55e', bgGradient: 'from-green-600 to-emerald-800' },
  { id: 'settings', title: 'OS Settings', iconName: 'Settings', category: 'system', color: '#64748b', bgGradient: 'from-slate-500 to-slate-700' },
  { id: 'admin', title: 'Admin Panel', iconName: 'Shield', category: 'system', badge: 'Secured', color: '#ef4444', bgGradient: 'from-red-500 to-rose-700' },
  { id: 'gamehub', title: 'Game Hub', iconName: 'Gamepad2', category: 'core', color: '#f59e0b', bgGradient: 'from-amber-500 to-orange-600' }
];

export interface WallpaperDef {
  id: string;
  name: string;
  url: string;
}

export const WALLPAPERS: WallpaperDef[] = [
  // === Windows Defaults ===
  { id: 'win11-bloom', name: 'Win 11 Bloom', url: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 20%, #6b2142 40%, #c0392b 60%, #e67e22 80%, #f1c40f 100%)' },
  { id: 'win11-blue', name: 'Win 11 Blue', url: 'linear-gradient(180deg, #0d1117 0%, #161b22 20%, #1f2937 40%, #374151 60%, #4b5563 100%)' },
  { id: 'win10-hero', name: 'Win 10 Hero', url: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 20%, #16213e 40%, #0f3460 60%, #533483 80%, #e94560 100%)' },
  { id: 'win-blue-bottom', name: 'Win Blue Bottom', url: 'linear-gradient(180deg, #0c1445 0%, #1a237e 25%, #283593 50%, #1565c0 75%, #42a5f5 100%)' },
  // === iOS / macOS Defaults ===
  { id: 'ios-stock', name: 'iOS Default', url: 'linear-gradient(135deg, #0d0d2b 0%, #1a1a4e 20%, #2d1b69 40%, #6b2142 60%, #a83279 80%, #e84393 100%)' },
  { id: 'ios-16', name: 'iOS 16 Gradient', url: 'linear-gradient(135deg, #0f0c29 0%, #302b63 25%, #24243e 45%, #2b0f55 65%, #6b2162 85%, #c0392b 100%)' },
  { id: 'macos-sonoma', name: 'macOS Sonoma', url: 'linear-gradient(180deg, #0b0e14 0%, #1a2332 30%, #2d4a6b 55%, #5b8cb8 75%, #a8d8ea 100%)' },
  { id: 'macos-bigsur', name: 'macOS Big Sur', url: 'linear-gradient(180deg, #0f0c29 0%, #1a1a3e 25%, #2d1b69 50%, #1a3a6b 75%, #0f4c5c 100%)' },
  { id: 'ios-fluid', name: 'iOS Fluid', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80' },
  // === Colorful Gradients ===
  { id: 'sunset-blend', name: 'Sunset Blend', url: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 25%, #48dbfb 50%, #ff9ff3 75%, #54a0ff 100%)' },
  { id: 'ocean-dream', name: 'Ocean Dream', url: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a4e 30%, #2d6bb5 60%, #64b5f6 100%)' },
  { id: 'aurora-borealis', name: 'Aurora Borealis', url: 'linear-gradient(135deg, #0d0221 0%, #1a0a3e 25%, #0f4c5c 50%, #1b9aaa 75%, #7dd87d 100%)' },
  { id: 'cotton-candy', name: 'Cotton Candy', url: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 20%, #ce93d8 40%, #81d4fa 60%, #80cbc4 100%)' },
  { id: 'tropical', name: 'Tropical Vibes', url: 'linear-gradient(135deg, #004d40 0%, #00695c 25%, #00897b 50%, #26a69a 75%, #80cbc4 100%)' },
  { id: 'neon-city', name: 'Neon City', url: 'linear-gradient(135deg, #0a0a2e 0%, #1a0a3e 20%, #d32f2f 45%, #ff6f00 70%, #ffd600 100%)' },
  { id: 'mango', name: 'Mango Tango', url: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 25%, #fbc2eb 50%, #a18cd1 75%, #667eea 100%)' },
  { id: 'forest', name: 'Forest Canopy', url: 'linear-gradient(135deg, #134e5e 0%, #2c7a5a 30%, #6bcb77 60%, #a8e6cf 100%)' },
  { id: 'lavender', name: 'Lavender Fields', url: 'linear-gradient(135deg, #2d1b69 0%, #6a3093 30%, #a855f7 60%, #d8b4fe 100%)' },
  { id: 'winter', name: 'Winter Frost', url: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #e2e8f0 100%)' },
  { id: 'sunrise', name: 'Golden Sunrise', url: 'linear-gradient(135deg, #1a0a00 0%, #4a1800 20%, #b84700 50%, #ff8c00 75%, #ffd700 100%)' },
  { id: 'ocean-surface', name: 'Ocean Surface', url: 'linear-gradient(135deg, #006064 0%, #00838f 25%, #00acc1 50%, #4dd0e1 75%, #b2ebf2 100%)' },
  { id: 'blush', name: 'Blush', url: 'linear-gradient(135deg, #2d1a3e 0%, #6b2142 25%, #c0392b 50%, #e74c3c 75%, #f39c12 100%)' },
  { id: 'deep-space', name: 'Deep Space', url: 'linear-gradient(135deg, #000000 0%, #0a0a2e 20%, #1a0a3e 40%, #2d1b69 60%, #4a3060 100%)' },
  { id: 'paradise', name: 'Paradise', url: 'linear-gradient(135deg, #0f2027 0%, #203a43 30%, #2c5364 50%, #36d1dc 75%, #5b86e5 100%)' },
  { id: 'peach', name: 'Peach Dream', url: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 30%, #ff9a9e 50%, #fad0c4 75%, #fbc2eb 100%)' },
  // === Image Wallpapers ===
  { id: 'colorful-abstract', name: 'Colorful Abstract', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1920&q=80' },
  { id: 'northern-lights', name: 'Northern Lights', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1920&q=80' },
  { id: 'galaxy', name: 'Galaxy Nebula', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80' },
  { id: 'ios-fluid', name: 'iOS Fluid', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80' },
  { id: 'beach-sunset', name: 'Beach Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80' },
  { id: 'mountain-lake', name: 'Mountain Lake', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80' },
  { id: 'cherry-blossom', name: 'Cherry Blossom', url: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?auto=format&fit=crop&w=1920&q=80' },
  { id: 'ocean-sunset', name: 'Ocean Sunset', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=80' },
  { id: 'abstract-dark', name: 'Abstract Dark', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80' },
  { id: 'starry-night', name: 'Starry Night', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80' },
  { id: 'japan-shrine', name: 'Japan Shrine', url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1920&q=80' },
  { id: 'waterfall', name: 'Mountain Waterfall', url: 'https://images.unsplash.com/photo-1490077476659-095159692ab5?auto=format&fit=crop&w=1920&q=80' },
  { id: 'desert-dunes', name: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1920&q=80' },
  { id: 'win-blue-bottom', name: 'Windows Blue Bottom', url: 'linear-gradient(180deg, #0c1445 0%, #1a237e 25%, #283593 50%, #1565c0 75%, #42a5f5 100%)' },
  { id: 'bamboo-forest', name: 'Bamboo Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80' },
  { id: 'milky-way', name: 'Milky Way', url: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1920&q=80' },
  { id: 'laptop-desk', name: 'Laptop Desk', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=80' },
  { id: 'code-screen', name: 'Code Screen', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=80' },
  { id: 'snow-mountain', name: 'Snow Mountain', url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1920&q=80' },
  { id: 'palm-trees', name: 'Palm Trees', url: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1920&q=80' },
  { id: 'river-view', name: 'River View', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80' },
  { id: 'autumn-leaves', name: 'Autumn Leaves', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80' },
  { id: 'lake-sunset', name: 'Lake Sunset', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80' },
  { id: 'canyon', name: 'Canyon View', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1920&q=80' },
  // === Premium 4K Desktop Backgrounds ===
  { id: 'premium-4k', name: 'Premium 4K', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80' },
  // === OS-Style Landscape Wallpapers ===
  { id: 'win-bloom-img', name: 'Win Bloom', url: 'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?auto=format&fit=crop&w=1920&q=80' },
  { id: 'mac-cliff', name: 'macOS Cliff', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80' },
  { id: 'mac-lake', name: 'macOS Lake', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80' },
  { id: 'ios-mountain', name: 'iOS Mountain', url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1920&q=80' },
  { id: 'ios-abstract', name: 'iOS Abstract', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1920&q=80' }
];
