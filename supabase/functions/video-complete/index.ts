import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { videoId, videoUrl, userId } = body

    if (!videoId) throw new Error('videoId is required')
    if (!videoUrl) throw new Error('videoUrl is required')
    if (!userId) throw new Error('userId is required')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify video exists and belongs to user
    const { data: video, error: videoCheckError } = await supabaseClient
      .from('videos')
      .select('id, status')
      .eq('id', videoId)
      .eq('user_id', userId)
      .single();

    if (videoCheckError || !video) {
      throw new Error('Invalid video ID or unauthorized access');
    }

    // Prevent duplicate completion
    if (video.status === 'completed') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Video is already completed',
          data: { videoId, status: 'completed' }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update video status
    const { error: videoError } = await supabaseClient
      .from('videos')
      .update({ 
        status: 'completed',
        video_path: videoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId)
      .eq('user_id', userId);

    if (videoError) throw videoError;

    // Update generation status
    const { error: genError } = await supabaseClient
      .from('video_generations')
      .update({
        status: 'completed',
        progress: 100,
        updated_at: new Date().toISOString()
      })
      .eq('video_id', videoId);

    if (genError) throw genError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Video completed successfully',
        data: { videoId, status: 'completed' }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', {
      message: error.message,
      stack: error.stack
    });

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
})