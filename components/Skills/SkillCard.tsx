import React from 'react';
import { Skill } from '@/types';
import {
  Zap,
  Code2,
  FileCode2,
  Terminal,
  Layout,
  Palette,
  Server,
  ShieldCheck,
  Database,
  Layers,
  GitBranch,
  Laptop,
  Cpu,
  Cloud
} from 'lucide-react';
import { GithubIcon } from '@/components/Common/Icons';
import styles from './Skills.module.css';

type IconRenderer = React.ComponentType<{ size?: number | string }>;

const iconMap: Record<string, IconRenderer> = {
  Zap,
  Code2,
  FileCode2,
  Terminal,
  Layout,
  Palette,
  Server,
  ShieldCheck,
  Database,
  Layers,
  GitBranch,
  Github: GithubIcon,
  Laptop,
  Cpu,
  Cloud
};

interface SkillCardProps {
  skill: Skill;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const IconComponent = iconMap[skill.iconName] || Code2;
  const isLearning = skill.status === 'Currently Learning';

  return (
    <div className={styles.skillCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <IconComponent size={22} />
        </div>
        {isLearning && (
          <span className={styles.learningBadge}>
            Currently Learning
          </span>
        )}
      </div>

      <h3 className={styles.skillName}>{skill.name}</h3>
      <p className={styles.skillDesc}>{skill.description}</p>
      
      <span className={styles.categoryTag}>{skill.category}</span>
    </div>
  );
};
