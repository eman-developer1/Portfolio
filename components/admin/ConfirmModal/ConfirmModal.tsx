'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirmation Required',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = true,
  isLoading = false
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={isLoading ? undefined : onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onCancel}
          disabled={isLoading}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className={styles.content}>
          <div className={`${styles.iconBox} ${isDestructive ? styles.iconDestructive : ''}`}>
            <AlertTriangle size={24} />
          </div>

          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`${styles.confirmBtn} ${isDestructive ? styles.confirmDestructive : ''}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
