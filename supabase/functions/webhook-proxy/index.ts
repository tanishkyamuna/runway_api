import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

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
    const { url, payload } = await req.json()

    if (!url || !payload) {
      throw new Error('Missing required fields')
    }

    console.log('Forwarding request to:', url)
    console.log('Payload:', payload)

    // Forward the request to the actual webhook
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    // Clone response for multiple reads
    const responseClone = response.clone();

    // Try to parse response as JSON first
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      // If JSON parsing fails, try text
      try {
        responseData = await responseClone.text();
      } catch {
        responseData = 'No response data available';
      }
    }

    console.log('Webhook response:', {
      status: response.status,
      data: responseData
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.status} ${
        typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
      }`);
    }

    return new Response(
      typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: response.status
      }
    )

  } catch (error) {
    console.error('Proxy error:', {
      message: error.message,
      stack: error.stack
    });

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})