import { supabase } from './supabase';

export const handleWebhook = async (req) => {
  try {
    const { videoId, status, error, videoUrl } = req.body;

    if (!videoId) {
      throw new Error('Missing videoId');
    }

    // Update video status
    const { error: updateError } = await supabase
      .from('videos')
      .update({
        status: status || 'failed',
        error: error,
        video_path: videoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId);

    if (updateError) throw updateError;

    // Update generation status
    const { error: genError } = await supabase
      .from('video_generations')
      .update({
        status: status || 'failed',
        error: error,
        updated_at: new Date().toISOString()
      })
      .eq('video_id', videoId);

    if (genError) throw genError;

    return { success: true };
  } catch (error) {
    console.error('Webhook handler error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};