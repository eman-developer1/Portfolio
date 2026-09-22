-- =====================================================================
-- EMAN KHAN PORTFOLIO & ADMIN PORTAL — COMPLETE SUPABASE DATABASE SCHEMA
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PORTFOLIO SETTINGS
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  name TEXT NOT NULL DEFAULT 'Eman Khan',
  professional_title TEXT NOT NULL DEFAULT 'Web Developer',
  bio TEXT NOT NULL DEFAULT 'I''m a Web Developer focused on creating responsive, interactive and user-friendly websites and web applications using modern technologies.',
  email TEXT NOT NULL DEFAULT 'contact.emankhan@example.com',
  phone TEXT DEFAULT '+1 (234) 567-890',
  whatsapp TEXT DEFAULT '+1 (234) 567-890',
  location TEXT DEFAULT 'Remote / Global',
  github_url TEXT DEFAULT 'https://github.com/emankhan-dev',
  linkedin_url TEXT DEFAULT 'https://linkedin.com/in/eman-khan-dev',
  instagram_url TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '',
  hero_heading TEXT DEFAULT 'I Build Modern Digital Experiences.',
  hero_description TEXT DEFAULT 'I''m a Web Developer focused on creating responsive, interactive and user-friendly websites and web applications using modern technologies.',
  profile_image_url TEXT DEFAULT '/images/profile/avatar.svg',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT DEFAULT '',
  issue_date TEXT NOT NULL,
  credential_id TEXT DEFAULT '',
  certificate_url TEXT DEFAULT '',
  file_url TEXT NOT NULL,
  skills_covered TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'fullstack' CHECK (category IN ('frontend', 'react', 'nextjs', 'fullstack', 'other')),
  live_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  features TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  assignment_date TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Completed', 'In Progress')),
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'tools')),
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Intermediate' CHECK (status IN ('Learning', 'Intermediate', 'Advanced')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) & ACCESS CONTROL
-- =====================================================================

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile record upon user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    -- Make the first user or designated email an admin by default
    CASE WHEN new.email LIKE '%admin%' OR new.email = 'emankhan@example.com' THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2. Settings Policies
CREATE POLICY "Public read settings" ON public.portfolio_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON public.portfolio_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. Certificates Policies
CREATE POLICY "Public read certificates" ON public.certificates FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admin manage certificates" ON public.certificates FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Projects Policies
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admin manage projects" ON public.projects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. Assignments Policies
CREATE POLICY "Public read assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Admin manage assignments" ON public.assignments FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. Skills Policies
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin manage skills" ON public.skills FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 7. Services Policies
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (active = true OR public.is_admin());
CREATE POLICY "Admin manage services" ON public.services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =====================================================================
-- STORAGE BUCKETS CONFIGURATION
-- =====================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('certificates', 'certificates', true),
  ('projects', 'projects', true),
  ('assignments', 'assignments', true),
  ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Public Read
CREATE POLICY "Public Read Certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Public Read Projects" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Public Read Assignments" ON storage.objects FOR SELECT USING (bucket_id = 'assignments');
CREATE POLICY "Public Read Portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

-- Storage Admin Write
CREATE POLICY "Admin Upload Certificates" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND public.is_admin());
CREATE POLICY "Admin Update Certificates" ON storage.objects FOR UPDATE USING (bucket_id = 'certificates' AND public.is_admin());
CREATE POLICY "Admin Delete Certificates" ON storage.objects FOR DELETE USING (bucket_id = 'certificates' AND public.is_admin());

CREATE POLICY "Admin Upload Projects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects' AND public.is_admin());
CREATE POLICY "Admin Update Projects" ON storage.objects FOR UPDATE USING (bucket_id = 'projects' AND public.is_admin());
CREATE POLICY "Admin Delete Projects" ON storage.objects FOR DELETE USING (bucket_id = 'projects' AND public.is_admin());

CREATE POLICY "Admin Upload Assignments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'assignments' AND public.is_admin());
CREATE POLICY "Admin Update Assignments" ON storage.objects FOR UPDATE USING (bucket_id = 'assignments' AND public.is_admin());
CREATE POLICY "Admin Delete Assignments" ON storage.objects FOR DELETE USING (bucket_id = 'assignments' AND public.is_admin());

CREATE POLICY "Admin Upload Portfolio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());
CREATE POLICY "Admin Update Portfolio" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio' AND public.is_admin());
CREATE POLICY "Admin Delete Portfolio" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND public.is_admin());

-- =====================================================================
-- INITIAL SEED DATA
-- =====================================================================

INSERT INTO public.portfolio_settings (id, name, professional_title, bio, email, whatsapp, hero_heading, hero_description, profile_image_url)
VALUES (
  'primary',
  'Eman Khan',
  'Web Developer',
  'I''m a Web Developer focused on creating responsive, interactive and user-friendly websites and web applications using modern technologies.',
  'contact.emankhan@example.com',
  '+1 (234) 567-890',
  'I Build Modern Digital Experiences.',
  'I''m a Web Developer focused on creating responsive, interactive and user-friendly websites and web applications using modern technologies.',
  '/images/profile/avatar.svg'
) ON CONFLICT (id) DO NOTHING;

-- Seed Certificates
INSERT INTO public.certificates (title, organization, description, issue_date, credential_id, file_url, skills_covered, status, display_order)
VALUES
  ('Modern Next.js & React Full-Stack Architecture', 'Professional Developer Training', 'Mastery of Next.js App Router, React 19, and full-stack deployment.', '2025', 'CERT-EK-98241', '/images/certificates/nextjs-fullstack-cert.svg', ARRAY['Next.js App Router', 'React 19', 'TypeScript', 'Server Actions', 'SSR & SSG'], 'active', 1),
  ('TypeScript Professional Development', 'Web Engineering Institute', 'Strict type safety, generics, and production component architectures.', '2025', 'CERT-EK-77319', '/images/certificates/typescript-cert.svg', ARRAY['Strict TypeScript', 'Generics', 'Utility Types', 'Component Typing'], 'active', 2),
  ('Complete Modern Web Development & Backend Services', 'Tech Academy Global', 'Proficiency in frontend and cloud backend architectures.', '2024', 'CERT-EK-55102', '/images/certificates/web-dev-cert.svg', ARRAY['HTML5 & CSS3', 'JavaScript ES6+', 'Node.js', 'REST APIs', 'Supabase'], 'active', 3)
ON CONFLICT DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (title, short_description, description, image_url, technologies, category, live_url, github_url, features, featured, status, display_order)
VALUES
  (
    'Restaurant Management System',
    'A modern restaurant management and ordering platform with menu management, authentication, orders and dashboard functionality.',
    'A comprehensive full-stack solution tailored for modern eateries. The application empowers staff and managers with real-time order processing, dynamic digital menu catalogs, table reservation tracking, and an intuitive administrative analytics dashboard to monitor daily sales and inventory.',
    '/images/projects/restaurant-system.svg',
    ARRAY['React', 'Node.js', 'Supabase', 'TypeScript', 'CSS Modules'],
    'fullstack',
    'https://example.com/demo/restaurant-system',
    'https://github.com/emankhan-dev/restaurant-management-system',
    ARRAY['Interactive digital menu with category filtering and instant price updates', 'Real-time order queue with Supabase live event streaming', 'Role-based access control for cashier, kitchen staff, and managers', 'Revenue overview and sales performance metrics dashboard'],
    true,
    'published',
    1
  ),
  (
    'Car Report Platform',
    'A modern platform concept for managing and accessing vehicle report information.',
    'An enterprise-grade web application engineered to simplify vehicle history lookups and diagnostic report archiving. Built with Next.js App Router and PostgreSQL on Supabase, the platform delivers instant VIN lookups, report generation, and sleek data visualizations.',
    '/images/projects/car-report.svg',
    ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Lucide React'],
    'nextjs',
    'https://example.com/demo/car-report-platform',
    'https://github.com/emankhan-dev/car-report-platform',
    ARRAY['Instant VIN lookup and structured accident/mileage history rendering', 'PDF inspection report download and cloud archiving', 'Secure customer authentication and saved report bookmarking', 'High-performance server-rendered Next.js pages with fast load times'],
    true,
    'published',
    2
  ),
  (
    'Developer Portfolio',
    'A responsive developer portfolio showcasing projects, skills and certifications.',
    'A high-performance, polished developer showcase crafted with Next.js, TypeScript, and pure CSS Modules. Features modular architecture, accessible modal dialogs, dark/light theme persistence, smooth scroll choreography, and an interactive developer learning journey.',
    '/images/projects/portfolio-showcase.svg',
    ARRAY['Next.js', 'TypeScript', 'CSS Modules', 'React 19'],
    'nextjs',
    'https://emankhan.dev',
    'https://github.com/emankhan-dev/portfolio',
    ARRAY['Zero-layout-shift responsive design across all screen sizes (320px to 4K)', 'Accessible interactive modals with keyboard navigation and focus management', 'Theme engine supporting persistent dark and light modes', 'Modular architecture with clean separation of data, types, and presentation'],
    true,
    'published',
    3
  )
ON CONFLICT DO NOTHING;

-- Seed Assignments
INSERT INTO public.assignments (title, description, category, technologies, assignment_date, image_url, file_url, live_url, github_url, status, featured, display_order)
VALUES
  (
    'Full-Stack E-Commerce REST API & Auth',
    'A modular backend assignment demonstrating user authentication, JWT session verification, product catalogs, shopping cart logic, and Stripe webhook integration.',
    'Backend Development',
    ARRAY['Node.js', 'Express', 'Supabase', 'TypeScript', 'JWT'],
    '2025',
    '/images/assignments/ecommerce-api.svg',
    '/images/assignments/ecommerce-api.svg',
    'https://example.com/demo/ecommerce-api',
    'https://github.com/emankhan-dev/ecommerce-rest-api',
    'Completed',
    true,
    1
  ),
  (
    'Pathfinding & Sorting Algorithm Visualizer',
    'An interactive frontend algorithm visualizer implementing Dijkstra, A* search, QuickSort, and MergeSort with real-time speed throttling and state exploration.',
    'Frontend Engineering',
    ARRAY['React', 'TypeScript', 'CSS Modules', 'Algorithms'],
    '2025',
    '/images/assignments/algo-visualizer.svg',
    '/images/assignments/algo-visualizer.svg',
    'https://example.com/demo/algorithm-visualizer',
    'https://github.com/emankhan-dev/algorithm-visualizer',
    'Completed',
    true,
    2
  ),
  (
    'NoSQL Document Store & Aggregation Pipeline',
    'An academic assignment focused on modeling non-relational database collections, indexing strategies, document validation, and complex data pipeline aggregations.',
    'Database Systems',
    ARRAY['MongoDB', 'Mongoose', 'Node.js', 'Express'],
    '2026',
    '/images/assignments/mongodb-crud.svg',
    '/images/assignments/mongodb-crud.svg',
    '',
    'https://github.com/emankhan-dev/mongodb-aggregation-lab',
    'In Progress',
    false,
    3
  )
ON CONFLICT DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (name, category, description, icon, status, display_order)
VALUES
  ('Next.js', 'frontend', 'Server-side rendering, App Router, API routes, and full-stack React performance optimization.', 'Zap', 'Advanced', 1),
  ('React.js', 'frontend', 'Component architecture, state management, custom hooks, and dynamic user interfaces.', 'Code2', 'Advanced', 2),
  ('TypeScript', 'frontend', 'Strict typing, scalable interface design, generics, and compile-time error prevention.', 'FileCode2', 'Advanced', 3),
  ('JavaScript (ES6+)', 'frontend', 'Modern asynchronous programming, DOM manipulation, closures, and modular code patterns.', 'Terminal', 'Advanced', 4),
  ('HTML5', 'frontend', 'Semantic markup, accessible web standards (WCAG), and search engine optimization (SEO).', 'Layout', 'Advanced', 5),
  ('CSS3 / CSS Modules', 'frontend', 'Fluid responsive design, Flexbox, CSS Grid, custom properties, and smooth animations.', 'Palette', 'Advanced', 6),
  ('Node.js', 'backend', 'Server runtime, RESTful API development, request handling, and backend services.', 'Server', 'Intermediate', 7),
  ('Supabase Backend', 'backend', 'User authentication, row-level security (RLS), and real-time database listeners.', 'ShieldCheck', 'Intermediate', 8),
  ('Supabase (PostgreSQL)', 'database', 'Relational data modeling, secure queries, foreign keys, and cloud database administration.', 'Database', 'Intermediate', 9),
  ('MongoDB', 'database', 'NoSQL document storage, schemas, and aggregation pipelines.', 'Layers', 'Learning', 10),
  ('Git', 'tools', 'Version control, branch management, merge conflict resolution, and collaborative workflow.', 'GitBranch', 'Advanced', 11),
  ('GitHub', 'tools', 'Remote repository hosting, issue tracking, pull requests, and CI/CD pipelines.', 'Github', 'Advanced', 12),
  ('VS Code', 'tools', 'Primary code editor configured with linting, debugging, and productivity workflows.', 'Laptop', 'Advanced', 13),
  ('Antigravity IDE', 'tools', 'Next-generation agentic AI developer environment for rapid building and workflow acceleration.', 'Cpu', 'Advanced', 14),
  ('Vercel', 'tools', 'Modern edge deployments, automatic previews, domain configuration, and continuous delivery.', 'Cloud', 'Advanced', 15)
ON CONFLICT DO NOTHING;

-- Seed Services
INSERT INTO public.services (title, description, icon, highlights, display_order, active)
VALUES
  ('Business Websites', 'Modern responsive websites for businesses and brands.', 'Globe', ARRAY['Custom bespoke UI reflecting your unique brand identity', 'Mobile-first responsive architecture across all display sizes', 'SEO optimization, meta tags, and high-speed loading'], 1, true),
  ('Landing Pages', 'Modern landing pages designed for performance and responsiveness.', 'Rocket', ARRAY['Conversion-focused visual structure and strategic CTAs', 'Ultra-fast First Contentful Paint and Core Web Vitals', 'Engaging micro-interactions and smooth scroll sections'], 2, true),
  ('React Applications', 'Interactive applications using React and TypeScript.', 'Code2', ARRAY['Clean component modularity and predictable state flow', 'TypeScript type safety preventing runtime bugs', 'Rich client-side interactivity and asynchronous API fetching'], 3, true),
  ('Next.js Websites', 'Modern web applications and websites using Next.js.', 'Zap', ARRAY['App Router architecture with React Server Components', 'Server-Side Rendering (SSR) & Static Site Generation (SSG)', 'Optimized asset loading and edge deployment readiness'], 4, true),
  ('Admin Dashboards', 'Clean and functional dashboards for business applications.', 'BarChart3', ARRAY['Intuitive data tables, filters, and state visualizations', 'Secure authentication workflows and role-based views', 'Responsive multi-screen layouts with expandable navigation'], 5, true),
  ('Full-Stack Applications', 'Modern frontend and backend applications.', 'Layers', ARRAY['Seamless frontend integration with Node.js and Supabase', 'Secure database queries, schema design, and RLS', 'REST API design, error boundaries, and end-to-end reliability'], 6, true)
ON CONFLICT DO NOTHING;
