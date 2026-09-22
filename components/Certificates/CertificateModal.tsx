'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Certificate } from '@/types';
import { X, Award, CheckCircle } from 'lucide-react';
import styles from './Certificates.module.css';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (certificate) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  return (
    <div
      className={styles.certModalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cert-title"
    >
      <div className={styles.certModalContent} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeModalBtn}
          onClick={onClose}
          aria-label="Close certificate lightbox"
        >
          <X size={20} />
        </button>

        {/* Certificate Display */}
        <div className={styles.modalCertImageWrapper}>
          <Image
            src={certificate.image}
            alt={certificate.title}
            fill
            sizes="(max-width: 820px) 100vw, 820px"
            className={styles.modalCertImage}
            priority
          />
        </div>

        {/* Info */}
        <div className={styles.modalCertBody}>
          <h3 id="modal-cert-title" className={styles.modalCertTitle}>
            {certificate.title}
          </h3>

          <div className={styles.modalCertMetaGrid}>
            <div>
              <span className={styles.metaLabel}>Issued By</span>
              <div className={styles.metaValue}>{certificate.issuer}</div>
            </div>
            <div>
              <span className={styles.metaLabel}>Year Issued</span>
              <div className={styles.metaValue}>{certificate.date}</div>
            </div>
            <div>
              <span className={styles.metaLabel}>Credential ID</span>
              <div className={styles.metaValue}>{certificate.credentialId}</div>
            </div>
            <div>
              <span className={styles.metaLabel}>Verification Status</span>
              <div className={styles.metaValue} style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={15} /> Verified
              </div>
            </div>
          </div>

          <div>
            <span className={styles.metaLabel}>Skills Assessed</span>
            <div className={styles.skillsTags}>
              {certificate.skillsCovered.map((skill) => (
                <span key={skill} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
