'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { Profile } from '@/types';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (isLoginPage) {
        setIsLoading(false);
        return;
      }

      try {
        const userProfile = await getCurrentUser();
        if (isMounted) {
          if (!userProfile || userProfile.role !== 'admin') {
            router.replace('/admin/login');
          } else {
            setProfile(userProfile);
            setIsLoading(false);
          }
        }
      } catch {
        if (isMounted) {
          router.replace('/admin/login');
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-secondary)'
      }}>
        <Loader2 size={36} className="animate-spin" color="var(--accent-cyan)" />
        <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Verifying Admin Authentication...</span>
      </div>
    );
  }

  return <>{children}</>;
};
