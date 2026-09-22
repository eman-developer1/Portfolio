'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PortfolioSettings } from '@/types';
import { getPortfolioSettings } from '@/lib/supabase/db';
import { ArrowRight, MessageSquare, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/Common/Icons';
import profilePhoto from '@/app/image.png';
import styles from './Hero.module.css';

export const Hero: React.FC = () => {
  const [settings, setSettings] = useState<PortfolioSettings>({
    name: 'Eman Khan',
    professionalTitle: 'Web Developer',
    heroHeading: 'I Build Modern Digital Experiences.',
    heroDescription: "I'm a Web Developer focused on creating responsive, interactive and user-friendly websites and web applications using modern technologies.",
    email: 'contact.emankhan@example.com',
    whatsapp: '+1 (234) 567-890',
    githubUrl: 'https://github.com/emankhan-dev',
    linkedinUrl: 'https://linkedin.com/in/eman-khan-dev',
    bio: ''
  });

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const data = await getPortfolioSettings();
        if (isMounted && data) {
          setSettings(data);
        }
      } catch {
        // preserve fallback
      }
    };
    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  const rawWhatsapp = settings.whatsapp ? settings.whatsapp.replace(/[^\d+]/g, '') : '1234567890';
  const whatsappUrl = rawWhatsapp.startsWith('+') ? `https://wa.me/${rawWhatsapp.slice(1)}` : `https://wa.me/${rawWhatsapp}`;
  const profileImageSrc = (settings.profileImageUrl && !settings.profileImageUrl.includes('avatar.svg'))
    ? settings.profileImageUrl
    : profilePhoto;

  return (
    <section id="hero" className={styles.hero}>
      <div className={`container ${styles.heroContentGrid}`}>
        {/* Profile Picture Container */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageContainer}>
            <Image
              src={profileImageSrc}
              alt={settings.name || 'Eman Khan'}
              width={380}
              height={380}
              priority
              className={styles.profileImage}
            />
          </div>
        </div>

        {/* Content Column */}
        <div className={styles.heroInfo}>
          <span className={styles.roleLabel}>
            {settings.professionalTitle || 'Web Developer'}
          </span>

          <h1 className={styles.heroHeadline}>
            Hi, I&apos;m{' '}
            <span className={styles.nameHighlight}>{settings.name || 'Eman Khan'}</span>
          </h1>

          <p className={styles.heroSubtitle}>Full Stack Web Developer</p>

          <p className={styles.heroDescription}>
            {settings.heroDescription || "I'm a Web Developer focused on creating responsive, interactive and user-friendly websites and web applications using modern technologies."}
          </p>

          <div className={styles.heroButtons}>
            <Link href="#contact" className={styles.primaryBtn}>
              <span>Let&apos;s Work Together</span>
              <ArrowRight size={16} />
            </Link>

            <Link href="#projects" className={styles.secondaryBtn}>
              <span>View My Work</span>
            </Link>
          </div>

          {/* Social Links */}
          <div className={styles.socialsRow} aria-label="Social Profiles">
            {settings.githubUrl && (
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconLink}
                aria-label="GitHub Profile"
                title="GitHub"
              >
                <GithubIcon size={18} />
              </a>
            )}

            {settings.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconLink}
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
            )}

            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className={styles.socialIconLink}
                aria-label="Email"
                title="Email"
              >
                <Mail size={18} />
              </a>
            )}

            {settings.whatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconLink}
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <MessageSquare size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
