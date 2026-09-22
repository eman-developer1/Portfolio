'use client';

import React, { useState, useEffect } from 'react';
import { skills as fallbackSkills, skillCategories } from '@/data/skills';
import { Skill } from '@/types';
import { getSkills } from '@/lib/supabase/db';
import { SkillCard } from './SkillCard';
import { Cpu } from 'lucide-react';
import styles from './Skills.module.css';

export const Skills: React.FC = () => {
  const [skillList, setSkillList] = useState<Skill[]>(fallbackSkills);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getSkills();
        if (isMounted && data && data.length > 0) {
          setSkillList(data);
        }
      } catch {
        // keep fallback
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const filteredSkills = skillList.filter((skill) => {
    if (activeCategory === 'all') return true;
    return skill.category === activeCategory;
  });

  return (
    <section id="skills" className={`section ${styles.skillsSection}`}>
      <div className="container">
        {/* Header */}
        <div className="sectionHeader">
          {/* <span className="sectionPill">
            <Cpu size={14} />
            <span>Core Competencies</span>
          </span> */}
          <h2 className="sectionTitle">My Tech Stack</h2>
          <p className="sectionSubtitle">
            Technologies, frameworks, and tools I use to build responsive, robust, and scalable web solutions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className={styles.categoryFilterBar} role="tablist" aria-label="Filter skills by category">
          {skillCategories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.key}
              className={`${styles.categoryTab} ${activeCategory === cat.key ? styles.activeTab : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.skillsGrid}>
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
};
