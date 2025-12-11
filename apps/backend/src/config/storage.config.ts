/**
 * Storage configuration for file uploads
 */
export const storageConfig = () => ({
  upload: {
    dest: process.env.UPLOAD_DIR || 'public/uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    maxFiles: parseInt(process.env.MAX_FILES || '10'),
  },
});

export const STORAGE_CONFIG = {
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'public/uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  MAX_FILES: parseInt(process.env.MAX_FILES || '10'),
  ALLOWED_MIMES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
};
