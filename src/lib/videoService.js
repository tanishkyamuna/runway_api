import { supabase } from './supabase';
import { webhookService } from './webhookService';
import { storageService } from './storageService';
import toast from 'react-hot-toast';

/**
 * Service for managing video operations
 */
class VideoService {
  /**
   * Creates a new video
   * @param {string} userId - The user's ID
   * @param {File} imageFile - The image file
   * @param {Object} template - The selected template
   * @returns {Promise<Object>} The created video object
   */
  async createVideo(userId, imageFile, template) {
    let uploadedImage;
    let video;

    try {
      // Upload image
      uploadedImage = await storageService.uploadImage(userId, imageFile);

      // Create video
      video = await webhookService.createVideo(uploadedImage.url, template);

      return video;
    } catch (error) {
      // Clean up on error
      if (uploadedImage?.path) {
        await this._cleanupUploadedImage(uploadedImage.path);
      }
      throw error;
    }
  }

  /**
   * Gets videos for a user
   * @param {string} userId - The user's ID
   * @returns {Promise<Array>} List of user's videos
   */
  async getUserVideos(userId) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          template:templates(*),
          generation:video_generations(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        throw new Error('Failed to fetch videos');
      }

      return data || [];
    } catch (error) {
      console.error('Video fetch error:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      throw error;
    }
  }

  /**
   * Gets a video's public URL
   * @param {string} videoPath - Path to the video
   * @returns {Promise<string>} Public URL of the video
   */
  async getVideoUrl(videoPath) {
    try {
      if (!videoPath) {
        throw new Error('Video path is required');
      }

      const { data: { publicUrl }, error } = supabase.storage
        .from('videos')
        .getPublicUrl(videoPath);

      if (error) {
        console.error('Error getting video URL:', error);
        throw error;
      }

      return publicUrl;
    } catch (error) {
      console.error('Video URL error:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      throw error;
    }
  }

  /**
   * Cleans up an uploaded image on error
   * @private
   */
  async _cleanupUploadedImage(imagePath) {
    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([imagePath]);

      if (error) {
        console.error('Failed to cleanup image:', error);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

export const videoService = new VideoService();