import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { videoId, error: videoError, userId } = body

    if (!videoId) throw new Error('videoId is required')
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

    // Don't update if already failed
    if (video.status === 'failed') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Video is already marked as failed',
          data: { videoId, status: 'failed' }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update video status
    const { error: updateError } = await supabaseClient
      .from('videos')
      .update({ 
        status: 'failed',
        error: videoError?.message || 'Video generation failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId)
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Update generation status
    const { error: genError } = await supabaseClient
      .from('video_generations')
      .update({
        status: 'failed',
        error: videoError?.message || 'Video generation failed',
        updated_at: new Date().toISOString()
      })
      .eq('video_id', videoId);

    if (genError) throw genError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Video error recorded successfully',
        data: { videoId, status: 'failed' }
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