import React from 'react';
import { Service } from '@/types';
import {
  Globe,
  Rocket,
  Code2,
  Zap,
  BarChart3,
  Layers,
  CheckCircle,
  LucideIcon
} from 'lucide-react';
import styles from './Services.module.css';

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Rocket,
  Code2,
  Zap,
  BarChart3,
  Layers
};

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const IconComponent = iconMap[service.iconName] || Layers;

  return (
    <div className={styles.serviceCard}>
      <div className={styles.iconBox}>
        <IconComponent size={24} />
      </div>

      <h3 className={styles.serviceTitle}>{service.title}</h3>
      <p className={styles.serviceDescription}>{service.description}</p>

      <ul className={styles.highlightsList}>
        {service.highlights.map((highlight, idx) => (
          <li key={idx} className={styles.highlightItem}>
            <CheckCircle size={14} className={styles.highlightBullet} />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
