'use client';

import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory } from '@/types';
import { getProjects, saveProject, deleteProject } from '@/lib/supabase/db';
import { useToast } from '@/components/admin/Toast/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal/ConfirmModal';
import { FileUpload } from '@/components/admin/FileUpload/FileUpload';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  FolderGit2,
  Star,
  X,
  Loader2
} from 'lucide-react';
import styles from '@/components/admin/ManagerShared.module.css';

export default function AdminProjectsPage() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [image, setImage] = useState('');
  const [technologiesInput, setTechnologiesInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('fullstack');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  // Delete State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjectsList = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsList();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setLongDescription('');
    setImage('');
    setTechnologiesInput('');
    setFeaturesInput('');
    setCategory('fullstack');
    setLiveUrl('');
    setGithubUrl('');
    setFeatured(false);
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setLongDescription(project.longDescription || project.description);
    setImage(project.image);
    setTechnologiesInput(project.technologies.join(', '));
    setFeaturesInput(project.features ? project.features.join('\n') : '');
    setCategory(project.category);
    setLiveUrl(project.liveUrl || '');
    setGithubUrl(project.githubUrl || '');
    setFeatured(Boolean(project.featured));
    setStatus(project.status || 'published');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please provide a project name and short description.', 'error');
      return;
    }

    if (!image) {
      showToast('Please upload a project preview image.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const techArray = technologiesInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const featuresArray = featuresInput
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload: Omit<Project, 'id'> & { id?: string } = {
        id: editingProject ? editingProject.id : undefined,
        title: title.trim(),
        description: description.trim(),
        longDescription: longDescription.trim() || description.trim(),
        image: image,
        technologies: techArray,
        category: category,
        liveUrl: liveUrl.trim(),
        githubUrl: githubUrl.trim(),
        features: featuresArray,
        featured: featured,
        status: status
      };

      await saveProject(payload);
      showToast(
        editingProject
          ? 'Project updated successfully.'
          : 'Project added successfully.',
        'success'
      );
      setIsModalOpen(false);
      fetchProjectsList();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save project.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete.id);
      showToast('Project deleted successfully.', 'success');
      setProjectToDelete(null);
      fetchProjectsList();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete project.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      {/* Top Bar: Search & Add Button */}
      <div className={styles.topBar}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search projects by name, category, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button type="button" className={styles.primaryAddBtn} onClick={handleOpenAdd}>
          <Plus size={17} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.emptyState}>
            <Loader2 size={32} className="animate-spin" color="var(--accent-cyan)" />
            <p>Loading projects from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FolderGit2 size={28} />
            </div>
            <h3>No projects found</h3>
            <p>Create your first project or adjust your search filter.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Project Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Technologies</th>
                  <th className={styles.th}>Featured</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((proj) => (
                  <tr key={proj.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.itemTitle}>{proj.title}</span>
                      <span className={styles.itemSub}>{proj.description.slice(0, 70)}...</span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${styles.badgeActive}`}>
                        {proj.category}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.itemSub}>
                        {proj.technologies.slice(0, 3).join(', ')}
                        {proj.technologies.length > 3 && ` +${proj.technologies.length - 3}`}
                      </span>
                    </td>
                    <td className={styles.td}>
                      {proj.featured ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>
                          <Star size={13} fill="#f59e0b" /> Featured
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Standard</span>
                      )}
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <div className={styles.tableActions} style={{ justifyContent: 'flex-end' }}>
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewBtn}
                            title="Live Demo"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleOpenEdit(proj)}
                          title="Edit project"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => setProjectToDelete(proj)}
                          title="Delete project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Form */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Project Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Restaurant Management System"
                  className={styles.input}
                />
              </div>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                    className={styles.select}
                  >
                    <option value="fullstack">Full Stack</option>
                    <option value="nextjs">Next.js</option>
                    <option value="react">React</option>
                    <option value="frontend">Frontend</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Publish Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    className={styles.select}
                  >
                    <option value="published">Published (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A concise summary shown on the project card..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Detailed Description</label>
                <textarea
                  rows={4}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Detailed architectural overview displayed inside the View Details modal..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Technologies (comma separated)</label>
                <input
                  type="text"
                  value={technologiesInput}
                  onChange={(e) => setTechnologiesInput(e.target.value)}
                  placeholder="Next.js, TypeScript, Supabase, Tailwind CSS"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Key Features (one per line)</label>
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Real-time order queue with Supabase live streams&#10;Role-based access control for staff and managers"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Project Preview Image *</label>
                <FileUpload
                  bucket="projects"
                  currentValue={image}
                  onUploadComplete={(url) => setImage(url)}
                  label="Upload Project Preview Screenshot / Graphic"
                />
              </div>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Live Demo URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://example.com/demo"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>GitHub Repository URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/eman-developer1/repo"
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
                />
                <label htmlFor="featured-check" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Mark as Featured Project (prominently highlighted)
                </label>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={styles.saveBtn}
                >
                  {isSaving ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Project?"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Project"
        onConfirm={handleDelete}
        onCancel={() => setProjectToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
