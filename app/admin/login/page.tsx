'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/lib/supabase/auth';
import { useToast } from '@/components/admin/Toast/Toast';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await signInWithEmail(email.trim(), password);

      if (res.success) {
        showToast('Welcome back, Admin!', 'success');
        router.push('/admin/dashboard');
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <div className={styles.brandBadge}>
            <ShieldCheck size={26} />
          </div>
          <h2 className={styles.title}>Admin Portal</h2>
          <p className={styles.subtitle}>Sign in with authorized administrator credentials</p>
        </div>

        {errorMessage && (
          <div className={styles.errorBanner} role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="admin-email" className={styles.label}>
              Admin Email
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@emankhan.dev"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="admin-password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div className={styles.demoBanner}>
          <strong>Tip for Testing:</strong> Connect Supabase in <code>.env.local</code>. For local preview, enter <code>admin@emankhan.dev</code> / <code>Admin@2026</code>.
        </div>

        <Link href="/" className={styles.backHomeLink}>
          <ArrowLeft size={15} />
          <span>Back to Public Portfolio</span>
        </Link>
      </div>
    </div>
  );
}
