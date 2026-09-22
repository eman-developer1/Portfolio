'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const user = await getCurrentUser();
      if (user && user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    };
    check();
  }, [router]);

  return null;
}
