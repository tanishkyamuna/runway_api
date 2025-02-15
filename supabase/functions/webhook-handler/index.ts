import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get and validate request body
    const body = await req.json();
    if (!body.videoId || !body.userId || !body.imageUrl || !body.templateId) {
      throw new Error('Missing required fields: videoId, userId, imageUrl, or templateId');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify video exists and belongs to user
    const { data: video, error: videoCheckError } = await supabaseClient
      .from('videos')
      .select('id, status')
      .eq('id', body.videoId)
      .eq('user_id', body.userId)
      .single();

    if (videoCheckError || !video) {
      throw new Error('Invalid video ID or unauthorized access');
    }

    // Prevent duplicate processing
    if (video.status === 'processing') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Video is already being processed',
          videoId: body.videoId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update video status to processing
    const { error: updateError } = await supabaseClient
      .from('videos')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', body.videoId);

    if (updateError) {
      throw new Error(`Failed to update video status: ${updateError.message}`);
    }

    // Forward to Make.com webhook
    const makeWebhookUrl = 'https://hook.eu1.make.com/urhqhs1gwa9j3ykqnnpgmitsvpnkrmdk';
    
    // Add callback URLs
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is not set');
    }

    const enhancedBody = {
      ...body,
      callbacks: {
        success: `${supabaseUrl}/functions/v1/video-complete`,
        error: `${supabaseUrl}/functions/v1/video-error`
      }
    };

    // Send to Make.com with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        },
        body: JSON.stringify(enhancedBody),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Make.com webhook failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
      }

      // Handle text response
      const responseText = await response.text();
      if (responseText.toLowerCase() !== 'accepted') {
        throw new Error(`Unexpected response from Make.com: ${responseText}`);
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Video processing started successfully',
          videoId: body.videoId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request to Make.com timed out after 30 seconds');
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Webhook error:', {
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