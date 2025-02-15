import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, User, Instagram, GitBranch as BrandTiktok, Users, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const InfluencerSignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    instagramUrl: '',
    tiktokUrl: '',
    niche: '',
    followersCount: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign up user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            is_influencer: true,
            instagram_url: formData.instagramUrl,
            tiktok_url: formData.tiktokUrl,
            niche: formData.niche,
            followers_count: parseInt(formData.followersCount),
          }
        }
      });

      if (error) throw error;

      // Create affiliate account automatically
      await supabase.rpc('create_affiliate', { user_id: data.user.id });

      toast.success('Account created successfully! You can now log in.');
      navigate('/influencer/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join as an Influencer
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Partner with us and earn 10% commission on every sale
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Your Name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            {/* Instagram URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instagram Profile URL
              </label>
              <div className="mt-1 relative">
                <Instagram className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="url"
                  required
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="https://instagram.com/yourusername"
                />
              </div>
            </div>

            {/* TikTok URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                TikTok Profile URL
              </label>
              <div className="mt-1 relative">
                <BrandTiktok className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="url"
                  value={formData.tiktokUrl}
                  onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="https://tiktok.com/@yourusername"
                />
              </div>
            </div>

            {/* Niche */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content Niche
              </label>
              <div className="mt-1 relative">
                <Briefcase className="absolute left-3 top-3 text-gray-400" size={20} />
                <select
                  required
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select your niche</option>
                  <option value="ai">AI & Technology</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="business">Business</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Followers Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Followers
              </label>
              <div className="mt-1 relative">
                <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="number"
                  required
                  value={formData.followersCount}
                  onChange={(e) => setFormData({ ...formData, followersCount: e.target.value })}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Total followers across platforms"
                  min="1000"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Creating account...' : 'Join as Influencer'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/influencer/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default InfluencerSignUpForm;