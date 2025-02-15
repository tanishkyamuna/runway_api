import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sliders, Download, Star, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const TemplatesGallery = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'exterior', name: 'Exterior' },
    { id: 'interior', name: 'Interior' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'luxury', name: 'Luxury' }
  ];

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const transformedData = (data || []).map(template => ({
        ...template,
        orientation: template.orientation || (
          template.title.toLowerCase().includes('portrait') || 
          template.title.toLowerCase().includes('vertical') ||
          template.title.toLowerCase().includes('interior flow')
            ? 'portrait'
            : 'landscape'
        )
      }));
      
      setTemplates(transformedData);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates');
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = async (template) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to create videos');
        navigate('/login', { state: { returnTo: '/create' } });
        return;
      }

      const { data: credits, error } = await supabase
        .from('user_credits')
        .select('free_videos_remaining')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (!credits || credits.free_videos_remaining <= 0) {
        toast.error('No credits remaining. Please upgrade your plan.');
        navigate('/pricing');
        return;
      }

      navigate('/create', { state: { template } });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start video creation');
    }
  };

  const getTemplateAspectRatio = (template) => {
    return template.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video';
  };

  const handleMouseEnter = async (template) => {
    setHoveredTemplate(template.id);
    
    // Preload and play video
    const videoElement = document.querySelector(`#video-${template.id}`);
    if (videoElement) {
      try {
        // Reset video to start
        videoElement.currentTime = 0;
        
        // Show video
        videoElement.style.opacity = '1';
        
        // Attempt to play
        await videoElement.play();
      } catch (error) {
        console.log('Video autoplay prevented:', error);
      }
    }
  };

  const handleMouseLeave = (template) => {
    setHoveredTemplate(null);
    
    // Hide and pause video
    const videoElement = document.querySelector(`#video-${template.id}`);
    if (videoElement) {
      videoElement.style.opacity = '0';
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Video Templates</h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose from our collection of professional video templates
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className={`${n % 3 === 0 ? 'aspect-[9/16]' : 'aspect-video'} bg-gray-200`}></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map(template => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden group"
                onMouseEnter={() => handleMouseEnter(template)}
                onMouseLeave={() => handleMouseLeave(template)}
              >
                <div className={`relative ${getTemplateAspectRatio(template)}`}>
                  {/* Static Image */}
                  <img 
                    src={template.image_url}
                    alt={template.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/${template.orientation === 'portrait' ? '400x600' : '600x400'}?text=Template+Preview`;
                    }}
                  />
                  
                  {/* Video Preview */}
                  {template.video_preview_url && (
                    <video
                      id={`video-${template.id}`}
                      src={template.video_preview_url}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-bold">{template.title}</h3>
                      <p className="text-sm text-gray-200">
                        {template.duration || '10'} seconds
                      </p>
                    </div>
                  </div>
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateSelect(template);
                      }}
                    >
                      <Play className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {templates.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-12">
            No templates found for this category
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesGallery;