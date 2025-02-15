import React, { useState, useEffect } from 'react';
import { Play, Building2, Home, Building, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const ExamplesGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Default categories and property types - use these if API fails
  const defaultCategories = [
    { id: 'all', name: 'All Examples' },
    { id: 'exterior', name: 'Exterior Videos' },
    { id: 'interior', name: 'Interior Videos' },
    { id: 'aerial', name: 'Aerial Videos' },
    { id: 'virtual', name: 'Virtual Tours' }
  ];

  const defaultPropertyTypes = [
    { id: 'all', name: 'All Properties' },
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'luxury', name: 'Luxury' }
  ];

  const [categories, setCategories] = useState(defaultCategories);
  const [propertyTypes, setPropertyTypes] = useState(defaultPropertyTypes);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('examples')
        .select('category')
        .neq('category', null)
        .order('category')
        .then(result => {
          // Manual distinct operation
          const uniqueCategories = [...new Set(result.data.map(item => item.category))];
          return {
            data: uniqueCategories,
            error: result.error
          };
        });

      if (error) throw error;

      if (data && data.length > 0) {
        const uniqueCategories = [
          { id: 'all', name: 'All Examples' },
          ...data.map(category => ({
            id: category,
            name: `${category.charAt(0).toUpperCase()}${category.slice(1)} Videos`
          }))
        ];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err.message);
      // Keep using default categories if there's an error
      setCategories(defaultCategories);
    }
  };

  const fetchPropertyTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('examples')
        .select('property_type')
        .neq('property_type', null)
        .order('property_type')
        .then(result => {
          // Manual distinct operation
          const uniqueTypes = [...new Set(result.data.map(item => item.property_type))];
          return {
            data: uniqueTypes,
            error: result.error
          };
        });

      if (error) throw error;

      if (data && data.length > 0) {
        const uniquePropertyTypes = [
          { id: 'all', name: 'All Properties' },
          ...data.map(type => ({
            id: type,
            name: type.charAt(0).toUpperCase() + type.slice(1)
          }))
        ];
        setPropertyTypes(uniquePropertyTypes);
      }
    } catch (err) {
      console.error('Error fetching property types:', err.message);
      // Keep using default property types if there's an error
      setPropertyTypes(defaultPropertyTypes);
    }
  };

  const fetchExamples = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('examples')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (selectedPropertyType !== 'all') {
        query = query.eq('property_type', selectedPropertyType);
      }

      const { data, error } = await query;

      if (error) throw error;

      setExamples(data || []);
    } catch (err) {
      console.error('Error fetching examples:', err.message);
      setError('Failed to load examples');
      toast.error('Failed to load examples');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchPropertyTypes()
    ]);
  }, []);

  useEffect(() => {
    fetchExamples();
  }, [selectedCategory, selectedPropertyType]);

  const handleVideoError = (e) => {
    console.error('Video error:', e);
    toast.error('Failed to load video');
  };

  const openVideo = (example) => {
    setSelectedVideo(example);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Example Gallery</h1>
          <p className="text-xl text-gray-600 mb-8">
            See real examples of AI-generated property videos
          </p>
          
          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <div className="flex flex-wrap justify-center gap-2">
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
            <div className="flex flex-wrap justify-center gap-2">
              {propertyTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedPropertyType(type.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedPropertyType === type.id
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Examples Grid */}
        {error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="p-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : examples.length === 0 ? (
          <div className="text-center text-gray-600 py-8">No examples found</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {examples.map(example => (
              <div key={example.id} className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{example.title}</h3>
                  <p className="text-gray-600 mb-4">{example.description}</p>
                </div>
                
                {/* Before/After Comparison */}
                <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50">
                  <div className="relative">
                    <img 
                      src={example.original_image_url} 
                      alt="Original" 
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        console.error('Image error:', e);
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      Original Image
                    </div>
                  </div>
                  <div className="relative">
                    <video 
                      key={example.video_preview_url}
                      className="w-full h-48 object-cover rounded-lg"
                      poster={example.original_image_url}
                      preload="auto"
                      playsInline
                      muted
                      loop
                      autoPlay
                      onLoadedData={(e) => {
                        const playPromise = e.target.play();
                        if (playPromise !== undefined) {
                          playPromise.catch(error => {
                            console.log("Auto-play prevented:", error);
                          });
                        }
                      }}
                      onError={handleVideoError}
                    >
                      <source src={example.video_preview_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button 
                      onClick={() => openVideo(example)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors"
                    >
                      <Play className="w-16 h-16 text-white" />
                    </button>
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      Video Preview
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium">{example.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Views</div>
                      <div className="font-medium">{example.views}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Template</div>
                      <div className="font-medium">{example.template_name}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="relative bg-black rounded-lg w-full max-w-4xl">
              <button 
                onClick={closeVideo}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
              >
                <X className="w-8 h-8" />
              </button>
              <video 
                key={selectedVideo.video_preview_url}
                controls
                autoPlay
                playsInline
                className="w-full rounded-lg"
                onError={handleVideoError}
              >
                <source src={selectedVideo.video_preview_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamplesGallery;