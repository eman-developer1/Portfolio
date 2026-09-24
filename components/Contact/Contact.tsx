'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioSettings } from '@/types';
import { getPortfolioSettings } from '@/lib/supabase/db';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Phone,
  MapPin
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/Common/Icons';
import styles from './Contact.module.css';

interface FormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
  honeypot: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const [settings, setSettings] = useState<PortfolioSettings>({
    name: 'Eman Khan',
    professionalTitle: 'Web Developer',
    bio: "I'm a Web Developer focused on creating responsive, interactive and user-friendly websites and web applications using modern technologies.",
    email: 'emanaslam182@gmail.com',
    whatsapp: '+92 3298386594',
    phone: '+92 3298386594',
    location: 'Remote / Global',
    availabilityStatus: 'Available for freelance & full-time roles',
    customContactNotice: 'All inquiries receive prompt responses within 24 business hours.',
    githubUrl: 'https://github.com/eman-developer1',
    linkedinUrl: 'https://www.linkedin.com/in/eman-khan-a5582b334/'
  });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    projectType: 'Business Website',
    message: '',
    honeypot: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        const data = await getPortfolioSettings();
        if (isMounted && data) {
          setSettings(data);
        }
      } catch {
        // preserve defaults
      }
    };
    loadSettings();
    return () => { isMounted = false; };
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your project.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          projectType: formData.projectType,
          message: formData.message.trim(),
          honeypot: formData.honeypot
        })
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        const errorMsg =
          result?.error ||
          'Something went wrong while sending your message. Please try again or contact me directly.';
        setServerError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      // Successful dispatch
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch {
      setServerError(
        'Something went wrong while sending your message. Please try again or contact me directly.'
      );
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      projectType: 'Business Website',
      message: '',
      honeypot: ''
    });
    setErrors({});
    setServerError(null);
    setIsSubmitted(false);
  };

  // Clean WhatsApp phone number for link
  const rawWhatsapp = settings.whatsapp ? settings.whatsapp.replace(/[^\d+]/g, '') : '3298386594';
  const whatsappUrl = rawWhatsapp.startsWith('+') ? `https://wa.me/${rawWhatsapp.slice(1)}` : `https://wa.me/${rawWhatsapp}`;

  return (
    <section id="contact" className={`section ${styles.contactSection}`}>
      <div className="container">
        {/* Section Header */}
        <div className="sectionHeader">
          {/* <span className="sectionPill">
            <Sparkles size={14} />
            <span>Get In Touch</span>
          </span> */}
          <h2 className="sectionTitle">Let&apos;s Build Something Together</h2>
          <p className="sectionSubtitle">
            Have a project idea or need a modern website? Let&apos;s talk.
          </p>
        </div>

        <div className={styles.contactGrid}>
          {/* Left Column: Direct Contact Info & Channels */}
          <div className={styles.channelsColumn}>
            <h3 className={styles.channelsIntroTitle}>Direct Reach &amp; Socials</h3>
            <p className={styles.channelsIntroDesc}>
              Whether you are looking for a full-stack web application, a performance-tuned landing page, or a freelance consultation, I am ready to collaborate.
            </p>

            <div className={styles.channelsList}>
              {/* Email */}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className={styles.channelCard}
                  title="Send an email"
                >
                  <div className={styles.channelIconBox}>
                    <Mail size={20} />
                  </div>
                  <div className={styles.channelText}>
                    <span className={styles.channelLabel}>Email Address</span>
                    <span className={styles.channelValue}>{settings.email}</span>
                  </div>
                </a>
              )}

              {/* WhatsApp */}
              {settings.whatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.channelCard}
                  title="Chat on WhatsApp"
                >
                  <div className={styles.channelIconBox}>
                    <MessageSquare size={20} />
                  </div>
                  <div className={styles.channelText}>
                    <span className={styles.channelLabel}>WhatsApp</span>
                    <span className={styles.channelValue}>{settings.whatsapp}</span>
                  </div>
                </a>
              )}

              {/* Phone */}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                  className={styles.channelCard}
                  title="Call directly"
                >
                  <div className={styles.channelIconBox}>
                    <Phone size={20} />
                  </div>
                  <div className={styles.channelText}>
                    <span className={styles.channelLabel}>Direct Phone</span>
                    <span className={styles.channelValue}>{settings.phone}</span>
                  </div>
                </a>
              )}

              {/* GitHub */}
              {settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.channelCard}
                  title="GitHub Profile"
                >
                  <div className={styles.channelIconBox}>
                    <GithubIcon size={20} />
                  </div>
                  <div className={styles.channelText}>
                    <span className={styles.channelLabel}>GitHub</span>
                    <span className={styles.channelValue}>{settings.githubUrl.replace('https://', '')}</span>
                  </div>
                </a>
              )}

              {/* LinkedIn */}
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.channelCard}
                  title="LinkedIn Profile"
                >
                  <div className={styles.channelIconBox}>
                    <LinkedinIcon size={20} />
                  </div>
                  <div className={styles.channelText}>
                    <span className={styles.channelLabel}>LinkedIn</span>
                    <span className={styles.channelValue}>{settings.linkedinUrl.replace('https://', '')}</span>
                  </div>
                </a>
              )}
            </div>


            {/* <div className={styles.availabilityBadge}>
              <span className={styles.availabilityDot} />
              <span className={styles.availabilityText}>
                {settings.availabilityStatus || 'Available for freelance & full-time roles'}
              </span>
            </div> */}
          </div>

          {/* Right Column: Interactive Form */}
          <div className={styles.formCard}>
            {isSubmitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 className={styles.successTitle}>Thanks! Message Sent</h4>
                <p className={styles.successDesc}>
                  Thanks! Your message regarding <strong>{formData.projectType}</strong> has been sent successfully. I&apos;ll get back to you soon at <strong>{formData.email}</strong>.
                </p>
                <button type="button" className={styles.resetBtn} onClick={handleReset}>
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className={styles.formGrid}>
                {/* Honeypot Spam Field (Hidden) */}
                <div className={styles.honeypotField} aria-hidden="true">
                  <label htmlFor="contact-honeypot">Leave this blank</label>
                  <input
                    id="contact-honeypot"
                    type="text"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.honeypot}
                    onChange={handleChange}
                  />
                </div>

                {/* Server Error Alert */}
                {serverError && (
                  <div className={styles.errorBanner} role="alert">
                    <AlertCircle size={18} className={styles.errorBannerIcon} />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Name */}
                <div className={styles.inputGroup}>
                  <label htmlFor="contact-name" className={styles.label}>
                    Your Name <span style={{ color: 'var(--accent-cyan)' }}>*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Eman Khan"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <span id="name-error" className={styles.errorText}>
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className={styles.inputGroup}>
                  <label htmlFor="contact-email" className={styles.label}>
                    Your Email <span style={{ color: 'var(--accent-cyan)' }}>*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="eman@example.com"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <span id="email-error" className={styles.errorText}>
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Project Type */}
                <div className={styles.inputGroup}>
                  <label htmlFor="contact-projectType" className={styles.label}>
                    Project Type
                  </label>
                  <select
                    id="contact-projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className={styles.select}
                    disabled={isSubmitting}
                  >
                    <option value="Business Website">Business Website</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="React Application">React Application</option>
                    <option value="Next.js Website">Next.js Website</option>
                    <option value="Admin Dashboard">Admin Dashboard</option>
                    <option value="Full-Stack Application">Full-Stack Application</option>
                    <option value="Other / Inquiry">Other / Consultation</option>
                  </select>
                </div>

                {/* Message */}
                <div className={styles.inputGroup}>
                  <label htmlFor="contact-message" className={styles.label}>
                    Message <span style={{ color: 'var(--accent-cyan)' }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project goals, timelines, or specifications..."
                    className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <span id="message-error" className={styles.errorText}>
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={16} />
                    </>
                  )}
                </button>

                <p className={styles.formDisclaimer}>
                  {settings.customContactNotice || 'All inquiries receive prompt responses within 24 business hours.'}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

