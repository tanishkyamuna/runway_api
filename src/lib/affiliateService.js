import { supabase } from './supabase';
import toast from 'react-hot-toast';

class AffiliateService {
  /**
   * Creates a new affiliate account for a user
   */
  async createAffiliate(userId) {
    try {
      const { data, error } = await supabase
        .rpc('create_affiliate', { user_id: userId });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating affiliate:', error);
      throw error;
    }
  }

  /**
   * Gets affiliate information for a user
   */
  async getAffiliateInfo(userId) {
    try {
      // Use RPC function to get affiliate info
      const { data: affiliateInfo, error: affiliateError } = await supabase
        .rpc('get_affiliate_info', { user_id: userId });

      if (affiliateError) throw affiliateError;

      // Get referrals separately
      const { data: referrals, error: referralsError } = await supabase
        .from('affiliate_referrals')
        .select('*')
        .eq('affiliate_id', affiliateInfo[0]?.id)
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;

      return {
        ...affiliateInfo[0],
        affiliate_referrals: referrals || []
      };
    } catch (error) {
      console.error('Error getting affiliate info:', error);
      throw error;
    }
  }

  /**
   * Records a referral visit
   */
  async recordReferralVisit(affiliateCode) {
    try {
      // Store referral code in localStorage
      localStorage.setItem('referralCode', affiliateCode);
      
      const { data: affiliate, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id, code')
        .eq('code', affiliateCode)
        .single();

      if (affiliateError) throw affiliateError;

      // Create referral record
      const { error: referralError } = await supabase
        .from('affiliate_referrals')
        .insert({
          affiliate_id: affiliate.id,
          status: 'pending'
        });

      if (referralError) throw referralError;

      return true;
    } catch (error) {
      console.error('Error recording referral:', error);
      return false;
    }
  }

  /**
   * Converts a referral after payment
   */
  async convertReferral(userId, amount) {
    try {
      const referralCode = localStorage.getItem('referralCode');
      if (!referralCode) return;

      const { data: affiliate, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id, commission_rate')
        .eq('code', referralCode)
        .single();

      if (affiliateError) throw affiliateError;

      const commissionAmount = (amount * affiliate.commission_rate) / 100;

      // Update referral
      const { error: updateError } = await supabase
        .from('affiliate_referrals')
        .update({
          referred_user_id: userId,
          status: 'converted',
          commission_amount: commissionAmount
        })
        .eq('affiliate_id', affiliate.id)
        .eq('status', 'pending');

      if (updateError) throw updateError;

      // Update total earnings
      const { error: earningsError } = await supabase
        .rpc('update_affiliate_earnings', {
          affiliate_id: affiliate.id,
          amount: commissionAmount
        });

      if (earningsError) throw earningsError;

      // Clear referral code
      localStorage.removeItem('referralCode');

      return true;
    } catch (error) {
      console.error('Error converting referral:', error);
      return false;
    }
  }
}

export const affiliateService = new AffiliateService();