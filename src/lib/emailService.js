import { supabase } from './supabase';
import toast from 'react-hot-toast';

class EmailService {
  async sendEmail(userId, templateType, data = {}) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!templateType) {
        throw new Error('Template type is required');
      }

      console.log('Sending email:', { userId, templateType, data });

      // Get user details
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Get template
      const { data: template, error: templateError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('type', templateType)
        .single();

      if (templateError) {
        console.error('Template error:', templateError);
        throw new Error('Failed to fetch email template');
      }

      if (!template) {
        throw new Error(`Email template "${templateType}" not found`);
      }

      // Replace template variables
      const subject = this.replaceVariables(template.subject, {
        ...data,
        name: user.user_metadata?.name || 'there'
      });

      const body = this.replaceVariables(template.body, {
        ...data,
        name: user.user_metadata?.name || 'there'
      });

      console.log('Prepared email:', { subject, body });

      // Log the email
      await this.logEmail(userId, templateType, 'sent', null, data);

      // In a real implementation, you would send the email here
      // For now, we'll just show a toast
      toast.success(`Email sent: ${subject}`);

      return { success: true, subject, body };
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Log the failed attempt
      await this.logEmail(userId, templateType, 'failed', error.message, data);
      
      throw error;
    }
  }

  // Helper method to replace template variables
  replaceVariables(template, data) {
    if (!template) return '';
    
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  }

  // Helper method to log emails
  async logEmail(userId, templateType, status, error = null, metadata = {}) {
    try {
      console.log('Logging email:', { userId, templateType, status, error, metadata });

      const { error: logError } = await supabase
        .from('email_logs')
        .insert({
          user_id: userId,
          template_type: templateType,
          status,
          error,
          metadata
        });

      if (logError) {
        console.error('Error logging email:', logError);
        throw logError;
      }
    } catch (err) {
      console.error('Error logging email:', err);
    }
  }

  // Helper methods for common notifications
  async sendWelcomeEmail(userId, credits) {
    return this.sendEmail(userId, 'welcome', { credits });
  }

  async sendVideoStartedEmail(userId, data) {
    return this.sendEmail(userId, 'video_started', data);
  }

  async sendVideoCompleteEmail(userId, data) {
    return this.sendEmail(userId, 'video_complete', data);
  }

  async sendLowCreditsEmail(userId, creditsRemaining) {
    return this.sendEmail(userId, 'low_credits', { credits_remaining: creditsRemaining });
  }
}

export const emailService = new EmailService();