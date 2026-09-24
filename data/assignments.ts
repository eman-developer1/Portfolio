import { Assignment } from '@/types';

export const assignments: Assignment[] = [
  {
    id: 'assignment-ecommerce-api',
    title: 'Full-Stack E-Commerce REST API & Auth',
    description: 'A modular backend assignment demonstrating user authentication, JWT session verification, product catalogs, shopping cart logic, and Stripe webhook integration.',
    category: 'Backend Development',
    technologies: ['Node.js', 'Express', 'Supabase', 'TypeScript', 'JWT'],
    assignmentDate: '2025',
    imageUrl: '/images/assignments/ecommerce-api.svg',
    fileUrl: '/images/assignments/ecommerce-api.svg',
    liveUrl: 'https://example.com/demo/ecommerce-api',
    githubUrl: 'https://github.com/eman-developer1/ecommerce-rest-api',
    status: 'Completed',
    featured: true
  },
  {
    id: 'assignment-algo-visualizer',
    title: 'Pathfinding & Sorting Algorithm Visualizer',
    description: 'An interactive frontend algorithm visualizer implementing Dijkstra, A* search, QuickSort, and MergeSort with real-time speed throttling and state exploration.',
    category: 'Frontend Engineering',
    technologies: ['React', 'TypeScript', 'CSS Modules', 'Algorithms'],
    assignmentDate: '2025',
    imageUrl: '/images/assignments/algo-visualizer.svg',
    fileUrl: '/images/assignments/algo-visualizer.svg',
    liveUrl: 'https://example.com/demo/algorithm-visualizer',
    githubUrl: 'https://github.com/eman-developer1/algorithm-visualizer',
    status: 'Completed',
    featured: true
  },
  {
    id: 'assignment-mongodb-crud',
    title: 'NoSQL Document Store & Aggregation Pipeline',
    description: 'An academic assignment focused on modeling non-relational database collections, indexing strategies, document validation, and complex data pipeline aggregations.',
    category: 'Database Systems',
    technologies: ['MongoDB', 'Mongoose', 'Node.js', 'Express'],
    assignmentDate: '2026',
    imageUrl: '/images/assignments/mongodb-crud.svg',
    fileUrl: '/images/assignments/mongodb-crud.svg',
    liveUrl: '',
    githubUrl: 'https://github.com/eman-developer1/mongodb-aggregation-lab',
    status: 'In Progress',
    featured: false
  }
];
