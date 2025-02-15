import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { affiliateService } from '../lib/affiliateService';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, DollarSign, Users, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const AffiliateStats = () => {
  const [affiliateData, setAffiliateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to access the affiliate dashboard');
        navigate('/login');
        return;
      }

      const data = await affiliateService.getAffiliateInfo(user.id);
      setAffiliateData(data);
    } catch (error) {
      console.error('Error loading affiliate data:', error);
      toast.error('Failed to load affiliate data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!affiliateData?.code) {
      toast.error('No referral link available');
      return;
    }
    
    const referralLink = `${window.location.origin}/?ref=${affiliateData.code}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (!affiliateData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Become an Affiliate</h2>
            <p className="text-gray-600 mb-8">
              Share PropVid with your audience and earn 10% commission on every sale!
            </p>
            <button
              onClick={async () => {
                try {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) {
                    toast.error('Please sign in to become an affiliate');
                    navigate('/login');
                    return;
                  }
                  await affiliateService.createAffiliate(user.id);
                  toast.success('Affiliate account created!');
                  loadAffiliateData();
                } catch (error) {
                  console.error('Error creating affiliate:', error);
                  toast.error('Failed to create affiliate account');
                }
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join Affiliate Program
            </button>
          </div>
        </div>
      </div>
    );
  }

  const referrals = affiliateData.affiliate_referrals || [];
  const totalEarnings = affiliateData.total_earnings || 0;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const convertedReferrals = referrals.filter(r => r.status === 'converted').length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Affiliate Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-green-500" />
              <h3 className="font-bold">Total Earnings</h3>
            </div>
            <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-blue-500" />
              <h3 className="font-bold">Total Referrals</h3>
            </div>
            <p className="text-2xl font-bold">{referrals.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-purple-500" />
              <h3 className="font-bold">Conversion Rate</h3>
            </div>
            <p className="text-2xl font-bold">
              {referrals.length ? 
                ((convertedReferrals / referrals.length) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="font-bold mb-4">Your Referral Link</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={`${window.location.origin}/?ref=${affiliateData.code}`}
              readOnly
              className="flex-1 p-3 border rounded bg-gray-50"
            />
            <button
              onClick={copyReferralLink}
              className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-bold">Recent Referrals</h3>
          </div>
          <div className="p-6">
            {referrals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map(referral => (
                      <tr key={referral.id} className="border-b last:border-0">
                        <td className="py-3">
                          {new Date(referral.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            referral.status === 'converted' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {referral.status}
                          </span>
                        </td>
                        <td className="py-3">
                          {referral.commission_amount 
                            ? `$${referral.commission_amount.toFixed(2)}`
                            : '-'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No referrals yet. Share your link to start earning!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateStats;