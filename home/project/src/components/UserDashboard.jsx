import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Video, Clock, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: creditsData, error } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setCredits(creditsData);
      }
    } catch (error) {
      toast.error('Error fetching user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user?.user_metadata?.name || 'User'}</h1>

        {/* Credits Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Your Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Free Videos Remaining</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {credits?.free_videos_remaining || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a
            href="/create"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Video className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold mb-2">Create New Video</h3>
            <p className="text-gray-600">
              Transform your property images into stunning videos
            </p>
          </a>

          <a
            href="/settings"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Settings className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold mb-2">Account Settings</h3>
            <p className="text-gray-600">
              Manage your account preferences and billing
            </p>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Add recent activity items here */}
            <div className="text-gray-600">No recent activity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;