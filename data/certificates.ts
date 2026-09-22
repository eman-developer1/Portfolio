import { Certificate } from '@/types';

export const certificates: Certificate[] = [
  {
    id: 'cert-nextjs-fullstack',
    title: 'Modern Next.js & React Full-Stack Architecture',
    issuer: 'Professional Developer Training',
    date: '2025',
    credentialId: 'CERT-EK-98241',
    image: '/images/certificates/nextjs-fullstack-cert.svg',
    verificationUrl: 'https://example.com/verify/CERT-EK-98241',
    skillsCovered: ['Next.js App Router', 'React 19', 'TypeScript', 'Server Actions', 'SSR & SSG']
  },
  {
    id: 'cert-typescript-mastery',
    title: 'TypeScript Professional Development',
    issuer: 'Web Engineering Institute',
    date: '2025',
    credentialId: 'CERT-EK-77319',
    image: '/images/certificates/typescript-cert.svg',
    verificationUrl: 'https://example.com/verify/CERT-EK-77319',
    skillsCovered: ['Strict TypeScript', 'Generics', 'Utility Types', 'Component Typing', 'State Modeling']
  },
  {
    id: 'cert-fullstack-web-dev',
    title: 'Complete Modern Web Development & Backend Services',
    issuer: 'Tech Academy Global',
    date: '2024',
    credentialId: 'CERT-EK-55102',
    image: '/images/certificates/web-dev-cert.svg',
    verificationUrl: 'https://example.com/verify/CERT-EK-55102',
    skillsCovered: ['HTML5 & CSS3', 'JavaScript ES6+', 'Node.js', 'REST APIs', 'Supabase']
  }
];
