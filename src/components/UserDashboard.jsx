import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Video, Clock, Settings, Package, ArrowRight, CreditCard, Download, Play, X } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchUserData();

    // Subscribe to video updates
    const channel = supabase
      .channel('videos-channel')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'videos',
          filter: `user_id=eq.${user?.id}`
        }, 
        (payload) => {
          if (payload.new.status === 'completed') {
            // Update videos list
            setVideos(prevVideos => 
              prevVideos.map(video => 
                video.id === payload.new.id ? payload.new : video
              )
            );
            // Show notification
            toast.success('Your video is ready!');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch credits
        const { data: creditsData, error: creditsError } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (creditsError) throw creditsError;
        setCredits(creditsData);

        // Fetch videos
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select(`
            *,
            template:templates(*),
            generation:video_generations(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (videosError) throw videosError;
        setVideos(videosData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error fetching user data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (video) => {
    try {
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(video.video_path);

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = publicUrl;
      link.download = `property-video-${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading video:', error);
      toast.error('Failed to download video');
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
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Available Credits</h2>
              <p className="text-gray-600">Create more videos to grow your business</p>
            </div>
            <Link
              to="/pricing"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <Package className="w-5 h-5 mr-2" />
              Buy Credits
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Credits Remaining</div>
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
          <Link
            to="/create"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Video className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold mb-2">Create New Video</h3>
            <p className="text-gray-600">
              Transform your property images into stunning videos
            </p>
          </Link>

          <Link
            to="/settings"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Settings className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold mb-2">Account Settings</h3>
            <p className="text-gray-600">
              Manage your account preferences and billing
            </p>
          </Link>
        </div>

        {/* Videos List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Your Videos</h2>
          </div>

          <div className="divide-y">
            {videos.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No videos yet. Create your first video!
              </div>
            ) : (
              videos.map((video) => (
                <div key={video.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">
                        {video.template?.title || 'Property Video'}
                      </h3>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(video.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {video.status === 'completed' ? (
                        <>
                          <button
                            onClick={() => setSelectedVideo(video)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Preview"
                          >
                            <Play className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownload(video)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <Clock className="w-5 h-5 animate-pulse" />
                          <span>Processing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Video Preview Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="relative bg-black rounded-lg w-full max-w-4xl">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
              >
                <X className="w-8 h-8" />
              </button>
              <video
                src={supabase.storage.from('videos').getPublicUrl(selectedVideo.video_path).data.publicUrl}
                controls
                autoPlay
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;