'use client';

import React from 'react';
import { Menu, LogOut, Shield } from 'lucide-react';
import { signOut } from '@/lib/supabase/auth';
import { useToast } from '@/components/admin/Toast/Toast';
import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
  title: string;
  userEmail?: string;
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  userEmail = 'admin@emankhan.dev',
  onToggleSidebar
}) => {
  const { showToast } = useToast();

  const handleLogout = async () => {
    await signOut();
    showToast('Logged out successfully', 'info');
    window.location.href = '/admin/login';
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftArea}>
        <button
          type="button"
          className={styles.mobileToggle}
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      <div className={styles.rightArea}>
        <div className={styles.userBadge}>
          <div className={styles.userAvatar}>
            <Shield size={14} />
          </div>
          <span className={styles.userEmail}>{userEmail}</span>
        </div>

        <button
          type="button"
          className={styles.quickLogout}
          onClick={handleLogout}
          title="Sign out of admin"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
