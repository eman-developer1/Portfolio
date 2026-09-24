'use client';

import React, { useState, useEffect } from 'react';
import { services as fallbackServices } from '@/data/services';
import { Service } from '@/types';

import { ServiceCard } from './ServiceCard';
import { Briefcase } from 'lucide-react';
import styles from './Services.module.css';

export const Services: React.FC = () => {
  const [serviceList, setServiceList] = useState<Service[]>(fallbackServices);



  return (
    <section id="services" className={`section ${styles.servicesSection}`}>
      <div className="container">
        {/* Section Header */}
        <div className="sectionHeader">
          {/* <span className="sectionPill">
            <Briefcase size={14} />
            <span>Offerings &amp; Expertise</span>
          </span> */}
          <h2 className="sectionTitle">What I Can Build</h2>
          <p className="sectionSubtitle">
            Tailored digital solutions engineered for speed, high conversion, and seamless user experiences.
          </p>
        </div>

        {/* Services Grid */}
        <div className={styles.servicesGrid}>
          {serviceList.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};
