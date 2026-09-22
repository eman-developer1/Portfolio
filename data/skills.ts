import { Skill } from '@/types';

export const skills: Skill[] = [
  // Frontend
  {
    name: 'Next.js',
    category: 'frontend',
    iconName: 'Zap',
    description: 'Server-side rendering, App Router, API routes, and full-stack React performance optimization.'
  },
  {
    name: 'React.js',
    category: 'frontend',
    iconName: 'Code2',
    description: 'Component architecture, state management, custom hooks, and dynamic user interfaces.'
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    iconName: 'FileCode2',
    description: 'Strict typing, scalable interface design, generics, and compile-time error prevention.'
  },
  {
    name: 'JavaScript (ES6+)',
    category: 'frontend',
    iconName: 'Terminal',
    description: 'Modern asynchronous programming, DOM manipulation, closures, and modular code patterns.'
  },
  {
    name: 'HTML5',
    category: 'frontend',
    iconName: 'Layout',
    description: 'Semantic markup, accessible web standards (WCAG), and search engine optimization (SEO).'
  },
  {
    name: 'CSS3 / CSS Modules',
    category: 'frontend',
    iconName: 'Palette',
    description: 'Fluid responsive design, Flexbox, CSS Grid, custom properties, and smooth animations.'
  },

  // Backend
  {
    name: 'Node.js',
    category: 'backend',
    iconName: 'Server',
    description: 'Server runtime, RESTful API development, request handling, and backend services.'
  },
  {
    name: 'Supabase Backend',
    category: 'backend',
    iconName: 'ShieldCheck',
    description: 'User authentication, row-level security (RLS), and real-time database listeners.'
  },

  // Database
  {
    name: 'Supabase (PostgreSQL)',
    category: 'database',
    iconName: 'Database',
    description: 'Relational data modeling, secure queries, foreign keys, and cloud database administration.'
  },
  {
    name: 'MongoDB',
    category: 'database',
    iconName: 'Layers',
    description: 'NoSQL document storage, schemas, and aggregation pipelines.',
    status: 'Currently Learning'
  },

  // Tools
  {
    name: 'Git',
    category: 'tools',
    iconName: 'GitBranch',
    description: 'Version control, branch management, merge conflict resolution, and collaborative workflow.'
  },
  {
    name: 'GitHub',
    category: 'tools',
    iconName: 'Github',
    description: 'Remote repository hosting, issue tracking, pull requests, and CI/CD pipelines.'
  },
  {
    name: 'VS Code',
    category: 'tools',
    iconName: 'Laptop',
    description: 'Primary code editor configured with linting, debugging, and productivity workflows.'
  },
  {
    name: 'Antigravity IDE',
    category: 'tools',
    iconName: 'Cpu',
    description: 'Next-generation agentic AI developer environment for rapid building and workflow acceleration.'
  },
  {
    name: 'Vercel',
    category: 'tools',
    iconName: 'Cloud',
    description: 'Modern edge deployments, automatic previews, domain configuration, and continuous delivery.'
  }
];

export const skillCategories = [
  { key: 'all', label: 'All Technologies' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'database', label: 'Database' },
  { key: 'tools', label: 'Tools & Workflow' }
] as const;
