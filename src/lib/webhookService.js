import { supabase } from './supabase';
import { retryService } from './retryService';
import toast from 'react-hot-toast';

class WebhookService {
  // Production Make.com webhook URL - DO NOT CHANGE
  static MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/urhqhs1gwa9j3ykqnnpgmitsvpnkrmdk';

  async createVideo(imageUrl, template) {
    try {
      if (!imageUrl) throw new Error('Image URL is required');
      if (!template?.id) throw new Error('Template ID is required');

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error(`Authentication error: ${userError.message}`);
      if (!user) throw new Error('Please sign in to create videos');

      // Create video record
      const { data: video, error: videoError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          template_id: template.id,
          image_path: imageUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (videoError) {
        console.error('Video creation error:', videoError);
        throw new Error(`Failed to create video record: ${videoError.message}`);
      }

      // Create generation record
      const { error: genError } = await supabase
        .from('video_generations')
        .insert({
          video_id: video.id,
          status: 'pending',
          progress: 0
        });

      if (genError) {
        console.error('Generation record error:', genError);
        throw new Error(`Failed to create generation record: ${genError.message}`);
      }

      // Convert orientation format
      const aspectRatio = template.orientation === 'portrait' ? '9:16' : '16:9';

      // Call Make.com webhook with retries
      const result = await retryService.withRetries(
        async (attempt) => {
          console.log(`Attempt ${attempt} to call webhook`);

          const response = await fetch(WebhookService.MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'text/plain'
            },
            body: JSON.stringify({
              videoId: video.id,
              userId: user.id,
              imageUrl: imageUrl,
              templateId: template.id,
              template: {
                id: template.id,
                title: template.title,
                prompt: template.prompt || `Create a cinematic property video showcasing ${template.title}`,
                style: template.style || 'cinematic',
                duration: template.duration || 10,
                aspectRatio: aspectRatio // Using standardized format
              },
              callbacks: {
                success: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/video-complete`,
                error: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/video-error`
              }
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Make.com webhook failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
          }

          // Handle text response
          const responseText = await response.text();
          if (responseText.toLowerCase() !== 'accepted') {
            throw new Error(`Unexpected response from Make.com: ${responseText}`);
          }

          return { success: true };
        },
        {
          maxRetries: 3,
          timeout: 30000,
          onRetry: (attempt, error) => {
            console.warn(`Retry ${attempt} due to error:`, error);
            toast.error(`Retrying video creation (${attempt}/3)...`);
          }
        }
      );

      // Update video status to processing
      const { error: updateError } = await supabase
        .from('videos')
        .update({ 
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', video.id);

      if (updateError) {
        console.error('Error updating video status:', updateError);
      }

      return { success: true, videoId: video.id };

    } catch (error) {
      console.error('Error creating video:', error);

      // Show user-friendly error message
      let userMessage = 'Failed to create video. ';
      if (error.message.includes('Authentication')) {
        userMessage += 'Please sign in and try again.';
      } else if (error.message.includes('timeout')) {
        userMessage += 'The request timed out. Please try again.';
      } else if (error.message.includes('network')) {
        userMessage += 'Please check your internet connection.';
      } else {
        userMessage += 'Please try again later.';
      }

      toast.error(userMessage);
      throw error;
    }
  }
}

// Freeze the webhook service to prevent modifications
Object.freeze(WebhookService);
Object.freeze(WebhookService.prototype);

export const webhookService = new WebhookService();
Object.freeze(webhookService);