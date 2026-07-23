-- ============================================================
-- OS Portfolio — Seed Data
-- Populates all tables with default portfolio content
-- ============================================================

-- 1. PERSONAL INFO
-- ============================================================
INSERT INTO personal_info (id, name, title, tagline, bio, detailed_bio, avatar_url, location, email, phone, availability, resume_url, socials, metrics)
VALUES (
  1,
  'Naim Hossain',
  'Senior Full-Stack & Mobile Software Architect',
  'Designing high-performance web, mobile & cloud systems with OS-grade UI precision.',
  'Building smooth digital products across web, mobile, and desktop. Specialist in React, Next.js, Node.js, React Native, and Cloud Systems.',
  E'Hello! I''m Naim Hossain, a Software Developer & Architect based in San Francisco. With over 7 years of professional experience, I bridge the gap between high-performance backends and delightful frontend user interfaces.\n\nMy philosophy centers around crafting applications that feel native, responsive, and tactile. Whether building complex cloud management dashboards, cross-platform mobile apps, or high-throughput microservices, I prioritize scalable clean architecture and visual perfection.',
  '',
  'San Francisco, CA (Open to Remote)',
  'alex@rivera.dev',
  '+1 (555) 382-9014',
  'Available for Select Freelance & Full-time Opportunities',
  '#',
  '{"github":"https://github.com","linkedin":"https://linkedin.com","twitter":"https://x.com","devto":"https://dev.to","website":"https://alexrivera.dev"}',
  '{"yearsExp":7,"projectsCompleted":48,"satisfiedClients":32,"codeQualityRating":"99.8%"}'
)
ON CONFLICT (id) DO NOTHING;

-- 2. SKILLS
-- ============================================================
INSERT INTO skills (id, name, category, proficiency, icon_name, featured) VALUES
  ('10000000-0000-0000-0000-000000000001', 'React / React 19',            'Frontend',              98, 'Code',       true),
  ('10000000-0000-0000-0000-000000000002', 'TypeScript',                   'Frontend',              95, 'FileCode',   true),
  ('10000000-0000-0000-0000-000000000003', 'Next.js 15',                  'Frontend',              92, 'Globe',      true),
  ('10000000-0000-0000-0000-000000000004', 'Tailwind CSS v4',             'Frontend',              96, 'Palette',    true),
  ('10000000-0000-0000-0000-000000000005', 'Motion / Animation',           'Frontend',              90, 'Sparkles',   true),
  ('10000000-0000-0000-0000-000000000006', 'React Native / Expo',         'Mobile',                92, 'Smartphone', true),
  ('10000000-0000-0000-0000-000000000007', 'Swift / iOS SDK',             'Mobile',                82, 'Smartphone', false),
  ('10000000-0000-0000-0000-000000000008', 'Mobile UI / Gestures',        'Mobile',                90, 'Sliders',    true),
  ('10000000-0000-0000-0000-000000000009', 'Node.js & Express',           'Backend & Database',    94, 'Server',     true),
  ('10000000-0000-0000-0000-000000000010', 'PostgreSQL & Drizzle',        'Backend & Database',    88, 'Database',   true),
  ('10000000-0000-0000-0000-000000000011', 'GraphQL & REST APIs',         'Backend & Database',    91, 'Cpu',        false),
  ('10000000-0000-0000-0000-000000000012', 'Firebase & Firestore',        'Backend & Database',    93, 'Flame',      true),
  ('10000000-0000-0000-0000-000000000013', 'Docker & Containers',         'Cloud & DevOps',        86, 'Box',        true),
  ('10000000-0000-0000-0000-000000000014', 'AWS & Cloud Run',             'Cloud & DevOps',        85, 'Cloud',      false),
  ('10000000-0000-0000-0000-000000000015', 'CI/CD Pipelines',             'Cloud & DevOps',        88, 'RefreshCw',  false),
  ('10000000-0000-0000-0000-000000000016', 'Git & GitHub Actions',        'Tools & Methods',       95, 'GitBranch',  false),
  ('10000000-0000-0000-0000-000000000017', 'Figma to Code',               'Tools & Methods',       92, 'Figma',      true),
  ('10000000-0000-0000-0000-000000000018', 'Jest / Playwright Testing',   'Tools & Methods',       86, 'CheckCircle', false)
ON CONFLICT (id) DO NOTHING;

-- 3. PROJECTS
-- ============================================================
INSERT INTO projects (id, title, short_desc, full_desc, category, tech_stack, image_url, media, links, demo_url, github_url, featured, date, stars) VALUES
(
  '20000000-0000-0000-0000-000000000001',
  'Cloud Workspace OS',
  'Web-based virtual desktop environment with multi-window orchestration, file manager, and cloud apps.',
  'An ambitious browser-based operating system UI that emulates native desktop experience. Built with React, TypeScript, and Motion, it features draggable windows, taskbar system tray, file browser, terminal emulator, and custom cloud widgets.',
  'Full-Stack',
  ARRAY['React 19','TypeScript','Tailwind CSS','Motion','Express'],
  '', '[]'::jsonb, '[]'::jsonb, '#', '#', true, '2026-03', 342
  ),
  (
  '20000000-0000-0000-0000-000000000002',
  'PulseFit - iOS Health & Analytics',
  'Cross-platform mobile workout tracker featuring real-time telemetry, GPS routing, and sleep trends.',
  'PulseFit empowers fitness enthusiasts to monitor physical metrics in real time. Designed with iOS Human Interface Guidelines in mind, featuring haptic feedback, dark mode optics, offline persistence, and interactive chart visualizations.',
  'Mobile App',
  ARRAY['React Native','Expo','Recharts','TypeScript','Node.js'],
  '', '[]'::jsonb, '[]'::jsonb, '#', '#', true, '2025-11', 218
  ),
  (
  '20000000-0000-0000-0000-000000000003',
  'Nexus Microservice Gateway',
  'High-throughput API gateway with automated rate limiting, JWT validation, and GraphQL federation.',
  'Nexus Gateway sits in front of distributed services to handle security, request caching, rate throttling, and telemetry. Tested under heavy synthetic load handling 25,000 requests/sec with minimal latency overhead.',
  'Cloud & Systems',
  ARRAY['Node.js','Express','Redis','Docker','PostgreSQL'],
  '', '[]'::jsonb, '[]'::jsonb, '#', '#', true, '2025-08', 512
  ),
  (
  '20000000-0000-0000-0000-000000000004',
  'DevCanvas Realtime Whiteboard',
  'Interactive vector canvas with live multi-user collaboration, shape tools, and code snippet cards.',
  'A fast visual space built for remote engineering teams. Supports realtime websocket cursors, canvas zooming/panning, diagram export, and AI diagram generation.',
  'Frontend',
  ARRAY['React','HTML5 Canvas','WebSockets','Tailwind CSS'],
  '', '[]'::jsonb, '[]'::jsonb, '#', '#', false, '2025-04', 189
  ),
  (
  '20000000-0000-0000-0000-000000000005',
  'CyberCLI Tooling Suite',
  'Command line developer toolkit for rapid scaffolding, database migrations, and bundle diagnostics.',
  'Custom Node.js binary CLI tool used by over 10,000 developers. Features interactive prompt menus, color logs, fast template generation, and automated GitHub release checks.',
  'Open Source',
  ARRAY['TypeScript','Node.js','Commander.js','Esbuild'],
  '', '[]'::jsonb, '[]'::jsonb, 'https://example.com/cybercli', 'https://github.com/example/cybercli', true, '2024-12', 840
)
ON CONFLICT (id) DO NOTHING;

-- 4. EXPERIENCE
-- ============================================================
INSERT INTO experience (id, company, role, period, location, description, achievements, technologies) VALUES
(
  '30000000-0000-0000-0000-000000000001',
  'Apex Tech Systems', 'Lead Full-Stack Engineer', '2023 - Present', 'San Francisco, CA',
  'Spearheaded frontend and backend architecture for cloud SaaS applications serving over 500k monthly active users.',
  ARRAY['Engineered an OS-styled web workspace that boosted user daily engagement by 34%.','Reduced server API latency by 45% using Node.js Redis caching and optimized PostgreSQL queries.','Mentored a team of 8 engineers and introduced automated end-to-end CI/CD testing.'],
  ARRAY['React','TypeScript','Node.js','AWS','Docker','PostgreSQL']
),
(
  '30000000-0000-0000-0000-000000000002',
  'Vanguard Mobile Labs', 'Senior Mobile & React Engineer', '2021 - 2023', 'San Jose, CA',
  'Architected iOS and Android cross-platform mobile apps for high-growth tech startups.',
  ARRAY['Published 4 top-rated iOS/Android apps with average App Store rating of 4.8 stars.','Implemented smooth 60fps animations and offline sync using React Native and SQLite.','Collaborated closely with product designers to implement pixel-perfect Figma components.'],
  ARRAY['React Native','Expo','TypeScript','Redux','Firebase','Swift']
),
(
  '30000000-0000-0000-0000-000000000003',
  'PixelCraft Creative Agency', 'Frontend Web Developer', '2019 - 2021', 'Remote',
  'Developed highly interactive client web applications, e-commerce portals, and interactive portfolios.',
  ARRAY['Delivered 25+ bespoke websites for enterprise and SMB clients on tight timelines.','Achieved 98+ Lighthouse performance scores across all client sites.'],
  ARRAY['React','JavaScript','Tailwind CSS','REST APIs','Figma']
)
ON CONFLICT (id) DO NOTHING;

-- 5. EDUCATION
-- ============================================================
INSERT INTO education (id, institution, degree, field, year, grade, highlights) VALUES
(
  '40000000-0000-0000-0000-000000000001',
  'University of California, Berkeley',
  'Bachelor of Science (B.S.)',
  'Computer Science & Software Systems',
  '2015 - 2019',
  '3.85 GPA',
  ARRAY['Dean''s Honor List for 6 consecutive semesters.','President of the Computer Science & Web Engineering Club.','Published undergrad research paper on Distributed Systems optimization.']
)
ON CONFLICT (id) DO NOTHING;

-- 6. TESTIMONIALS
-- ============================================================
INSERT INTO testimonials (id, client_name, role, company, avatar_url, quote, rating) VALUES
(
  '50000000-0000-0000-0000-000000000001',
  'Sarah Jenkins', 'VP of Product', 'Apex Tech Systems', '',
  'Alex is an exceptional engineer. His ability to deliver complex OS-grade user experiences with speed and precision is unmatched. Highly recommended!',
  5
),
(
  '50000000-0000-0000-0000-000000000002',
  'Marcus Vance', 'Founder & CEO', 'PulseFit Labs', '',
  'Working with Alex on our iOS app launch was seamless. He translated our design specs into smooth, responsive React Native code faster than expected.',
  5
),
(
  '50000000-0000-0000-0000-000000000003',
  'Elena Rostova', 'Engineering Director', 'Vanguard Labs', '',
  'Alex brings craftsmanship and deep technical rigor. He is the developer every team dreams of having.',
  5
)
ON CONFLICT (id) DO NOTHING;

-- 7. CONTACT MESSAGES (sample messages)
-- ============================================================
INSERT INTO contact_messages (id, sender_name, sender_email, whatsapp, subject, message, created_at, read) VALUES
(
  '60000000-0000-0000-0000-000000000001',
  'David Miller', 'david@enterprise.io', '+14155551234', 'Inquiry regarding Senior Architect Role',
  'Hi Alex, loved your portfolio OS design! We have an exciting lead full-stack position for our cloud platform. Would love to schedule a call.',
  '2026-07-20T14:22:00Z', false
),
(
  '60000000-0000-0000-0000-000000000002',
  'Jessica Taylor', 'jessica@studio.design', '+8801712345678', 'Freelance Project Consultation',
  'Hey Alex! We need a high-end web app with custom desktop-like drag and drop interactions for a client campaign. Are you open for freelance work next month?',
  '2026-07-18T09:15:00Z', true
)
ON CONFLICT (id) DO NOTHING;

-- 8. BLOG POSTS
-- ============================================================
INSERT INTO blog_posts (id, title, slug, tag, excerpt, content, read_time, date, cover_image, published) VALUES
(
  '70000000-0000-0000-0000-000000000001',
  'Building OS-Grade Desktop UIs in React 19',
  'building-os-grade-desktop-uis',
  'Architecture',
  'How to handle z-index layers, drag handles, window snapping, and virtual taskbars in modern web apps.',
  E'Creating desktop-like user experiences in web browsers requires careful state management and fluid motion mechanics.\n\n### Key Considerations:\n1. **Z-Index Layer Management**: Window focus order must dynamically update whenever a user clicks or drags a window.\n2. **Performance Constraints**: Using hardware-accelerated transforms (CSS translate) instead of top/left positioning for 60fps window movement.\n3. **Responsive Degradation**: Gracefully adapting desktop layouts into mobile tabbed/sheet experiences.',
  '5 min read',
  'July 15, 2026',
  '',
  true
),
(
  '70000000-0000-0000-0000-000000000002',
  'React Native vs Native Swift in 2026',
  'react-native-vs-swift-2026',
  'Mobile Development',
  'An in-depth benchmark comparison of cross-platform React Native performance against iOS Swift.',
  E'With the arrival of React Native''s New Architecture (Fabric & TurboModules), cross-platform mobile apps are closer to pure native performance than ever.\n\nIn this benchmark study, we test gesture responsiveness, cold boot time, and memory footprint across complex dashboard applications.',
  '8 min read',
  'June 28, 2026',
  '',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 9. SETTINGS
-- ============================================================
INSERT INTO settings (id, wallpaper, lock_wallpaper, accent_color, os_mode, sound_enabled, dark_mode, visitor_count)
VALUES (
  1,
  'win10-hero', 'ios-fluid', '#3b82f6', 'auto', true, true, 1284
)
ON CONFLICT (id) DO NOTHING;
