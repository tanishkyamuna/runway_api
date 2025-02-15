import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, Image as ImageIcon, AlertCircle, Sparkles, Wand2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { webhookService } from '../lib/webhookService';
import { storageService } from '../lib/storageService';
import toast from 'react-hot-toast';

const VideoCreationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const template = location.state?.template;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(template?.defaultDuration || 10);

  // Redirect if no template selected
  if (!template) {
    navigate('/templates');
    return null;
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to create videos');

      // Verify credits
      const { data: credits, error: creditsError } = await supabase
        .from('user_credits')
        .select('free_videos_remaining')
        .eq('user_id', user.id)
        .single();

      if (creditsError || !credits || credits.free_videos_remaining <= 0) {
        throw new Error('No credits remaining. Please upgrade your plan.');
      }

      // Upload image
      const { url: imageUrl } = await storageService.uploadImage(file, user.id);
      if (!imageUrl) throw new Error('Failed to upload image');

      // Create video with selected duration
      const result = await webhookService.createVideo(imageUrl, {
        ...template,
        duration,
        imageOrientation: template.orientation || 'landscape'
      });
      
      if (!result.success) throw new Error('Failed to start video creation');

      // Deduct credit
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          free_videos_remaining: credits.free_videos_remaining - 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success('Video creation started successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating video:', error);
      setError(error.message || 'Failed to create video');
      toast.error(error.message || 'Failed to create video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Create Your Video</h1>
          <p className="text-xl text-gray-600">
            Upload your image and we'll transform it using the {template.title} template
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Template Preview */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold mb-4">Selected Template</h2>
            <div className={`relative ${template.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'} rounded-lg overflow-hidden`}>
              <img
                src={template.image_url}
                alt={template.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h3 className="text-lg font-bold">{template.title}</h3>
                  <p className="text-sm">{template.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold mb-4">Video Duration</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setDuration(5)}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  duration === 5 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-5 h-5" />
                5 Seconds
              </button>
              <button
                onClick={() => setDuration(10)}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  duration === 10 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-5 h-5" />
                10 Seconds
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Upload Your Image</h2>
            <div className="mb-6">
              <input
                type="file"
                id="image-upload"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer block"
              >
                {preview ? (
                  <div className={`relative ${template.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <span className="text-white">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Drop your image here or click to browse</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {template.orientation === 'portrait' 
                        ? 'Best with vertical (9:16) images'
                        : 'Best with landscape (16:9) images'
                      }
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Create Button */}
            <button
              onClick={handleSubmit}
              disabled={!file || isLoading}
              className="relative w-full group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-full px-7 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg leading-none flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span className="text-white text-lg font-bold">Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6 text-white" />
                    <span className="text-white text-lg font-bold">Create {duration}-Second Video</span>
                    <Sparkles className="w-6 h-6 text-white" />
                  </>
                )}
              </div>
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCreationPage;