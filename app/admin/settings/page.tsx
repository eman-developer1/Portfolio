'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioSettings } from '@/types';
import { getPortfolioSettings, savePortfolioSettings } from '@/lib/supabase/db';
import { useToast } from '@/components/admin/Toast/Toast';
import { FileUpload } from '@/components/admin/FileUpload/FileUpload';
import {
  Save,
  User,
  Share2,
  LayoutTemplate,
  Loader2,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Clock
} from 'lucide-react';
import styles from '@/components/admin/ManagerShared.module.css';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Personal Info Fields
  const [name, setName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [bio, setBio] = useState('');

  // Contact Information Fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [customContactNotice, setCustomContactNotice] = useState('');

  // Social Channels
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  // Hero Section Copy & Media
  const [heroHeading, setHeroHeading] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const data = await getPortfolioSettings();
        if (isMounted) {
          setName(data.name || '');
          setProfessionalTitle(data.professionalTitle || '');
          setBio(data.bio || '');

          setEmail(data.email || '');
          setPhone(data.phone || '');
          setWhatsapp(data.whatsapp || '');
          setLocation(data.location || '');
          setAvailabilityStatus(data.availabilityStatus || 'Available for freelance & full-time roles');
          setCustomContactNotice(data.customContactNotice || 'All inquiries receive prompt responses within 24 business hours.');

          setGithubUrl(data.githubUrl || '');
          setLinkedinUrl(data.linkedinUrl || '');
          setInstagramUrl(data.instagramUrl || '');
          setFacebookUrl(data.facebookUrl || '');

          setHeroHeading(data.heroHeading || '');
          setHeroDescription(data.heroDescription || '');
          setProfileImageUrl(data.profileImageUrl || '');
        }
      } catch {
        showToast('Failed to load portfolio settings', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSettings();
    return () => { isMounted = false; };
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and Email are required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload: PortfolioSettings = {
        name: name.trim(),
        professionalTitle: professionalTitle.trim(),
        bio: bio.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        location: location.trim(),
        availabilityStatus: availabilityStatus.trim(),
        customContactNotice: customContactNotice.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        facebookUrl: facebookUrl.trim(),
        heroHeading: heroHeading.trim(),
        heroDescription: heroDescription.trim(),
        profileImageUrl: profileImageUrl
      };

      await savePortfolioSettings(payload);
      showToast('Portfolio & contact settings saved successfully.', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save settings.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.emptyState}>
        <Loader2 size={32} className="animate-spin" color="var(--accent-cyan)" />
        <p>Loading settings from Supabase...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Contact Information & Channels Card (Highlighted) */}
        <div className={styles.tableCard} style={{ padding: '28px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div className={styles.modalHeader} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={20} color="var(--accent-cyan)" />
              <div>
                <h3 className={styles.modalTitle}>Contact Details &amp; Direct Channels</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Easily update your email, phone number, WhatsApp, and availability shown across the portfolio.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.twoCols}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Mail size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Primary Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact.emankhan@example.com"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <MessageSquare size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1 (234) 567-890 or +92 300 1234567"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.twoCols}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Direct Phone Number (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (234) 567-890"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Location / Timezone
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Remote / Global (UTC+5)"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.twoCols}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Availability Status Badge Text
                </label>
                <input
                  type="text"
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value)}
                  placeholder="Available for freelance & full-time roles"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Custom Notice (Beneath Contact Form)</label>
                <input
                  type="text"
                  value={customContactNotice}
                  onChange={(e) => setCustomContactNotice(e.target.value)}
                  placeholder="All inquiries receive prompt responses within 24 business hours."
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details Card */}
        <div className={styles.tableCard} style={{ padding: '28px' }}>
          <div className={styles.modalHeader} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="var(--accent-cyan)" />
              <h3 className={styles.modalTitle}>Personal Information &amp; Bio</h3>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.twoCols}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eman Khan"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Professional Title *</label>
                <input
                  type="text"
                  required
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  placeholder="Web Developer"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Short Bio / Overview</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Overview of your passion and experience..."
                className={styles.textarea}
              />
            </div>
          </div>
        </div>

        {/* Hero & Profile Image Card */}
        <div className={styles.tableCard} style={{ padding: '28px' }}>
          <div className={styles.modalHeader} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LayoutTemplate size={20} color="var(--accent-cyan)" />
              <h3 className={styles.modalTitle}>Hero Section &amp; Profile Picture</h3>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Hero Headline</label>
              <input
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                placeholder="I Build Modern Digital Experiences."
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Hero Description</label>
              <textarea
                rows={2}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                placeholder="Introduction paragraph in hero section..."
                className={styles.textarea}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Profile Picture / Avatar</label>
              <FileUpload
                bucket="portfolio"
                currentValue={profileImageUrl}
                onUploadComplete={(url) => setProfileImageUrl(url)}
                label="Upload Avatar or Profile Photo"
              />
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className={styles.tableCard} style={{ padding: '28px' }}>
          <div className={styles.modalHeader} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Share2 size={20} color="var(--accent-cyan)" />
              <h3 className={styles.modalTitle}>Social Links &amp; Profiles</h3>
            </div>
          </div>

          <div className={styles.twoCols}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>GitHub Profile URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/emankhan-dev"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>LinkedIn Profile URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/eman-khan-dev"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Instagram Profile URL</label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/username"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Facebook Profile URL</label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/username"
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            type="submit"
            disabled={isSaving}
            className={styles.primaryAddBtn}
            style={{ padding: '12px 32px', fontSize: '0.95rem' }}
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Portfolio &amp; Contact Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
