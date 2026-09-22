import React from 'react';
import { learningItems } from '@/data/learning';
import { Database, Server, BookOpen, Clock, ArrowRight } from 'lucide-react';
import styles from './LearningJourney.module.css';

export const LearningJourney: React.FC = () => {
  return (
    <section id="learning" className={`section ${styles.learningSection}`}>
      <div className="container">
        {/* Section Header */}
        <div className="sectionHeader">
          {/* <span className="sectionPill">
            <BookOpen size={14} />
            <span>Active Exploration</span>
          </span> */}
          <h2 className="sectionTitle">Currently Learning</h2>
          <p className="sectionSubtitle">
            Continuous professional growth is key. Here are the backend and database architectures I am currently actively mastering.
          </p>
        </div>

        {/* Highlighted Learning Cards */}
        <div className={styles.learningGrid}>
          {learningItems.map((item) => {
            const Icon = item.iconName === 'Database' ? Database : Server;

            return (
              <div key={item.id} className={styles.learningCard}>
                <div className={styles.cardTopRow}>
                  <div className={styles.iconContainer}>
                    <Icon size={24} />
                  </div>
                  <span className={styles.statusPill}>
                    <span className={styles.pulsingDot} />
                    <span>Currently Learning</span>
                  </span>
                </div>

                <div className={styles.titleArea}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <span className={styles.cardSubtitle}>{item.subtitle}</span>
                </div>

                <p className={styles.cardDescription}>{item.description}</p>

                <div className={styles.topicsSection}>
                  <h4 className={styles.topicsHeader}>Active Learning Focus</h4>
                  <ul className={styles.topicsList}>
                    {item.topics.map((topic, idx) => (
                      <li key={idx} className={styles.topicItem}>
                        <ArrowRight size={14} className={styles.topicBullet} />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
