'use client';

import React, { useState, useEffect } from 'react';
import { Certificate } from '@/types';
import { getCertificates } from '@/lib/supabase/db';
import { certificates as fallbackCertificates } from '@/data/certificates';
import { CertificateCard } from './CertificateCard';
import { CertificateModal } from './CertificateModal';
import { Award } from 'lucide-react';
import styles from './Certificates.module.css';

export const Certificates: React.FC = () => {
  const [certList, setCertList] = useState<Certificate[]>(fallbackCertificates);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getCertificates();
        if (isMounted && data && data.length > 0) {
          setCertList(data);
        }
      } catch {
        // preserve fallback
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="certificates" className={`section ${styles.certificatesSection}`}>
      <div className="container">
        {/* Section Header */}
        <div className="sectionHeader">
          {/* <span className="sectionPill">
            <Award size={14} />
            <span>Verified Credentials</span>
          </span> */}
          <h2 className="sectionTitle">Certificates &amp; Achievements</h2>
          <p className="sectionSubtitle">
            Formal technical certifications validating practical competencies in modern full-stack development.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className={styles.certificatesGrid}>
          {certList.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onOpenModal={(c) => setSelectedCert(c)}
            />
          ))}
        </div>

        {/* Lightbox Modal */}
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      </div>
    </section>
  );
};
