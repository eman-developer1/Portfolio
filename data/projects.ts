import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'restaurant-management-system',
    title: 'Restaurant Management System',
    description: 'A modern restaurant management and ordering platform with menu management, authentication, orders and dashboard functionality.',
    longDescription: 'A comprehensive full-stack solution tailored for modern eateries. The application empowers staff and managers with real-time order processing, dynamic digital menu catalogs, table reservation tracking, and an intuitive administrative analytics dashboard to monitor daily sales and inventory.',
    features: [
      'Interactive digital menu with category filtering and instant price updates',
      'Real-time order queue with Supabase live event streaming',
      'Role-based access control for cashier, kitchen staff, and managers',
      'Revenue overview and sales performance metrics dashboard',
      'Responsive design optimized for both POS tablets and mobile screens'
    ],
    technologies: ['React', 'Node.js', 'Supabase', 'TypeScript', 'CSS Modules'],
    category: 'fullstack',
    image: '/images/projects/restaurant-system.svg',
    liveUrl: 'https://example.com/demo/restaurant-system',
    githubUrl: 'https://github.com/eman-developer1/restaurant-management-system',
    featured: true
  },
  {
    id: 'car-report-platform',
    title: 'Car Report Platform',
    description: 'A modern platform concept for managing and accessing vehicle report information.',
    longDescription: 'An enterprise-grade web application engineered to simplify vehicle history lookups and diagnostic report archiving. Built with Next.js App Router and PostgreSQL on Supabase, the platform delivers instant VIN lookups, report generation, and sleek data visualizations.',
    features: [
      'Instant VIN lookup and structured accident/mileage history rendering',
      'PDF inspection report download and cloud archiving',
      'Secure customer authentication and saved report bookmarking',
      'High-performance server-rendered Next.js pages with fast load times',
      'Interactive inspection checklist and damage evaluation diagrams'
    ],
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Lucide React'],
    category: 'nextjs',
    image: '/images/projects/car-report.svg',
    liveUrl: 'https://example.com/demo/car-report-platform',
    githubUrl: 'https://github.com/eman-developer1/car-report-platform',
    featured: true
  },
  {
    id: 'developer-portfolio',
    title: 'Developer Portfolio',
    description: 'A responsive developer portfolio showcasing projects, skills and certifications.',
    longDescription: 'A high-performance, polished developer showcase crafted with Next.js, TypeScript, and pure CSS Modules. Features modular architecture, accessible modal dialogs, dark/light theme persistence, smooth scroll choreography, and an interactive developer learning journey.',
    features: [
      'Zero-layout-shift responsive design across all screen sizes (320px to 4K)',
      'Accessible interactive modals with keyboard navigation and focus management',
      'Theme engine supporting persistent dark and light modes',
      'Modular architecture with clean separation of data, types, and presentation',
      'Interactive code editor mock visual with live code snippet display'
    ],
    technologies: ['Next.js', 'TypeScript', 'CSS Modules', 'React 19'],
    category: 'nextjs',
    image: '/images/projects/portfolio-showcase.svg',
    liveUrl: 'https://emankhan.dev',
    githubUrl: 'https://github.com/eman-developer1/portfolio',
    featured: true
  },
  {
    id: 'interactive-task-dashboard',
    title: 'CloudFlow Task & Team Hub',
    description: 'A responsive project coordination board with drag-and-drop workflow and team metrics.',
    longDescription: 'An intuitive workspace board designed for agile engineering teams. Offers Kanban board organization, task prioritization, activity logs, and real-time state synchronization.',
    features: [
      'Drag-and-drop column status transitions with immediate UI feedback',
      'Tagging, due dates, priority markers, and subtask progress tracking',
      'Dark modern interface with fluid micro-interactions',
      'Optimistic state updates for a zero-lag user experience'
    ],
    technologies: ['React', 'TypeScript', 'CSS Modules', 'Node.js'],
    category: 'react',
    image: '/images/projects/task-dashboard.svg',
    liveUrl: 'https://example.com/demo/cloudflow-tasks',
    githubUrl: 'https://github.com/eman-developer1/cloudflow-tasks'
  },
  {
    id: 'modern-saas-landing',
    title: 'Apex Analytics Landing Experience',
    description: 'A high-converting, performance-tuned landing page with glassmorphism and subtle interactions.',
    longDescription: 'A modern marketing showcase engineered for maximum engagement and lightning-fast Core Web Vitals scores. Built with responsive grid layouts, SVG charts, and interactive pricing calculators.',
    features: [
      'Near-perfect 100 Lighthouse performance and accessibility scores',
      'Interactive billing cycle tier selector with dynamic pricing updates',
      'Refined glassmorphism cards and smooth entrance transitions',
      'Fully responsive fluid typography and clean visual hierarchy'
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'CSS Modules'],
    category: 'frontend',
    image: '/images/projects/saas-landing.svg',
    liveUrl: 'https://example.com/demo/apex-analytics',
    githubUrl: 'https://github.com/eman-developer1/apex-analytics'
  }
];

export const projectFilterCategories = [
  { key: 'all', label: 'All Projects' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'react', label: 'React' },
  { key: 'nextjs', label: 'Next.js' },
  { key: 'fullstack', label: 'Full Stack' }
] as const;
