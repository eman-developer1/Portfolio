'use client';

import React, { useState, useEffect } from 'react';
import { Assignment } from '@/types';
import { getAssignments, saveAssignment, deleteAssignment } from '@/lib/supabase/db';
import { useToast } from '@/components/admin/Toast/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal/ConfirmModal';
import { FileUpload } from '@/components/admin/FileUpload/FileUpload';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BookMarked,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  Loader2
} from 'lucide-react';
import { GithubIcon } from '@/components/Common/Icons';
import styles from '@/components/admin/ManagerShared.module.css';

export default function AdminAssignmentsPage() {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [technologiesInput, setTechnologiesInput] = useState('');
  const [assignmentDate, setAssignmentDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [status, setStatus] = useState<'Completed' | 'In Progress'>('Completed');
  const [featured, setFeatured] = useState(false);

  // Delete State
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAssignmentsList = async () => {
    setLoading(true);
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch {
      showToast('Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentsList();
  }, []);

  const handleOpenAdd = () => {
    setEditingAssignment(null);
    setTitle('');
    setDescription('');
    setCategory('Backend Development');
    setTechnologiesInput('');
    setAssignmentDate(new Date().getFullYear().toString());
    setImageUrl('');
    setFileUrl('');
    setLiveUrl('');
    setGithubUrl('');
    setStatus('Completed');
    setFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (assign: Assignment) => {
    setEditingAssignment(assign);
    setTitle(assign.title);
    setDescription(assign.description);
    setCategory(assign.category);
    setTechnologiesInput(assign.technologies.join(', '));
    setAssignmentDate(assign.assignmentDate);
    setImageUrl(assign.imageUrl || '');
    setFileUrl(assign.fileUrl || '');
    setLiveUrl(assign.liveUrl || '');
    setGithubUrl(assign.githubUrl || '');
    setStatus(assign.status || 'Completed');
    setFeatured(Boolean(assign.featured));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category.trim()) {
      showToast('Please fill in title, description, and category.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const techArray = technologiesInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Omit<Assignment, 'id'> & { id?: string } = {
        id: editingAssignment ? editingAssignment.id : undefined,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        technologies: techArray,
        assignmentDate: assignmentDate.trim() || new Date().getFullYear().toString(),
        imageUrl: imageUrl,
        fileUrl: fileUrl,
        liveUrl: liveUrl.trim(),
        githubUrl: githubUrl.trim(),
        status: status,
        featured: featured
      };

      await saveAssignment(payload);
      showToast(
        editingAssignment
          ? 'Assignment updated successfully.'
          : 'Assignment added successfully.',
        'success'
      );
      setIsModalOpen(false);
      fetchAssignmentsList();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save assignment.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!assignmentToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAssignment(assignmentToDelete.id);
      showToast('Assignment deleted successfully.', 'success');
      setAssignmentToDelete(null);
      fetchAssignmentsList();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete assignment.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      {/* Top Bar: Search & Add Button */}
      <div className={styles.topBar}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search assignments by title, category, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button type="button" className={styles.primaryAddBtn} onClick={handleOpenAdd}>
          <Plus size={17} />
          <span>Add Assignment</span>
        </button>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.emptyState}>
            <Loader2 size={32} className="animate-spin" color="var(--accent-cyan)" />
            <p>Loading assignments from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <BookMarked size={28} />
            </div>
            <h3>No assignments found</h3>
            <p>Add your first coursework assignment or practical lab report.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Assignment Title</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Date &amp; Status</th>
                  <th className={styles.th}>Technologies</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((assign) => (
                  <tr key={assign.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.itemTitle}>{assign.title}</span>
                      <span className={styles.itemSub}>{assign.description.slice(0, 60)}...</span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${styles.badgeActive}`}>
                        {assign.category}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${assign.status === 'Completed' ? styles.badgeActive : styles.badgeLearning}`}>
                        {assign.status === 'Completed' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {assign.status}
                      </span>
                      <span className={styles.itemSub}>{assign.assignmentDate}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.itemSub}>
                        {assign.technologies.slice(0, 3).join(', ')}
                        {assign.technologies.length > 3 && ` +${assign.technologies.length - 3}`}
                      </span>
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <div className={styles.tableActions} style={{ justifyContent: 'flex-end' }}>
                        {assign.fileUrl && (
                          <a
                            href={assign.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewBtn}
                            title="Download / View File"
                          >
                            <Download size={15} />
                          </a>
                        )}
                        {assign.liveUrl && (
                          <a
                            href={assign.liveUrl}
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
                          onClick={() => handleOpenEdit(assign)}
                          title="Edit assignment"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => setAssignmentToDelete(assign)}
                          title="Delete assignment"
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
                {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
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
                <label className={styles.label}>Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full-Stack E-Commerce REST API"
                  className={styles.input}
                />
              </div>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Subject / Category *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Backend Development / Algorithms"
                    className={styles.input}
                  />
                </div>

                <div className={styles.twoCols}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Date *</label>
                    <input
                      type="text"
                      required
                      value={assignmentDate}
                      onChange={(e) => setAssignmentDate(e.target.value)}
                      placeholder="2025"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'Completed' | 'In Progress')}
                      className={styles.select}
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of the assignment problem, solution, and architecture..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Technologies (comma separated)</label>
                <input
                  type="text"
                  value={technologiesInput}
                  onChange={(e) => setTechnologiesInput(e.target.value)}
                  placeholder="Node.js, Express, Supabase, TypeScript, JWT"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Assignment Preview Image</label>
                <FileUpload
                  bucket="assignments"
                  currentValue={imageUrl}
                  onUploadComplete={(url) => setImageUrl(url)}
                  label="Upload Image Preview"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Assignment Deliverable File (PDF / ZIP / DOCX)</label>
                <FileUpload
                  bucket="assignments"
                  currentValue={fileUrl}
                  onUploadComplete={(url) => setFileUrl(url)}
                  label="Upload Assignment Document / Code ZIP"
                  accept=".pdf,.zip,.doc,.docx,image/*"
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
                    placeholder="https://github.com/eman-developer1/assignment"
                    className={styles.input}
                  />
                </div>
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
                  {isSaving ? 'Saving...' : editingAssignment ? 'Update Assignment' : 'Add Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(assignmentToDelete)}
        title="Delete Assignment?"
        message={`Are you sure you want to delete "${assignmentToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Assignment"
        onConfirm={handleDelete}
        onCancel={() => setAssignmentToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
