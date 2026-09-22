'use client';

import React, { useState, useEffect } from 'react';
import { Certificate } from '@/types';
import { getCertificates, saveCertificate, deleteCertificate } from '@/lib/supabase/db';
import { useToast } from '@/components/admin/Toast/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal/ConfirmModal';
import { FileUpload } from '@/components/admin/FileUpload/FileUpload';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Award,
  Calendar,
  ShieldCheck,
  X,
  Loader2
} from 'lucide-react';
import styles from '@/components/admin/ManagerShared.module.css';

export default function AdminCertificatesPage() {
  const { showToast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [description, setDescription] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [status, setStatus] = useState<'active' | 'archived'>('active');

  // Delete State
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const data = await getCertificates();
      setCertificates(data);
    } catch {
      showToast('Failed to load certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleOpenAdd = () => {
    setEditingCert(null);
    setTitle('');
    setIssuer('');
    setDate(new Date().getFullYear().toString());
    setCredentialId('');
    setDescription('');
    setVerificationUrl('');
    setFileUrl('');
    setSkillsInput('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setDate(cert.date);
    setCredentialId(cert.credentialId || '');
    setDescription(cert.description || '');
    setVerificationUrl(cert.verificationUrl || '');
    setFileUrl(cert.image || cert.fileUrl || '');
    setSkillsInput(cert.skillsCovered ? cert.skillsCovered.join(', ') : '');
    setStatus(cert.status || 'active');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim() || !date.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!fileUrl) {
      showToast('Please upload a certificate image or document file.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Omit<Certificate, 'id'> & { id?: string } = {
        id: editingCert ? editingCert.id : undefined,
        title: title.trim(),
        issuer: issuer.trim(),
        date: date.trim(),
        credentialId: credentialId.trim(),
        description: description.trim(),
        verificationUrl: verificationUrl.trim(),
        image: fileUrl,
        fileUrl: fileUrl,
        skillsCovered: skillsArray,
        status: status
      };

      await saveCertificate(payload);
      showToast(
        editingCert
          ? 'Certificate updated successfully.'
          : 'Certificate added successfully.',
        'success'
      );
      setIsModalOpen(false);
      fetchCerts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save certificate.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!certToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCertificate(certToDelete.id);
      showToast('Certificate deleted successfully.', 'success');
      setCertToDelete(null);
      fetchCerts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete certificate.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = certificates.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.credentialId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Top Bar: Search & Add Button */}
      <div className={styles.topBar}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search certificates by title or issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button type="button" className={styles.primaryAddBtn} onClick={handleOpenAdd}>
          <Plus size={17} />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.emptyState}>
            <Loader2 size={32} className="animate-spin" color="var(--accent-cyan)" />
            <p>Loading certificates from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Award size={28} />
            </div>
            <h3>No certificates found</h3>
            <p>Add your first certificate or adjust your search filter.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Certificate Title</th>
                  <th className={styles.th}>Issuer</th>
                  <th className={styles.th}>Date &amp; ID</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cert) => (
                  <tr key={cert.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.itemTitle}>{cert.title}</span>
                      {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                        <span className={styles.itemSub}>
                          Skills: {cert.skillsCovered.slice(0, 3).join(', ')}
                        </span>
                      )}
                    </td>
                    <td className={styles.td}>{cert.issuer}</td>
                    <td className={styles.td}>
                      <div>{cert.date}</div>
                      <span className={styles.itemSub}>{cert.credentialId || 'No ID'}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${cert.status === 'active' ? styles.badgeActive : styles.badgeDraft}`}>
                        {cert.status || 'active'}
                      </span>
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <div className={styles.tableActions} style={{ justifyContent: 'flex-end' }}>
                        {cert.fileUrl && (
                          <a
                            href={cert.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewBtn}
                            title="View certificate"
                          >
                            <Eye size={15} />
                          </a>
                        )}
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleOpenEdit(cert)}
                          title="Edit certificate"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => setCertToDelete(cert)}
                          title="Delete certificate"
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
                {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
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
                <label className={styles.label}>Certificate Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Next.js & React Full-Stack Architecture"
                  className={styles.input}
                />
              </div>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="e.g. Meta / Google / Udemy"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Year / Issue Date *</label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. 2025"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Credential ID</label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g. CERT-EK-98241"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'archived')}
                    className={styles.select}
                  >
                    <option value="active">Active (Visible on Public Portfolio)</option>
                    <option value="archived">Archived (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Skills Assessed (comma separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="Next.js App Router, React 19, TypeScript, SSR"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Certificate Image or PDF *</label>
                <FileUpload
                  bucket="certificates"
                  currentValue={fileUrl}
                  onUploadComplete={(url) => setFileUrl(url)}
                  label="Upload Certificate (PNG, JPG, WebP, SVG, PDF)"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>External Verification URL</label>
                <input
                  type="url"
                  value={verificationUrl}
                  onChange={(e) => setVerificationUrl(e.target.value)}
                  placeholder="https://example.com/verify/CERT-EK-98241"
                  className={styles.input}
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
                  {isSaving ? 'Saving...' : editingCert ? 'Update Certificate' : 'Add Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(certToDelete)}
        title="Delete Certificate?"
        message={`Are you sure you want to delete "${certToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Certificate"
        onConfirm={handleDelete}
        onCancel={() => setCertToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
