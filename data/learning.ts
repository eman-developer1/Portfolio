import { LearningItem } from '@/types';

export const learningItems: LearningItem[] = [
  {
    id: 'mongodb-learning',
    title: 'MongoDB',
    subtitle: 'Database & NoSQL Document Modeling',
    description: 'Currently learning MongoDB and expanding my database knowledge.',
    iconName: 'Database',
    topics: [
      'Document schemas & BSON structures',
      'Mongoose ODM & model validation',
      'CRUD operations & indexing strategies',
      'Aggregation pipelines for analytics'
    ],
    status: 'In Progress'
  },
  {
    id: 'backend-learning',
    title: 'Backend Development',
    subtitle: 'Node.js & Supabase Architecture',
    description: 'Currently strengthening backend development with Node.js and Supabase.',
    iconName: 'Server',
    topics: [
      'REST API design patterns & middleware',
      'Row Level Security (RLS) policies in Supabase',
      'Secure session authentication & JWT handling',
      'Database relations, joins & edge functions'
    ],
    status: 'In Progress'
  }
];

export const journeyMilestones = [
  { step: '01', name: 'HTML & CSS', desc: 'Semantic layouts, Flexbox, Grid & responsive design', status: 'completed' },
  { step: '02', name: 'JavaScript', desc: 'ES6+, DOM interactions, async/await & APIs', status: 'completed' },
  { step: '03', name: 'React', desc: 'Component architecture, hooks & reactive state', status: 'completed' },
  { step: '04', name: 'TypeScript', desc: 'Static typing, interfaces & compile-time safety', status: 'completed' },
  { step: '05', name: 'Next.js', desc: 'App Router, SSR, SSG & performance engineering', status: 'completed' },
  { step: '06', name: 'Node.js', desc: 'Server environments, REST APIs & backend logic', status: 'completed' },
  { step: '07', name: 'Supabase', desc: 'Auth, PostgreSQL cloud database & realtime sync', status: 'completed' },
  { step: '08', name: 'MongoDB', desc: 'Expanding into NoSQL document data modeling', status: 'current' }
];
