'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Project } from '@/types';
import { X, ExternalLink, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/Common/Icons';
import styles from './Projects.module.css';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className={styles.closeModalBtn}
          onClick={onClose}
          aria-label="Close project details"
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <div className={styles.modalHeroImage}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 780px"
            className={styles.modalImage}
            priority
          />
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <div className={styles.modalHeaderRow}>
            <h3 id="modal-project-title" className={styles.modalTitle}>
              {project.title}
            </h3>
            <span className={styles.modalCategory}>{project.category}</span>
          </div>

          <p className={styles.modalLongDesc}>{project.longDescription}</p>

          {/* Features */}
          <div>
            <h4 className={styles.featureSectionTitle}>Key Architectural Features</h4>
            <ul className={styles.featuresList}>
              {project.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureBullet} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className={styles.featureSectionTitle}>Technologies Used</h4>
            <div className={styles.techStackList}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.techPill}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className={styles.modalActionsRow}>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.modalPrimaryBtn}
            >
              <span>View Live Demo</span>
              <ExternalLink size={16} />
            </a>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.modalSecondaryBtn}
            >
              <GithubIcon size={16} />
              <span>Source Code</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
