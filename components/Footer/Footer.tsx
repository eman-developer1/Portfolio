'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { socialLinks as defaultSocials } from '@/data/socials';
import { PortfolioSettings } from '@/types';
import { getPortfolioSettings } from '@/lib/supabase/db';
import { Mail, MessageSquare, Phone, Code, ShieldCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/Common/Icons';
import styles from './Footer.module.css';

const footerNavLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About Me', href: '#about' },
  { label: 'Tech Stack', href: '#skills' },
  { label: 'Featured Projects', href: '#projects' },
  { label: 'Assignments', href: '#assignments' },
  { label: 'Services', href: '#services' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
  { label: 'Admin Portal', href: '/admin', isAdmin: true },
];

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        const data = await getPortfolioSettings();
        if (isMounted && data) {
          setSettings(data);
        }
      } catch {
        // preserve default
      }
    };
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const email = settings?.email || 'emanaslam182@gmail.com';
  const whatsapp = settings?.whatsapp || '+92 3298386594';
  const phone = settings?.phone;
  const rawWhatsapp = whatsapp.replace(/[^\d+]/g, '');
  const whatsappUrl = rawWhatsapp.startsWith('+') ? `https://wa.me/${rawWhatsapp.slice(1)}` : `https://wa.me/${rawWhatsapp}`;
  const githubUrl = settings?.githubUrl || 'https://github.com/eman-developer1';
  const linkedinUrl = settings?.linkedinUrl || 'https://www.linkedin.com/in/eman-khan-a5582b334/';

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand Info */}
          <div className={styles.brandColumn}>
            <Link href="#hero" className={styles.footerLogo}>
              {/* <span className={styles.logoBadge}>EK</span>
              <span>{settings?.name || 'Eman Khan'}</span> */}
            </Link>
            <span className={styles.developerRole}>{settings?.professionalTitle || 'Web Developer'}</span>
            <p className={styles.brandDesc}>
              {settings?.bio || 'Focused on crafting responsive, interactive, and high-performance digital experiences with modern web technologies.'}
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className={styles.columnTitle}>Navigation</h4>
            <ul className={styles.linkList}>
              {footerNavLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`${styles.footerLink} ${link.isAdmin ? styles.adminNavLink : ''}`}
                  >
                    {link.isAdmin && <ShieldCheck size={14} className={styles.adminIcon} />}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Channels & Social Profiles */}
          <div>
            <h4 className={styles.columnTitle}>Connect &amp; Reach</h4>
            <div className={styles.socialsList}>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className={styles.socialRowLink}
                  title="Email"
                >
                  <Mail size={16} />
                  <span>{email}</span>
                </a>
              )}

              {whatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialRowLink}
                  title="WhatsApp"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp: {whatsapp}</span>
                </a>
              )}

              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className={styles.socialRowLink}
                  title="Direct Phone"
                >
                  <Phone size={16} />
                  <span>Call: {phone}</span>
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialRowLink}
                  title="GitHub"
                >
                  <GithubIcon size={16} />
                  <span>GitHub Profile</span>
                </a>
              )}

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialRowLink}
                  title="LinkedIn"
                >
                  <LinkedinIcon size={16} />
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyrightText}>
            © {new Date().getFullYear()} {settings?.name || 'Eman Khan'}. All rights reserved.
          </p>
          <div className={styles.bottomRight}>
            <Link href="/admin" className={styles.adminQuickBtn} title="Access Admin Portal">
              <ShieldCheck size={13} />
              <span>Admin Portal</span>
            </Link>
            <div className={styles.builtWithTag}>
              <Code size={14} color="var(--accent-cyan)" />
              <span>Built with Next.js &amp; TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

