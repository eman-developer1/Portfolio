export type SkillCategory = 'frontend' | 'backend' | 'database' | 'tools';

export interface Skill {
  id?: string;
  name: string;
  category: SkillCategory;
  iconName: string;
  description: string;
  status?: 'Currently Learning' | 'Active' | 'Learning' | 'Intermediate' | 'Advanced';
  displayOrder?: number;
  createdAt?: string;
}

export type ProjectCategory = 'all' | 'frontend' | 'react' | 'nextjs' | 'fullstack' | 'other';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  category: ProjectCategory;
  image: string;
  liveUrl: string;
  githubUrl: string;
  featured?: boolean;
  status?: 'published' | 'draft';
  displayOrder?: number;
  createdAt?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  highlights: string[];
  active?: boolean;
  displayOrder?: number;
  createdAt?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  image: string;
  verificationUrl?: string;
  skillsCovered: string[];
  description?: string;
  fileUrl?: string;
  status?: 'active' | 'archived';
  displayOrder?: number;
  createdAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  assignmentDate: string;
  imageUrl?: string;
  fileUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  status: 'Completed' | 'In Progress';
  featured?: boolean;
  displayOrder?: number;
  createdAt?: string;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'email' | 'whatsapp' | 'instagram' | 'facebook';
  label: string;
  url: string;
  displayValue: string;
  iconName: string;
}

export interface LearningItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  topics: string[];
  status: 'In Progress';
}

export interface PortfolioSettings {
  name: string;
  professionalTitle: string;
  bio: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  availabilityStatus?: string;
  customContactNotice?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  heroHeading?: string;
  heroDescription?: string;
  profileImageUrl?: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: string;
}
