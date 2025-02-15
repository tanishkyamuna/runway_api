import { supabase } from './supabase';

/**
 * Service for handling file storage operations
 */
class StorageService {
  constructor() {
    // Constants
    this.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    this.ALLOWED_TYPES = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
  }

  /**
   * Uploads an image file to storage
   * @param {File} file - The image file to upload
   * @param {string} userId - The user's ID
   * @returns {Promise<{path: string, url: string}>}
   * @throws {Error} If validation fails or upload fails
   */
  async uploadImage(file, userId) {
    try {
      // Validate inputs
      this._validateFile(file);
      this._validateUserId(userId);

      // Generate unique file path
      const { filePath, fileName } = this._generateFilePath(file, userId);

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Failed to get public URL');
      }

      return {
        path: filePath,
        url: publicUrl
      };
    } catch (error) {
      console.error('Storage service error:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      throw error;
    }
  }

  /**
   * Validates the file
   * @private
   */
  _validateFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File size must be less than 5MB');
    }
  }

  /**
   * Validates the user ID
   * @private
   */
  _validateUserId(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
  }

  /**
   * Generates a unique file path
   * @private
   */
  _generateFilePath(file, userId) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    return { filePath, fileName };
  }

  /**
   * Downloads a video file
   * @param {string} videoPath - Path to the video file
   * @returns {Promise<Blob>}
   * @throws {Error} If download fails
   */
  async downloadVideo(videoPath) {
    try {
      if (!videoPath) {
        throw new Error('Video path is required');
      }

      const { data, error } = await supabase.storage
        .from('videos')
        .download(videoPath);

      if (error) {
        console.error('Download error:', error);
        throw new Error('Failed to download video');
      }

      return data;
    } catch (error) {
      console.error('Download error:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      throw error;
    }
  }
}

export const storageService = new StorageService();