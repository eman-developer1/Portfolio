'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/admin/Toast/Toast';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard/AdminAuthGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader/AdminHeader';

const titleMap: Record<string, string> = {
  '/admin/dashboard': 'Dashboard Overview',
  '/admin/certificates': 'Certificate Management',
  '/admin/projects': 'Project Showcase Management',
  '/admin/assignments': 'Assignments & Labs Management',
  '/admin/skills': 'Tech Stack & Skills Management',
  '/admin/services': 'Services Management',
  '/admin/settings': 'Portfolio Settings',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';
  const pageTitle = titleMap[pathname] || 'Admin Portal';

  return (
    <ToastProvider>
      <AdminAuthGuard>
        {isLoginPage ? (
          children
        ) : (
          <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <AdminSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              currentPath={pathname}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <AdminHeader
                title={pageTitle}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              />
              <main style={{ flex: 1, padding: '28px 24px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
                {children}
              </main>
            </div>
          </div>
        )}
      </AdminAuthGuard>
    </ToastProvider>
  );
}
