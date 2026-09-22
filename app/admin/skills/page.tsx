'use client';

import React, { useState, useEffect } from 'react';
import { Skill, SkillCategory } from '@/types';
import { getSkills, saveSkill, deleteSkill } from '@/lib/supabase/db';
import { useToast } from '@/components/admin/Toast/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal/ConfirmModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Cpu,
  X,
  Loader2
} from 'lucide-react';
import styles from '@/components/admin/ManagerShared.module.css';

export default function AdminSkillsPage() {
  const { showToast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('frontend');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Code2');
  const [status, setStatus] = useState<'Learning' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [displayOrder, setDisplayOrder] = useState(0);

  // Delete State
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSkillsList = async () => {
    setLoading(true);
    try {
      const data = await getSkills();
      setSkills(data);
    } catch {
      showToast('Failed to load skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsList();
  }, []);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setName('');
    setCategory('frontend');
    setDescription('');
    setIconName('Code2');
    setStatus('Intermediate');
    setDisplayOrder(skills.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setDescription(skill.description);
    setIconName(skill.iconName);
    const mappedStatus =
      skill.status === 'Currently Learning' || skill.status === 'Learning'
        ? 'Learning'
        : skill.status === 'Advanced'
        ? 'Advanced'
        : 'Intermediate';
    setStatus(mappedStatus);
    setDisplayOrder(skill.displayOrder || 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      showToast('Please provide skill name and description.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Omit<Skill, 'id'> & { id?: string } = {
        id: editingSkill?.id,
        name: name.trim(),
        category,
        description: description.trim(),
        iconName: iconName.trim() || 'Code2',
        status: status === 'Learning' ? 'Currently Learning' : status,
        displayOrder
      };

      await saveSkill(payload);
      showToast(
        editingSkill ? 'Skill updated successfully.' : 'Skill added successfully.',
        'success'
      );
      setIsModalOpen(false);
      fetchSkillsList();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save skill.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSkill(skillToDelete.id || '', skillToDelete.name);
      showToast('Skill deleted successfully.', 'success');
      setSkillToDelete(null);
      fetchSkillsList();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete skill.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = skills.filter((s) => {
    const matchesCat = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search technologies or tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.actionBtnGroup}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.select}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="all">All Categories</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="tools">Tools</option>
          </select>

          <button type="button" className={styles.primaryAddBtn} onClick={handleOpenAdd}>
            <Plus size={17} />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.emptyState}>
            <Loader2 size={32} className="animate-spin" color="var(--accent-cyan)" />
            <p>Loading skills from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Cpu size={28} />
            </div>
            <h3>No skills found</h3>
            <p>Add a new technology or adjust your category filter.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Technology Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Proficiency Status</th>
                  <th className={styles.th}>Description</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((skill) => (
                  <tr key={skill.name} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.itemTitle}>{skill.name}</span>
                      <span className={styles.itemSub}>Icon: {skill.iconName}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${styles.badgeActive}`}>
                        {skill.category}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span
                        className={`${styles.badge} ${
                          skill.status === 'Currently Learning' || skill.status === 'Learning'
                            ? styles.badgeLearning
                            : styles.badgeActive
                        }`}
                      >
                        {skill.status || 'Intermediate'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.itemSub}>{skill.description.slice(0, 65)}...</span>
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <div className={styles.tableActions} style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleOpenEdit(skill)}
                          title="Edit skill"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => setSkillToDelete(skill)}
                          title="Delete skill"
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
                {editingSkill ? 'Edit Technology / Skill' : 'Add New Skill'}
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
              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Technology Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Next.js / MongoDB"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SkillCategory)}
                    className={styles.select}
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="tools">Tools</option>
                  </select>
                </div>
              </div>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Proficiency Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Learning' | 'Intermediate' | 'Advanced')}
                    className={styles.select}
                  >
                    <option value="Advanced">Advanced / Production</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Learning">Currently Learning</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Lucide Icon Name</label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className={styles.select}
                  >
                    <option value="Code2">Code2 (Generic Code)</option>
                    <option value="Zap">Zap (Lightning / Next.js)</option>
                    <option value="FileCode2">FileCode2 (TypeScript)</option>
                    <option value="Terminal">Terminal (JavaScript/CLI)</option>
                    <option value="Layout">Layout (HTML5)</option>
                    <option value="Palette">Palette (CSS3 / Styling)</option>
                    <option value="Server">Server (Node.js)</option>
                    <option value="ShieldCheck">ShieldCheck (Auth / Supabase)</option>
                    <option value="Database">Database (PostgreSQL / Relational)</option>
                    <option value="Layers">Layers (MongoDB / NoSQL)</option>
                    <option value="GitBranch">GitBranch (Git)</option>
                    <option value="Github">Github (GitHub Repo)</option>
                    <option value="Laptop">Laptop (VS Code / Editor)</option>
                    <option value="Cpu">Cpu (Antigravity IDE / Engine)</option>
                    <option value="Cloud">Cloud (Vercel / Cloud)</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="How you utilize this technology in real web applications..."
                  className={styles.textarea}
                />
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
                  {isSaving ? 'Saving...' : editingSkill ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(skillToDelete)}
        title="Delete Skill?"
        message={`Are you sure you want to delete "${skillToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Skill"
        onConfirm={handleDelete}
        onCancel={() => setSkillToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
