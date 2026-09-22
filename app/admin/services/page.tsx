'use client';

import React, { useState, useEffect } from 'react';
import { Service } from '@/types';
import { getServices, saveService, deleteService } from '@/lib/supabase/db';
import { useToast } from '@/components/admin/Toast/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal/ConfirmModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Briefcase,
  CheckCircle,
  XCircle,
  X,
  Loader2
} from 'lucide-react';
import styles from '@/components/admin/ManagerShared.module.css';

export default function AdminServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Globe');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [active, setActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  // Delete State
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchServicesList = async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch {
      showToast('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesList();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setTitle('');
    setDescription('');
    setIconName('Globe');
    setHighlightsInput('');
    setActive(true);
    setDisplayOrder(services.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setIconName(service.iconName);
    setHighlightsInput(service.highlights ? service.highlights.join('\n') : '');
    setActive(service.active !== false);
    setDisplayOrder(service.displayOrder || 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please provide a service title and description.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const highlightsArray = highlightsInput
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      const payload: Omit<Service, 'id'> & { id?: string } = {
        id: editingService?.id,
        title: title.trim(),
        description: description.trim(),
        iconName: iconName.trim() || 'Globe',
        highlights: highlightsArray,
        active: active,
        displayOrder: displayOrder
      };

      await saveService(payload);
      showToast(
        editingService ? 'Service updated successfully.' : 'Service added successfully.',
        'success'
      );
      setIsModalOpen(false);
      fetchServicesList();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save service.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      await deleteService(serviceToDelete.id);
      showToast('Service deleted successfully.', 'success');
      setServiceToDelete(null);
      fetchServicesList();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete service.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search service offerings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button type="button" className={styles.primaryAddBtn} onClick={handleOpenAdd}>
          <Plus size={17} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.emptyState}>
            <Loader2 size={32} className="animate-spin" color="var(--accent-cyan)" />
            <p>Loading services from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Briefcase size={28} />
            </div>
            <h3>No services found</h3>
            <p>Add your first service offering to display on your public portfolio.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Service Offering</th>
                  <th className={styles.th}>Icon</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Key Highlights</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((service) => (
                  <tr key={service.id || service.title} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.itemTitle}>{service.title}</span>
                      <span className={styles.itemSub}>{service.description.slice(0, 60)}...</span>
                    </td>
                    <td className={styles.td}>{service.iconName}</td>
                    <td className={styles.td}>
                      <span
                        className={`${styles.badge} ${
                          service.active !== false ? styles.badgeActive : styles.badgeDraft
                        }`}
                      >
                        {service.active !== false ? (
                          <>
                            <CheckCircle size={11} /> Active
                          </>
                        ) : (
                          <>
                            <XCircle size={11} /> Disabled
                          </>
                        )}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.itemSub}>
                        {service.highlights.length} highlight points
                      </span>
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <div className={styles.tableActions} style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleOpenEdit(service)}
                          title="Edit service"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => setServiceToDelete(service)}
                          title="Delete service"
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
                {editingService ? 'Edit Service Offering' : 'Add New Service'}
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
                  <label className={styles.label}>Service Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Next.js Web Applications"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Icon</label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className={styles.select}
                  >
                    <option value="Globe">Globe (Websites)</option>
                    <option value="Rocket">Rocket (Landing Pages)</option>
                    <option value="Code2">Code2 (React Apps)</option>
                    <option value="Zap">Zap (Next.js)</option>
                    <option value="BarChart3">BarChart3 (Admin Dashboards)</option>
                    <option value="Layers">Layers (Full-Stack Applications)</option>
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
                  placeholder="Overview of what you deliver..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Key Highlights (one per line)</label>
                <textarea
                  rows={4}
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="Custom bespoke UI reflecting your unique brand&#10;Mobile-first responsive architecture&#10;SEO optimization and fast loading"
                  className={styles.textarea}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="active-check"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
                />
                <label htmlFor="active-check" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Active (Visible on public portfolio services section)
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
                  {isSaving ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(serviceToDelete)}
        title="Delete Service?"
        message={`Are you sure you want to delete "${serviceToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Service"
        onConfirm={handleDelete}
        onCancel={() => setServiceToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
