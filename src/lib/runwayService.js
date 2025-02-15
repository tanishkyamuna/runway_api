import { supabase } from './supabase';
import toast from 'react-hot-toast';

class RunwayService {
  async createVideo(imageUrl, template) {
    try {
      if (!imageUrl) {
        throw new Error('Image URL is required');
      }

      if (!template?.id) {
        throw new Error('Template ID is required');
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Create video record first
      const { data: video, error: videoError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          template_id: template.id,
          image_path: imageUrl,
          status: 'processing'
        })
        .select()
        .single();

      if (videoError) throw videoError;

      // Create generation record
      const { error: genError } = await supabase
        .from('video_generations')
        .insert({
          video_id: video.id,
          status: 'processing',
          progress: 0
        });

      if (genError) throw genError;

      // Call webhook-handler Edge Function
      const { data: webhookResponse, error: webhookError } = await supabase.functions
        .invoke('webhook-handler', {
          body: {
            videoId: video.id,
            userId: user.id,
            imageUrl: imageUrl,
            templateId: template.id,
            template: {
              id: template.id,
              title: template.title,
              prompt: template.prompt || `Create a cinematic property video showcasing ${template.title}`,
              style: template.style || 'cinematic',
              duration: template.duration || 10
            }
          }
        });

      if (webhookError) throw webhookError;

      // Subscribe to realtime updates
      const channel = supabase
        .channel(`video-${video.id}`)
        .on('postgres_changes', 
          { 
            event: 'UPDATE',
            schema: 'public',
            table: 'videos',
            filter: `id=eq.${video.id}`
          },
          (payload) => {
            if (payload.new.status === 'completed') {
              toast.success('Video generation completed!');
              channel.unsubscribe();
            } else if (payload.new.status === 'failed') {
              toast.error('Video generation failed');
              channel.unsubscribe();
            }
          }
        )
        .subscribe();

      return { success: true, videoId: video.id };

    } catch (error) {
      console.error('Video creation error:', error);
      throw error;
    }
  }
}

export const runwayService = new RunwayService();