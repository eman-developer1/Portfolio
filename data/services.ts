import { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'business-websites',
    title: 'Business Websites',
    description: 'Modern responsive websites for businesses and brands.',
    iconName: 'Globe',
    highlights: [
      'Custom bespoke UI reflecting your unique brand identity',
      'Mobile-first responsive architecture across all display sizes',
      'SEO optimization, meta tags, and high-speed loading'
    ]
  },
  {
    id: 'landing-pages',
    title: 'Landing Pages',
    description: 'Modern landing pages designed for performance and responsiveness.',
    iconName: 'Rocket',
    highlights: [
      'Conversion-focused visual structure and strategic CTAs',
      'Ultra-fast First Contentful Paint and Core Web Vitals',
      'Engaging micro-interactions and smooth scroll sections'
    ]
  },
  {
    id: 'react-applications',
    title: 'React Applications',
    description: 'Interactive applications using React and TypeScript.',
    iconName: 'Code2',
    highlights: [
      'Clean component modularity and predictable state flow',
      'TypeScript type safety preventing runtime bugs',
      'Rich client-side interactivity and asynchronous API fetching'
    ]
  },
  {
    id: 'nextjs-websites',
    title: 'Next.js Websites',
    description: 'Modern web applications and websites using Next.js.',
    iconName: 'Zap',
    highlights: [
      'App Router architecture with React Server Components',
      'Server-Side Rendering (SSR) & Static Site Generation (SSG)',
      'Optimized asset loading and edge deployment readiness'
    ]
  },
  {
    id: 'admin-dashboards',
    title: 'Admin Dashboards',
    description: 'Clean and functional dashboards for business applications.',
    iconName: 'BarChart3',
    highlights: [
      'Intuitive data tables, filters, and state visualizations',
      'Secure authentication workflows and role-based views',
      'Responsive multi-screen layouts with expandable navigation'
    ]
  },
  {
    id: 'full-stack-applications',
    title: 'Full-Stack Applications',
    description: 'Modern frontend and backend applications.',
    iconName: 'Layers',
    highlights: [
      'Seamless frontend integration with Node.js and Supabase',
      'Secure database queries, schema design, and RLS',
      'REST API design, error boundaries, and end-to-end reliability'
    ]
  }
];
