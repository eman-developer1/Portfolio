import React from 'react';
import { personalInfo } from '@/data/socials';
import { journeyMilestones } from '@/data/learning';
import { Check, Sparkles, Compass } from 'lucide-react';
import styles from './About.module.css';

export const About: React.FC = () => {
  return (
    <section id="about" className={`section ${styles.aboutSection}`}>
      <div className="container">
        {/* Section Header */}
        <div className="sectionHeader">
          {/* <span className="sectionPill">
            <Compass size={14} />
            {/* <span>Background &amp; Evolution</span> */}
          {/* </span>  */}
          <h2 className="sectionTitle">About Me</h2>
          <p className="sectionSubtitle">
            A developer journey rooted in curiosity, modern standards, and building delightful user experiences.
          </p>
        </div>

        <div className={styles.aboutGrid}>
          {/* Left Column: Bio & Core Philosophy */}
          <div className={styles.bioColumn}>
            <h3 className={styles.bioHeading}>Transforming Ideas Into Fluid Web Applications</h3>
            
            <p className={styles.bioLead}>
              {personalInfo.aboutDetailed}
            </p>

            <p className={styles.bioSubtext}>
              I prioritize clean component architecture, scalable state management, and accessible interfaces. Every project is crafted with care for typography, loading speed, and responsive fluidity across all devices.
            </p>

            <div className={styles.highlightPills}>
              <div className={styles.highlightCard}>
                <div className={styles.highlightTitle}>100%</div>
                <div className={styles.highlightDesc}>Responsive &amp; Mobile Optimized Layouts</div>
              </div>
              <div className={styles.highlightCard}>
                <div className={styles.highlightTitle}>Modular</div>
                <div className={styles.highlightDesc}>Component-Driven Architecture</div>
              </div>
              <div className={styles.highlightCard}>
                <div className={styles.highlightTitle}>Modern</div>
                <div className={styles.highlightDesc}>Next.js App Router &amp; TypeScript</div>
              </div>
              <div className={styles.highlightCard}>
                <div className={styles.highlightTitle}>Growth</div>
                <div className={styles.highlightDesc}>Continuous Learning Mindset</div>
              </div>
            </div>
          </div>

          {/* Right Column: Developer Journey Roadmap */}
          <div className={styles.journeyColumn}>
            <div className={styles.journeyHeader}>
              <div className={styles.journeyTitle}>
                <Sparkles size={18} color="var(--accent-cyan)" />
                <span>Developer Journey</span>
              </div>
              <span className={styles.journeyBadge}>Path to Mastery</span>
            </div>

            <div className={styles.timeline}>
              {journeyMilestones.map((milestone) => {
                const isCurrent = milestone.status === 'current';
                return (
                  <div key={milestone.step} className={styles.timelineItem}>
                    <div className={styles.connectorLine} />
                    <div className={`${styles.milestoneNode} ${isCurrent ? styles.nodeCurrent : styles.nodeCompleted}`}>
                      {isCurrent ? (
                        <span>{milestone.step}</span>
                      ) : (
                        <Check size={16} strokeWidth={2.5} />
                      )}
                    </div>

                    <div className={styles.milestoneContent}>
                      <div className={styles.milestoneNameRow}>
                        <span className={styles.milestoneName}>{milestone.name}</span>
                        <span className={`${styles.statusTag} ${isCurrent ? styles.tagLearning : styles.tagCompleted}`}>
                          {isCurrent ? 'Currently Learning' : 'Completed'}
                        </span>
                      </div>
                      <p className={styles.milestoneDesc}>{milestone.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
