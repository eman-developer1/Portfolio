import React from 'react';
import Image from 'next/image';
import { Project } from '@/types';
import { ExternalLink, Eye } from 'lucide-react';
import { GithubIcon } from '@/components/Common/Icons';
import styles from './Projects.module.css';

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenDetails }) => {
  return (
    <div className={styles.projectCard}>
      {/* Image Thumbnail */}
      <div className={styles.imageWrapper}>
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.projectImage}
        />
        <span className={styles.categoryBadge}>{project.category}</span>
      </div>

      {/* Card Content */}
      <div className={styles.cardBody}>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.projectDescription}>{project.description}</p>

        {/* Tech Badges */}
        <div className={styles.techStackList}>
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className={styles.techPill}>
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className={styles.techPill}>+{project.technologies.length - 4}</span>
          )}
        </div>

        {/* Card Actions */}
        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.viewDetailsBtn}
            onClick={() => onOpenDetails(project)}
            aria-label={`View details for ${project.title}`}
          >
            <Eye size={15} />
            <span>View Details</span>
          </button>

          <div className={styles.externalLinks}>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconActionBtn}
              aria-label={`Live demo of ${project.title}`}
              title="Live Demo"
            >
              <ExternalLink size={16} />
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconActionBtn}
              aria-label={`GitHub repository of ${project.title}`}
              title="GitHub Code"
            >
              <GithubIcon size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
