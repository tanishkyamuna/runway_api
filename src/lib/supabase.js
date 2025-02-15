import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Missing Supabase environment variables!
    Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY 
    in your .env file
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add data initialization helper with better error handling
export const initializeData = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test connection first
    const { data: connectionTest, error: connectionError } = await supabase
      .from('features')
      .select('count')
      .limit(1)
      .single();

    if (connectionError) {
      if (connectionError.code === 'PGRST301') {
        throw new Error('Failed to connect to Supabase - Invalid API key');
      }
      if (connectionError.code === '20014') {
        throw new Error('Failed to connect to Supabase - Database unavailable');
      }
      throw connectionError;
    }

    console.log('Supabase connection successful');
    return true;

  } catch (error) {
    console.error('Supabase initialization error:', {
      message: error.message,
      code: error.code,
      details: error.details
    });
    
    // Show user-friendly error
    let userMessage = 'Failed to connect to database. ';
    if (error.message.includes('API key')) {
      userMessage += 'Please check your Supabase configuration.';
    } else if (error.message.includes('unavailable')) {
      userMessage += 'The database is currently unavailable. Please try again later.';
    } else {
      userMessage += 'Please check your internet connection and try again.';
    }
    
    throw new Error(userMessage);
  }
};