'use client';

import React, { useState, useEffect } from 'react';
import { projects as fallbackProjects, projectFilterCategories } from '@/data/projects';
import { Project, ProjectCategory } from '@/types';
import { getProjects } from '@/lib/supabase/db';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { FolderGit2 } from 'lucide-react';
import styles from './Projects.module.css';

export const Projects: React.FC = () => {
  const [projectList, setProjectList] = useState<Project[]>(fallbackProjects);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getProjects();
        if (isMounted && data && data.length > 0) {
          setProjectList(data);
        }
      } catch {
        // keep fallback
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const filteredProjects = projectList.filter((project) => {
    if (activeCategory === 'all') return true;
    return project.category === activeCategory;
  });

  return (
    <section id="projects" className={`section ${styles.projectsSection}`}>
      <div className="container">
        {/* Section Header */}
        <div className="sectionHeader">
          {/* <span className="sectionPill">
            <FolderGit2 size={14} />
            <span>Showcase &amp; Applications</span>
          </span> */}
          <h2 className="sectionTitle">Featured Projects</h2>
          <p className="sectionSubtitle">
            A curated selection of real-world web applications, responsive platforms, and frontend systems.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs} role="tablist" aria-label="Filter projects by category">
          {projectFilterCategories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.key}
              className={`${styles.filterBtn} ${activeCategory === cat.key ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory(cat.key as ProjectCategory)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className={styles.projectsGrid}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenDetails={(p) => setSelectedProject(p)}
            />
          ))}
        </div>

        {/* Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
};
