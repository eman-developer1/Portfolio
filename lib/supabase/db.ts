import { supabase, isSupabaseConfigured } from './client';
import { Certificate, Project, Assignment, Skill, Service, PortfolioSettings } from '@/types';
import { certificates as initialCertificates } from '@/data/certificates';
import { projects as initialProjects } from '@/data/projects';
import { assignments as initialAssignments } from '@/data/assignments';
import { skills as initialSkills } from '@/data/skills';
import { services as initialServices } from '@/data/services';
import { personalInfo } from '@/data/socials';

// Local storage helper for fallback/demo mode
const getLocalData = <T>(key: string, fallback: T[]): T[] => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`ek_portfolio_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalData = <T>(key: string, data: T[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`ek_portfolio_${key}`, JSON.stringify(data));
    } catch {
      // ignore
    }
  }
};

// ==========================================
// 1. DASHBOARD STATS
// ==========================================
export interface DashboardStatsData {
  totalProjects: number;
  totalCertificates: number;
  totalAssignments: number;
  totalSkills: number;
  recentActivity: {
    type: 'Certificate' | 'Project' | 'Assignment';
    title: string;
    date: string;
  }[];
}

export const getDashboardStats = async (): Promise<DashboardStatsData> => {
  if (!isSupabaseConfigured) {
    const certs = getLocalData('certificates', initialCertificates);
    const projs = getLocalData('projects', initialProjects);
    const assigns = getLocalData('assignments', initialAssignments);
    const skls = getLocalData('skills', initialSkills);

    return {
      totalProjects: projs.length,
      totalCertificates: certs.length,
      totalAssignments: assigns.length,
      totalSkills: skls.length,
      recentActivity: [
        { type: 'Certificate', title: certs[0]?.title || 'Next.js Full-Stack', date: 'Recently added' },
        { type: 'Project', title: projs[0]?.title || 'Restaurant Management System', date: 'Recently updated' },
        { type: 'Assignment', title: assigns[0]?.title || 'E-Commerce REST API', date: 'Recently added' },
      ]
    };
  }

  try {
    const [
      { count: projectsCount },
      { count: certificatesCount },
      { count: assignmentsCount },
      { count: skillsCount }
    ] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('certificates').select('*', { count: 'exact', head: true }),
      supabase.from('assignments').select('*', { count: 'exact', head: true }),
      supabase.from('skills').select('*', { count: 'exact', head: true })
    ]);

    const { data: recentCerts } = await supabase.from('certificates').select('title, created_at').order('created_at', { ascending: false }).limit(1);
    const { data: recentProjs } = await supabase.from('projects').select('title, created_at').order('created_at', { ascending: false }).limit(1);
    const { data: recentAssigns } = await supabase.from('assignments').select('title, created_at').order('created_at', { ascending: false }).limit(1);

    const activity: DashboardStatsData['recentActivity'] = [];
    if (recentCerts?.[0]) activity.push({ type: 'Certificate', title: recentCerts[0].title, date: 'Recent' });
    if (recentProjs?.[0]) activity.push({ type: 'Project', title: recentProjs[0].title, date: 'Recent' });
    if (recentAssigns?.[0]) activity.push({ type: 'Assignment', title: recentAssigns[0].title, date: 'Recent' });

    return {
      totalProjects: projectsCount || 0,
      totalCertificates: certificatesCount || 0,
      totalAssignments: assignmentsCount || 0,
      totalSkills: skillsCount || 0,
      recentActivity: activity
    };
  } catch {
    return {
      totalProjects: 0,
      totalCertificates: 0,
      totalAssignments: 0,
      totalSkills: 0,
      recentActivity: []
    };
  }
};

// ==========================================
// 2. CERTIFICATES CRUD
// ==========================================
export const getCertificates = async (): Promise<Certificate[]> => {
  if (!isSupabaseConfigured) {
    return getLocalData('certificates', initialCertificates);
  }

  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalData('certificates', initialCertificates);
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      issuer: item.organization,
      description: item.description || '',
      date: item.issue_date,
      credentialId: item.credential_id || '',
      image: item.file_url,
      fileUrl: item.file_url,
      verificationUrl: item.certificate_url || '',
      skillsCovered: item.skills_covered || [],
      status: item.status as 'active' | 'archived',
      displayOrder: item.display_order,
      createdAt: item.created_at
    }));
  } catch {
    return getLocalData('certificates', initialCertificates);
  }
};

export const saveCertificate = async (cert: Omit<Certificate, 'id'> & { id?: string }): Promise<Certificate> => {
  if (!isSupabaseConfigured) {
    const items = getLocalData('certificates', initialCertificates);
    let saved: Certificate;
    if (cert.id) {
      saved = { ...cert, id: cert.id } as Certificate;
      const updated = items.map((c) => (c.id === cert.id ? saved : c));
      setLocalData('certificates', updated);
    } else {
      saved = { ...cert, id: `cert-${Date.now()}` } as Certificate;
      setLocalData('certificates', [saved, ...items]);
    }
    return saved;
  }

  const payload = {
    title: cert.title,
    organization: cert.issuer,
    description: cert.description || '',
    issue_date: cert.date,
    credential_id: cert.credentialId || '',
    certificate_url: cert.verificationUrl || '',
    file_url: cert.image || cert.fileUrl,
    skills_covered: cert.skillsCovered || [],
    status: cert.status || 'active',
    display_order: cert.displayOrder || 0,
    updated_at: new Date().toISOString()
  };

  if (cert.id && !cert.id.startsWith('cert-')) {
    const { data, error } = await supabase
      .from('certificates')
      .update(payload)
      .eq('id', cert.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      issuer: data.organization,
      description: data.description,
      date: data.issue_date,
      credentialId: data.credential_id,
      image: data.file_url,
      verificationUrl: data.certificate_url,
      skillsCovered: data.skills_covered,
      status: data.status,
      displayOrder: data.display_order
    };
  } else {
    const { data, error } = await supabase
      .from('certificates')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      issuer: data.organization,
      description: data.description,
      date: data.issue_date,
      credentialId: data.credential_id,
      image: data.file_url,
      verificationUrl: data.certificate_url,
      skillsCovered: data.skills_covered,
      status: data.status,
      displayOrder: data.display_order
    };
  }
};

export const deleteCertificate = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    const items = getLocalData('certificates', initialCertificates);
    setLocalData('certificates', items.filter((c) => c.id !== id));
    return;
  }

  const { error } = await supabase.from('certificates').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// ==========================================
// 3. PROJECTS CRUD
// ==========================================
export const getProjects = async (): Promise<Project[]> => {
  if (!isSupabaseConfigured) {
    return getLocalData('projects', initialProjects);
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalData('projects', initialProjects);
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.short_description,
      longDescription: item.description,
      image: item.image_url,
      technologies: item.technologies || [],
      category: item.category,
      liveUrl: item.live_url || '',
      githubUrl: item.github_url || '',
      features: item.features || [],
      featured: item.featured,
      status: item.status,
      displayOrder: item.display_order
    }));
  } catch {
    return getLocalData('projects', initialProjects);
  }
};

export const saveProject = async (project: Omit<Project, 'id'> & { id?: string }): Promise<Project> => {
  if (!isSupabaseConfigured) {
    const items = getLocalData('projects', initialProjects);
    let saved: Project;
    if (project.id) {
      saved = { ...project, id: project.id } as Project;
      setLocalData('projects', items.map((p) => (p.id === project.id ? saved : p)));
    } else {
      saved = { ...project, id: `proj-${Date.now()}` } as Project;
      setLocalData('projects', [saved, ...items]);
    }
    return saved;
  }

  const payload = {
    title: project.title,
    short_description: project.description,
    description: project.longDescription || project.description,
    image_url: project.image,
    technologies: project.technologies || [],
    category: project.category,
    live_url: project.liveUrl || '',
    github_url: project.githubUrl || '',
    features: project.features || [],
    featured: Boolean(project.featured),
    status: project.status || 'published',
    display_order: project.displayOrder || 0,
    updated_at: new Date().toISOString()
  };

  if (project.id && !project.id.startsWith('proj-') && !project.id.includes('-')) {
    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', project.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      description: data.short_description,
      longDescription: data.description,
      image: data.image_url,
      technologies: data.technologies,
      category: data.category,
      liveUrl: data.live_url,
      githubUrl: data.github_url,
      features: data.features,
      featured: data.featured,
      status: data.status
    };
  } else {
    const { data, error } = await supabase
      .from('projects')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      description: data.short_description,
      longDescription: data.description,
      image: data.image_url,
      technologies: data.technologies,
      category: data.category,
      liveUrl: data.live_url,
      githubUrl: data.github_url,
      features: data.features,
      featured: data.featured,
      status: data.status
    };
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    const items = getLocalData('projects', initialProjects);
    setLocalData('projects', items.filter((p) => p.id !== id));
    return;
  }

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// ==========================================
// 4. ASSIGNMENTS CRUD
// ==========================================
export const getAssignments = async (): Promise<Assignment[]> => {
  if (!isSupabaseConfigured) {
    return getLocalData('assignments', initialAssignments);
  }

  try {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalData('assignments', initialAssignments);
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      technologies: item.technologies || [],
      assignmentDate: item.assignment_date,
      imageUrl: item.image_url || '',
      fileUrl: item.file_url || '',
      liveUrl: item.live_url || '',
      githubUrl: item.github_url || '',
      status: item.status as 'Completed' | 'In Progress',
      featured: item.featured,
      displayOrder: item.display_order
    }));
  } catch {
    return getLocalData('assignments', initialAssignments);
  }
};

export const saveAssignment = async (assignment: Omit<Assignment, 'id'> & { id?: string }): Promise<Assignment> => {
  if (!isSupabaseConfigured) {
    const items = getLocalData('assignments', initialAssignments);
    let saved: Assignment;
    if (assignment.id) {
      saved = { ...assignment, id: assignment.id } as Assignment;
      setLocalData('assignments', items.map((a) => (a.id === assignment.id ? saved : a)));
    } else {
      saved = { ...assignment, id: `assign-${Date.now()}` } as Assignment;
      setLocalData('assignments', [saved, ...items]);
    }
    return saved;
  }

  const payload = {
    title: assignment.title,
    description: assignment.description,
    category: assignment.category,
    technologies: assignment.technologies || [],
    assignment_date: assignment.assignmentDate,
    image_url: assignment.imageUrl || '',
    file_url: assignment.fileUrl || '',
    live_url: assignment.liveUrl || '',
    github_url: assignment.githubUrl || '',
    status: assignment.status || 'Completed',
    featured: Boolean(assignment.featured),
    display_order: assignment.displayOrder || 0,
    updated_at: new Date().toISOString()
  };

  if (assignment.id && !assignment.id.startsWith('assign-') && !assignment.id.includes('-')) {
    const { data, error } = await supabase
      .from('assignments')
      .update(payload)
      .eq('id', assignment.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      technologies: data.technologies,
      assignmentDate: data.assignment_date,
      imageUrl: data.image_url,
      fileUrl: data.file_url,
      liveUrl: data.live_url,
      githubUrl: data.github_url,
      status: data.status,
      featured: data.featured
    };
  } else {
    const { data, error } = await supabase
      .from('assignments')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      technologies: data.technologies,
      assignmentDate: data.assignment_date,
      imageUrl: data.image_url,
      fileUrl: data.file_url,
      liveUrl: data.live_url,
      githubUrl: data.github_url,
      status: data.status,
      featured: data.featured
    };
  }
};

export const deleteAssignment = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    const items = getLocalData('assignments', initialAssignments);
    setLocalData('assignments', items.filter((a) => a.id !== id));
    return;
  }

  const { error } = await supabase.from('assignments').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// ==========================================
// 5. SKILLS CRUD
// ==========================================
export const getSkills = async (): Promise<Skill[]> => {
  if (!isSupabaseConfigured) {
    return getLocalData('skills', initialSkills);
  }

  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalData('skills', initialSkills);
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      iconName: item.icon,
      description: item.description,
      status: item.status === 'Learning' ? 'Currently Learning' : item.status,
      displayOrder: item.display_order
    }));
  } catch {
    return getLocalData('skills', initialSkills);
  }
};

export const saveSkill = async (skill: Omit<Skill, 'id'> & { id?: string }): Promise<Skill> => {
  if (!isSupabaseConfigured) {
    const items = getLocalData('skills', initialSkills);
    let saved: Skill;
    if (skill.id) {
      saved = { ...skill, id: skill.id };
      setLocalData('skills', items.map((s) => (s.id === skill.id || s.name === skill.name ? saved : s)));
    } else {
      saved = { ...skill, id: `skill-${Date.now()}` };
      setLocalData('skills', [saved, ...items]);
    }
    return saved;
  }

  const statusVal = skill.status === 'Currently Learning' ? 'Learning' : (skill.status || 'Intermediate');
  const payload = {
    name: skill.name,
    category: skill.category,
    description: skill.description,
    icon: skill.iconName,
    status: statusVal,
    display_order: skill.displayOrder || 0,
    updated_at: new Date().toISOString()
  };

  if (skill.id && !skill.id.startsWith('skill-')) {
    const { data, error } = await supabase.from('skills').update(payload).eq('id', skill.id).select().single();
    if (error) throw new Error(error.message);
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      iconName: data.icon,
      description: data.description,
      status: data.status === 'Learning' ? 'Currently Learning' : data.status,
      displayOrder: data.display_order
    };
  } else {
    const { data, error } = await supabase.from('skills').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      iconName: data.icon,
      description: data.description,
      status: data.status === 'Learning' ? 'Currently Learning' : data.status,
      displayOrder: data.display_order
    };
  }
};

export const deleteSkill = async (id: string, name?: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    const items = getLocalData('skills', initialSkills);
    setLocalData('skills', items.filter((s) => s.id !== id && s.name !== name));
    return;
  }

  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// ==========================================
// 6. SERVICES CRUD
// ==========================================
export const getServices = async (): Promise<Service[]> => {
  if (!isSupabaseConfigured) {
    return getLocalData('services', initialServices);
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalData('services', initialServices);
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      iconName: item.icon,
      highlights: item.highlights || [],
      active: item.active,
      displayOrder: item.display_order
    }));
  } catch {
    return getLocalData('services', initialServices);
  }
};

export const saveService = async (service: Omit<Service, 'id'> & { id?: string }): Promise<Service> => {
  if (!isSupabaseConfigured) {
    const items = getLocalData('services', initialServices);
    let saved: Service;
    if (service.id) {
      saved = { ...service, id: service.id };
      setLocalData('services', items.map((s) => (s.id === service.id ? saved : s)));
    } else {
      saved = { ...service, id: `serv-${Date.now()}` };
      setLocalData('services', [saved, ...items]);
    }
    return saved;
  }

  const payload = {
    title: service.title,
    description: service.description,
    icon: service.iconName,
    highlights: service.highlights || [],
    active: service.active ?? true,
    display_order: service.displayOrder || 0,
    updated_at: new Date().toISOString()
  };

  if (service.id && !service.id.startsWith('serv-')) {
    const { data, error } = await supabase.from('services').update(payload).eq('id', service.id).select().single();
    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      iconName: data.icon,
      highlights: data.highlights,
      active: data.active,
      displayOrder: data.display_order
    };
  } else {
    const { data, error } = await supabase.from('services').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      iconName: data.icon,
      highlights: data.highlights,
      active: data.active,
      displayOrder: data.display_order
    };
  }
};

export const deleteService = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    const items = getLocalData('services', initialServices);
    setLocalData('services', items.filter((s) => s.id !== id));
    return;
  }

  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// ==========================================
// 7. PORTFOLIO SETTINGS CRUD
// ==========================================
export const getPortfolioSettings = async (): Promise<PortfolioSettings> => {
  const fallbackSettings: PortfolioSettings = {
    name: personalInfo.name,
    professionalTitle: personalInfo.role,
    bio: personalInfo.bio,
    email: 'contact.emankhan@example.com',
    phone: '+1 (234) 567-890',
    whatsapp: '+1 (234) 567-890',
    location: personalInfo.location,
    availabilityStatus: 'Available for freelance & full-time roles',
    customContactNotice: 'All inquiries receive prompt responses within 24 business hours.',
    heroHeading: personalInfo.headline,
    heroDescription: personalInfo.bio,
    profileImageUrl: '/images/profile/avatar.svg',
    githubUrl: 'https://github.com/emankhan-dev',
    linkedinUrl: 'https://linkedin.com/in/eman-khan-dev'
  };

  if (!isSupabaseConfigured) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ek_portfolio_settings');
      if (stored) return JSON.parse(stored);
    }
    return fallbackSettings;
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('*')
      .eq('id', 'primary')
      .single();

    if (error || !data) return fallbackSettings;

    return {
      name: data.name,
      professionalTitle: data.professional_title,
      bio: data.bio,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      location: data.location,
      availabilityStatus: data.availability_status || fallbackSettings.availabilityStatus,
      customContactNotice: data.custom_contact_notice || fallbackSettings.customContactNotice,
      githubUrl: data.github_url,
      linkedinUrl: data.linkedin_url,
      instagramUrl: data.instagram_url,
      facebookUrl: data.facebook_url,
      heroHeading: data.hero_heading,
      heroDescription: data.hero_description,
      profileImageUrl: data.profile_image_url
    };
  } catch {
    return fallbackSettings;
  }
};

export const savePortfolioSettings = async (settings: PortfolioSettings): Promise<PortfolioSettings> => {
  if (!isSupabaseConfigured) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ek_portfolio_settings', JSON.stringify(settings));
    }
    return settings;
  }

  const payload = {
    id: 'primary',
    name: settings.name,
    professional_title: settings.professionalTitle,
    bio: settings.bio,
    email: settings.email,
    phone: settings.phone || '',
    whatsapp: settings.whatsapp || '',
    location: settings.location || '',
    availability_status: settings.availabilityStatus || 'Available for freelance & full-time roles',
    custom_contact_notice: settings.customContactNotice || '',
    github_url: settings.githubUrl || '',
    linkedin_url: settings.linkedinUrl || '',
    instagram_url: settings.instagramUrl || '',
    facebook_url: settings.facebookUrl || '',
    hero_heading: settings.heroHeading || '',
    hero_description: settings.heroDescription || '',
    profile_image_url: settings.profileImageUrl || '/images/profile/avatar.svg',
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('portfolio_settings')
    .upsert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return settings;
};
