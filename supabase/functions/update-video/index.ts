import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const { videoId, status, progress = null, error = null, videoUrl = null } = body

    console.log('Received update:', { videoId, status, progress, error, videoUrl })

    if (!videoId || !status) {
      throw new Error('Missing required fields')
    }

    // Validate status
    const validStatuses = ['processing', 'completed', 'failed']
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status')
    }

    // Get video to verify it exists
    const { data: video, error: videoError } = await supabaseClient
      .from('videos')
      .select('user_id')
      .eq('id', videoId)
      .single()

    if (videoError || !video) {
      throw new Error('Video not found')
    }

    // Update video status
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (error) updates.error = error
    if (videoUrl) updates.video_path = videoUrl

    const { error: updateError } = await supabaseClient
      .from('videos')
      .update(updates)
      .eq('id', videoId)

    if (updateError) throw updateError

    // Update generation status
    const genUpdates: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (progress !== null) genUpdates.progress = progress
    if (error) genUpdates.error = error

    const { error: genError } = await supabaseClient
      .from('video_generations')
      .update(genUpdates)
      .eq('video_id', videoId)

    if (genError) throw genError

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})