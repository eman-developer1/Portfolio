import React from 'react';
import Image from 'next/image';
import { Certificate } from '@/types';
import { Award, Eye, Calendar, ShieldCheck } from 'lucide-react';
import styles from './Certificates.module.css';

interface CertificateCardProps {
  certificate: Certificate;
  onOpenModal: (cert: Certificate) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onOpenModal
}) => {
  return (
    <div className={styles.certCard}>
      {/* Thumbnail */}
      <div
        className={styles.certImageWrapper}
        onClick={() => onOpenModal(certificate)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenModal(certificate);
          }
        }}
        aria-label={`View full certificate for ${certificate.title}`}
      >
        <Image
          src={certificate.image}
          alt={certificate.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.certThumbnail}
        />
        <div className={styles.imageOverlayHover}>
          <span className={styles.hoverZoomBadge}>
            <Eye size={16} />
            <span>Enlarge</span>
          </span>
        </div>
      </div>

      {/* Info */}
      <div className={styles.certCardBody}>
        <h3 className={styles.certTitle}>{certificate.title}</h3>

        <div className={styles.certMeta}>
          <div className={styles.issuerRow}>
            <Award size={15} color="var(--accent-cyan)" />
            <span>{certificate.issuer}</span>
          </div>

          <div className={styles.certMetaRow}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> {certificate.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} color="var(--accent-green)" /> {certificate.credentialId}
            </span>
          </div>
        </div>

        <div className={styles.skillsTags}>
          {certificate.skillsCovered.slice(0, 3).map((s) => (
            <span key={s} className={styles.skillTag}>
              {s}
            </span>
          ))}
          {certificate.skillsCovered.length > 3 && (
            <span className={styles.skillTag}>+{certificate.skillsCovered.length - 3}</span>
          )}
        </div>

        <div className={styles.certCardActions}>
          <button
            type="button"
            className={styles.viewCertBtn}
            onClick={() => onOpenModal(certificate)}
          >
            <Eye size={15} />
            <span>View Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
