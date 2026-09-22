import { supabase, isSupabaseConfigured } from './client';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export type StorageBucket = 'certificates' | 'projects' | 'assignments' | 'portfolio';

const ALLOWED_MIME_TYPES: Record<StorageBucket, string[]> = {
  certificates: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'],
  projects: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'],
  assignments: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ],
  portfolio: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

export const uploadFile = async (
  bucket: StorageBucket,
  file: File,
  customPath?: string
): Promise<UploadResult> => {
  // 1. Validate File Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `File exceeds maximum allowed size of 10MB (Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`
    };
  }

  // 2. Validate MIME Type
  const allowed = ALLOWED_MIME_TYPES[bucket];
  if (allowed && !allowed.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type: ${file.type}. Allowed formats: ${allowed.join(', ')}`
    };
  }

  // 3. Check Supabase Config
  if (!isSupabaseConfigured) {
    // If Supabase is not connected yet, return local object URL preview for testing
    const localUrl = URL.createObjectURL(file);
    return {
      success: true,
      url: localUrl
    };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'dat';
    const fileName = customPath || `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { success: true, url: data.publicUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'File upload failed. Please try again.';
    return { success: false, error: message };
  }
};

export const deleteFileFromUrl = async (bucket: StorageBucket, fileUrl: string): Promise<boolean> => {
  if (!isSupabaseConfigured || !fileUrl) return true;

  try {
    const urlParts = fileUrl.split(`/${bucket}/`);
    if (urlParts.length < 2) return true;
    const filePath = urlParts[1];

    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    return !error;
  } catch {
    return false;
  }
};
