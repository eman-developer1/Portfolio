import React from 'react';
import Image from 'next/image';
import { Assignment } from '@/types';
import { Eye, Download, ExternalLink, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { GithubIcon } from '@/components/Common/Icons';
import styles from './Assignments.module.css';

interface AssignmentCardProps {
  assignment: Assignment;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const isCompleted = assignment.status === 'Completed';

  return (
    <div className={styles.assignmentCard}>
      {/* Thumbnail */}
      <div className={styles.imageWrapper}>
        {assignment.imageUrl ? (
          <Image
            src={assignment.imageUrl}
            alt={assignment.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.assignmentImage}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
            <span>No Preview Image</span>
          </div>
        )}

        <div className={styles.cardTopBadges}>
          <span className={styles.categoryBadge}>{assignment.category}</span>
          <span className={`${styles.statusBadge} ${isCompleted ? styles.statusCompleted : styles.statusProgress}`}>
            {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            <span>{assignment.status}</span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <h3 className={styles.assignmentTitle}>{assignment.title}</h3>
        <p className={styles.assignmentDesc}>{assignment.description}</p>

        <div className={styles.dateRow}>
          <Calendar size={13} />
          <span>{assignment.assignmentDate}</span>
        </div>

        {/* Tech Stack */}
        <div className={styles.techStackList}>
          {assignment.technologies.map((tech) => (
            <span key={tech} className={styles.techPill}>
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons (only show when relevant data exists) */}
        <div className={styles.cardActions}>
          {assignment.fileUrl && (
            <a
              href={assignment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
              title="View assignment document / asset"
            >
              <Eye size={13} />
              <span>View</span>
            </a>
          )}

          {assignment.fileUrl && (
            <a
              href={assignment.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtn}
              title="Download assignment resource"
            >
              <Download size={13} />
              <span>Download</span>
            </a>
          )}

          {assignment.liveUrl && (
            <a
              href={assignment.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtn}
              title="Live Demo"
            >
              <ExternalLink size={13} />
              <span>Live Demo</span>
            </a>
          )}

          {assignment.githubUrl && (
            <a
              href={assignment.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtn}
              title="GitHub Code"
            >
              <GithubIcon size={13} />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
