'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Award,
  FolderGit2,
  BookMarked,
  Cpu,
  Briefcase,
  Settings,
  LogOut,
  ExternalLink,
  X
} from 'lucide-react';
import { signOut } from '@/lib/supabase/auth';
import { useToast } from '@/components/admin/Toast/Toast';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

const navLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { label: 'Assignments', href: '/admin/assignments', icon: BookMarked },
  { label: 'Skills', href: '/admin/skills', icon: Cpu },
  { label: 'Services', href: '/admin/services', icon: Briefcase },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
  currentPath
}) => {
  const { showToast } = useToast();

  const handleLogout = async () => {
    await signOut();
    showToast('Logged out successfully', 'info');
    window.location.href = '/admin/login';
  };

  return (
    <>
      {isOpen && <div className={styles.mobileOverlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        {/* Brand Area */}
        <div className={styles.brandArea}>
          <Link href="/admin/dashboard" className={styles.brandLink} onClick={onClose}>
            <span className={styles.brandBadge}>EK</span>
            <div className={styles.brandTitle}>
              <span>Eman Admin</span>
              <span className={styles.brandSub}>Content Manager</span>
            </div>
          </Link>
          <button
            type="button"
            className={styles.closeMobileBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <ul className={styles.navList}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
                  onClick={onClose}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer Actions */}
        <div className={styles.footerSection}>
          <Link href="/" target="_blank" className={styles.publicSiteBtn}>
            <span>View Public Site</span>
            <ExternalLink size={14} />
          </Link>

          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
