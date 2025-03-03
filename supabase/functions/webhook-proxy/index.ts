import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate content type
    if (req.headers.get("content-type") !== "application/json") {
      throw new Error("Expected content-type to be application/json");
    }

    const { url, payload } = await req.json()

    // Improved validation
    if (!url || typeof url !== 'string') {
      throw new Error('Missing or invalid URL')
    }

    if (!payload || typeof payload !== 'object') {
      throw new Error('Missing or invalid payload')
    }

    console.log('Forwarding request to:', url)
    console.log('Payload:', payload)

    // Add timeout for the fetch request
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      // Forward the request to the actual webhook
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

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

    } catch (fetchError) {
      clearTimeout(timeout);
      throw fetchError;
    }

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
        status: error.name === 'AbortError' ? 504 : 400
      }
    )
  }
})