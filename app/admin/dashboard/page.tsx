'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardStats, DashboardStatsData } from '@/lib/supabase/db';
import {
  FolderGit2,
  Award,
  BookMarked,
  Cpu,
  Plus,
  ArrowRight,
  Sparkles,
  Settings,
  Briefcase
} from 'lucide-react';
import styles from './dashboard.module.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalProjects: 0,
    totalCertificates: 0,
    totalAssignments: 0,
    totalSkills: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        if (isMounted) setStats(data);
      } catch {
        // keep fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className={styles.dashboardWrapper}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeText}>
          <h2 className={styles.welcomeTitle}>Content Management Hub</h2>
          <p className={styles.welcomeSub}>
            Live Supabase database integration. Manage portfolio assets, projects, certificates, and credentials in real time.
          </p>
        </div>

        <div className={styles.bannerActions}>
          <Link href="/admin/certificates" className={styles.quickCreateBtn}>
            <Plus size={16} />
            <span>Add Certificate</span>
          </Link>
          <Link href="/admin/projects" className={styles.quickCreateBtn}>
            <Plus size={16} />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* Live Counts Statistics Grid */}
      <div className={styles.statsGrid}>
        {/* Projects */}
        <Link href="/admin/projects" className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statCount}>{loading ? '...' : stats.totalProjects}</span>
            <span className={styles.statLabel}>Total Projects</span>
          </div>
          <div className={`${styles.statIconBox} ${styles.iconProjects}`}>
            <FolderGit2 size={24} />
          </div>
        </Link>

        {/* Certificates */}
        <Link href="/admin/certificates" className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statCount}>{loading ? '...' : stats.totalCertificates}</span>
            <span className={styles.statLabel}>Total Certificates</span>
          </div>
          <div className={`${styles.statIconBox} ${styles.iconCerts}`}>
            <Award size={24} />
          </div>
        </Link>

        {/* Assignments */}
        <Link href="/admin/assignments" className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statCount}>{loading ? '...' : stats.totalAssignments}</span>
            <span className={styles.statLabel}>Total Assignments</span>
          </div>
          <div className={`${styles.statIconBox} ${styles.iconAssigns}`}>
            <BookMarked size={24} />
          </div>
        </Link>

        {/* Skills */}
        <Link href="/admin/skills" className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statCount}>{loading ? '...' : stats.totalSkills}</span>
            <span className={styles.statLabel}>Technologies &amp; Skills</span>
          </div>
          <div className={`${styles.statIconBox} ${styles.iconSkills}`}>
            <Cpu size={24} />
          </div>
        </Link>
      </div>

      {/* Lower Section: Recent Activity & Management Shortcuts */}
      <div className={styles.lowerGrid}>
        {/* Recent Activity */}
        <div className={styles.activityCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Content Activity</h3>
            <Sparkles size={16} color="var(--accent-cyan)" />
          </div>

          <div className={styles.activityList}>
            {stats.recentActivity.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No recent activity records.</p>
            ) : (
              stats.recentActivity.map((act, idx) => (
                <div key={idx} className={styles.activityItem}>
                  <div className={styles.activityLeft}>
                    <span className={styles.activityBadge}>{act.type}</span>
                    <span className={styles.activityTitle}>{act.title}</span>
                  </div>
                  <span className={styles.activityDate}>{act.date}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Management Quick Shortcuts */}
        <div className={styles.shortcutsCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Quick Management</h3>
          </div>

          <div className={styles.shortcutsList}>
            <Link href="/admin/certificates" className={styles.shortcutBtn}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} /> Manage Certificates
              </span>
              <ArrowRight size={15} />
            </Link>

            <Link href="/admin/projects" className={styles.shortcutBtn}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderGit2 size={16} /> Manage Projects
              </span>
              <ArrowRight size={15} />
            </Link>

            <Link href="/admin/assignments" className={styles.shortcutBtn}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookMarked size={16} /> Manage Assignments
              </span>
              <ArrowRight size={15} />
            </Link>

            <Link href="/admin/skills" className={styles.shortcutBtn}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} /> Manage Tech Stack
              </span>
              <ArrowRight size={15} />
            </Link>

            <Link href="/admin/services" className={styles.shortcutBtn}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={16} /> Manage Services
              </span>
              <ArrowRight size={15} />
            </Link>

            <Link href="/admin/settings" className={styles.shortcutBtn}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={16} /> Portfolio Settings
              </span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
