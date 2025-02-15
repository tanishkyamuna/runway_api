import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { TrendingUp, Users, Video, Package, Clock, Star, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    averageProcessingTime: 0,
    totalRevenue: 0,
    recentActivity: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get total users
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      // Get total videos
      const { count: videoCount, error: videoError } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      if (videoError) throw videoError;

      // Get average processing time
      const { data: videos, error: processingError } = await supabase
        .from('videos')
        .select('created_at, updated_at')
        .eq('status', 'completed');

      if (processingError) throw processingError;

      const avgTime = videos?.reduce((acc, video) => {
        const start = new Date(video.created_at);
        const end = new Date(video.updated_at);
        return acc + (end - start);
      }, 0) / (videos?.length || 1);

      // Get total revenue
      const { data: transactions, error: revenueError } = await supabase
        .from('payment_transactions')
        .select('amount')
        .eq('status', 'completed');

      if (revenueError) throw revenueError;

      const totalRevenue = transactions?.reduce((acc, tx) => acc + tx.amount, 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        totalVideos: videoCount || 0,
        averageProcessingTime: avgTime || 0,
        totalRevenue: totalRevenue,
        recentActivity: []
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeframe === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t === '7d' ? 'Last 7 Days' : t === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              10%
            </div>
          </div>
          <span className="text-gray-600 text-sm">Total Users</span>
          <div className="text-2xl font-bold mt-1">
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
            ) : (
              stats.totalUsers.toLocaleString()
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              15%
            </div>
          </div>
          <span className="text-gray-600 text-sm">Total Videos</span>
          <div className="text-2xl font-bold mt-1">
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
            ) : (
              stats.totalVideos.toLocaleString()
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <span className="text-gray-600 text-sm">Avg. Processing Time</span>
          <div className="text-2xl font-bold mt-1">
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
            ) : (
              formatDuration(stats.averageProcessingTime)
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              20%
            </div>
          </div>
          <span className="text-gray-600 text-sm">Total Revenue</span>
          <div className="text-2xl font-bold mt-1">
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
            ) : (
              formatMoney(stats.totalRevenue)
            )}
          </div>
        </div>
      </div>

      {/* Charts would go here */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Video Generation Trends</h2>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Chart coming soon...
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Growth</h2>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Chart coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;