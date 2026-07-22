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
  name: 'Alex Rivera',
  title: 'Senior Full-Stack & Mobile Software Architect',
  tagline: 'Designing high-performance web, mobile & cloud systems with OS-grade UI precision.',
  bio: 'Building smooth digital products across web, mobile, and desktop. Specialist in React, Next.js, Node.js, React Native, and Cloud Systems.',
  detailedBio: `Hello! I'm Alex Rivera, a Software Developer & Architect based in San Francisco. With over 7 years of professional experience, I bridge the gap between high-performance backends and delightful frontend user interfaces.

My philosophy centers around crafting applications that feel native, responsive, and tactile. Whether building complex cloud management dashboards, cross-platform mobile apps, or high-throughput microservices, I prioritize scalable clean architecture and visual perfection.`,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1510519138161-58446232811f?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
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
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    quote: 'Alex is an exceptional engineer. His ability to deliver complex OS-grade user experiences with speed and precision is unmatched. Highly recommended!',
    rating: 5
  },
  {
    id: 't2',
    clientName: 'Marcus Vance',
    role: 'Founder & CEO',
    company: 'PulseFit Labs',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    quote: 'Working with Alex on our iOS app launch was seamless. He translated our design specs into smooth, responsive React Native code faster than expected.',
    rating: 5
  },
  {
    id: 't3',
    clientName: 'Elena Rostova',
    role: 'Engineering Director',
    company: 'Vanguard Labs',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    quote: 'Alex brings craftsmanship and deep technical rigor. He is the developer every team dreams of having.',
    rating: 5
  }
];

export const DEFAULT_MESSAGES: ContactMessage[] = [
  {
    id: 'm1',
    senderName: 'David Miller',
    senderEmail: 'david@enterprise.io',
    subject: 'Inquiry regarding Senior Architect Role',
    message: 'Hi Alex, loved your portfolio OS design! We have an exciting lead full-stack position for our cloud platform. Would love to schedule a call.',
    createdAt: '2026-07-20T14:22:00Z',
    read: false
  },
  {
    id: 'm2',
    senderName: 'Jessica Taylor',
    senderEmail: 'jessica@studio.design',
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
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    published: true
  }
];

export const DEFAULT_SETTINGS: OSSettings = {
  wallpaper: 'sleek-blue',
  accentColor: '#3b82f6',
  osMode: 'auto',
  soundEnabled: true,
  darkMode: true,
  adminUsername: 'admin',
  adminPasswordHash: 'admin123',
  visitorCount: 1284
};

export const SYSTEM_APPS: AppDefinition[] = [
  { id: 'about', title: 'About Me', iconName: 'User', category: 'core', color: '#3b82f6', bgGradient: 'from-blue-500 to-indigo-600' },
  { id: 'skills', title: 'Skills & Tech', iconName: 'Cpu', category: 'core', color: '#10b981', bgGradient: 'from-emerald-500 to-teal-600' },
  { id: 'projects', title: 'Projects', iconName: 'FolderGit2', category: 'portfolio', badge: '5', color: '#8b5cf6', bgGradient: 'from-purple-500 to-violet-600' },
  { id: 'experience', title: 'Experience', iconName: 'Briefcase', category: 'portfolio', color: '#f59e0b', bgGradient: 'from-amber-500 to-orange-600' },
  { id: 'testimonials', title: 'Testimonials', iconName: 'Star', category: 'portfolio', color: '#ec4899', bgGradient: 'from-pink-500 to-rose-600' },
  { id: 'contact', title: 'Contact Me', iconName: 'Mail', category: 'core', badge: 'Live', color: '#06b6d4', bgGradient: 'from-cyan-500 to-blue-600' },
  { id: 'blog', title: 'Notes & Blog', iconName: 'FileText', category: 'portfolio', color: '#6366f1', bgGradient: 'from-indigo-500 to-purple-600' },
  { id: 'terminal', title: 'CLI Terminal', iconName: 'Terminal', category: 'system', color: '#22c55e', bgGradient: 'from-green-600 to-emerald-800' },
  { id: 'settings', title: 'OS Settings', iconName: 'Settings', category: 'system', color: '#64748b', bgGradient: 'from-slate-500 to-slate-700' },
  { id: 'admin', title: 'Admin Panel', iconName: 'Shield', category: 'system', badge: 'Secured', color: '#ef4444', bgGradient: 'from-red-500 to-rose-700' }
];

export const WALLPAPERS = [
  { id: 'sleek-blue', name: 'Sleek Radial Gradient', url: 'radial-gradient(circle at top right, #1d4ed8, #1e3a8a, #001e3c)' },
  { id: 'bloom-blue', name: 'Windows Bloom Blue', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80' },
  { id: 'synthwave-cyber', name: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80' },
  { id: 'minimal-sunset', name: 'Minimalist Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80' },
  { id: 'ios-gradient', name: 'iOS Fluid Aurora', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80' },
  { id: 'obsidian-dark', name: 'Obsidian Geometric', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80' }
];
