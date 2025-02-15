import { supabase } from './supabase';

class UserService {
  async addCreditsToUser(email, credits) {
    try {
      // Get user by email
      const { data: { users }, error: userError } = await supabase.auth.admin
        .listUsers({
          filters: {
            email: email
          }
        });

      if (userError) throw userError;
      
      const user = users?.[0];
      if (!user) throw new Error('User not found');

      // Add credits
      const { error: creditsError } = await supabase.rpc('add_video_credits', {
        user_id: user.id,
        credits_to_add: credits
      });

      if (creditsError) throw creditsError;

      return { success: true };
    } catch (error) {
      console.error('Error adding credits:', error);
      throw error;
    }
  }
}

export const userService = new UserService();