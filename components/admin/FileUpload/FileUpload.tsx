'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadFile, StorageBucket } from '@/lib/supabase/storage';
import { UploadCloud, X, FileText, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  bucket: StorageBucket;
  currentValue?: string;
  onUploadComplete: (url: string) => void;
  label?: string;
  helperText?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  currentValue = '',
  onUploadComplete,
  label = 'Upload File',
  helperText = 'PNG, JPG, WebP, SVG or PDF (max 10MB)',
  accept = 'image/*,.pdf'
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentValue);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    // If it's an image, create an immediate preview
    if (file.type.startsWith('image/')) {
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
    } else {
      setPreviewUrl(file.name);
    }

    try {
      const res = await uploadFile(bucket, file);
      if (res.success && res.url) {
        setPreviewUrl(res.url);
        onUploadComplete(res.url);
      } else {
        setUploadError(res.error || 'Upload failed. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl('');
    setUploadError(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = previewUrl && (
    previewUrl.startsWith('data:image') ||
    previewUrl.startsWith('blob:') ||
    previewUrl.endsWith('.svg') ||
    previewUrl.endsWith('.png') ||
    previewUrl.endsWith('.jpg') ||
    previewUrl.endsWith('.jpeg') ||
    previewUrl.endsWith('.webp') ||
    previewUrl.includes('images/')
  );

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>

      {previewUrl ? (
        <div className={styles.previewContainer}>
          {isImage ? (
            <div className={styles.imagePreviewWrapper}>
              <Image
                src={previewUrl}
                alt="Upload preview"
                fill
                className={styles.previewImage}
              />
            </div>
          ) : (
            <div className={styles.docPreview}>
              <FileText size={28} color="var(--accent-cyan)" />
              <div className={styles.docInfo}>
                <span className={styles.docName}>{previewUrl.split('/').pop() || 'Uploaded Document'}</span>
                <span className={styles.docStatus}>Ready to save</span>
              </div>
            </div>
          )}

          <div className={styles.previewActions}>
            <button
              type="button"
              className={styles.changeBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Replace
            </button>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              disabled={isUploading}
              aria-label="Remove uploaded file"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={styles.dropZone}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          {isUploading ? (
            <div className={styles.uploadingState}>
              <Loader2 size={28} className="animate-spin" color="var(--accent-cyan)" />
              <span className={styles.uploadingText}>Uploading to Supabase Storage...</span>
            </div>
          ) : (
            <div className={styles.idleState}>
              <div className={styles.iconCircle}>
                <UploadCloud size={24} />
              </div>
              <span className={styles.primaryDropText}>Click to browse or drag file here</span>
              <span className={styles.helperText}>{helperText}</span>
            </div>
          )}
        </div>
      )}

      {uploadError && <span className={styles.errorText}>{uploadError}</span>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />
    </div>
  );
};
