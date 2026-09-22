import { supabase, isSupabaseConfigured } from './client';
import { Profile } from '@/types';

export interface AuthResponse {
  success: boolean;
  error?: string;
  profile?: Profile;
}

export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  if (!isSupabaseConfigured) {
    // Development demo fallback for local preview if Supabase env vars are not set yet
    if (email === 'admin@emankhan.dev' && password === 'Admin@2026') {
      const demoProfile: Profile = {
        id: 'demo-admin-id',
        email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ek_demo_admin_session', JSON.stringify(demoProfile));
      }
      return { success: true, profile: demoProfile };
    }
    return {
      success: false,
      error: 'Supabase credentials not configured in .env.local. Use demo login (admin@emankhan.dev / Admin@2026) to test.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'User not found.' };
    }

    // Verify admin role in profiles table
    const profile = await getUserProfile(data.user.id);
    if (!profile || profile.role !== 'admin') {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Access denied. Only authorized administrators can access this portal.',
      };
    }

    return { success: true, profile };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
    return { success: false, error: message };
  }
};

export const signOut = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('ek_demo_admin_session');
  }
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
};

export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  if (!isSupabaseConfigured) {
    if (typeof window !== 'undefined') {
      const demo = sessionStorage.getItem('ek_demo_admin_session');
      if (demo) return JSON.parse(demo);
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      role: data.role as 'admin' | 'user',
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
};

export const getCurrentUser = async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured) {
    if (typeof window !== 'undefined') {
      const demo = sessionStorage.getItem('ek_demo_admin_session');
      if (demo) return JSON.parse(demo);
    }
    return null;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    return await getUserProfile(session.user.id);
  } catch {
    return null;
  }
};
