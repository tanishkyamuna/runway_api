import React, { useState, useEffect } from 'react';
import { Check, CreditCard, Package, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const PricingPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('video_packages')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setPackages(data || []);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load pricing packages');
      toast.error('Failed to load pricing packages');
    } finally {
      setLoading(false);
    }
  };

  const getPackageIcon = (packageName) => {
    switch (packageName.toLowerCase()) {
      case 'starter pack':
        return <Package className="w-8 h-8 text-blue-500" />;
      case 'pro pack':
        return <Building2 className="w-8 h-8 text-blue-500" />;
      default:
        return <CreditCard className="w-8 h-8 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="p-8">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
                  <div className="h-12 bg-gray-200 rounded mb-6"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Credit Package</h1>
          <p className="text-xl text-gray-600 mb-8">
            Buy credits to create stunning property videos. No subscription required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                pkg.name === 'Pro Pack' ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              {pkg.name === 'Pro Pack' && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8">
                <div className="mb-6">
                  {getPackageIcon(pkg.name)}
                  <h2 className="text-2xl font-bold mt-4">{pkg.name}</h2>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold">${pkg.price}</p>
                    <p className="text-gray-500">one-time payment</p>
                  </div>
                  <p className="text-blue-600 font-medium mt-2">
                    {pkg.credits} video credits
                  </p>
                  <p className="text-gray-500 text-sm">
                    (${(pkg.price / pkg.credits).toFixed(2)} per video)
                  </p>
                </div>

                <div className="mb-6">
                  <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                    <input type="hidden" name="cmd" value="_s-xclick" />
                    <input type="hidden" name="hosted_button_id" value="QKWKQ2ZYPGQEC" />
                    <input type="hidden" name="currency_code" value="USD" />
                    <button 
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Buy Now with PayPal
                    </button>
                  </form>
                </div>

                <ul className="space-y-4">
                  {pkg.features?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">What's a video credit?</h3>
              <p className="text-gray-600">Each video credit allows you to create one property video. One credit is used per video generation, regardless of duration or resolution.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Do credits expire?</h3>
              <p className="text-gray-600">Yes, credits are valid for the period specified in your package (30-90 days from purchase date). Make sure to use them within this timeframe.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Can I buy more credits?</h3>
              <p className="text-gray-600">Yes! You can purchase additional credit packages at any time. Your new credits will be added to your existing balance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;