import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { PenSquare, Plus, Trash2, AlertCircle, Package, Settings, Image, Video, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const ContentEditor = ({ type = 'content' }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    fetchContent();
  }, [type]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      let data, error;

      switch (type) {
        case 'templates':
          ({ data, error } = await supabase
            .from('templates')
            .select('*')
            .order('created_at', { ascending: false }));
          break;

        case 'packages':
          ({ data, error } = await supabase
            .from('video_packages')
            .select('*')
            .order('created_at', { ascending: false }));
          break;

        case 'settings':
          ({ data, error } = await supabase
            .from('settings')
            .select('*')
            .order('key', { ascending: true }));
          break;

        default:
          ({ data, error } = await supabase
            .from('content_sections')
            .select('*, content_blocks(*)')
            .order('created_at', { ascending: true }));
      }

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError(error.message);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const tableName = type === 'packages' ? 'video_packages' :
                       type === 'content' ? 'content_sections' : 
                       type;
                       
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Item deleted successfully');
      fetchContent();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);

      // Generate unique file name
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExt = file.name.split('.').pop();
      const fileName = `template-images/${timestamp}-${randomString}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      // Update editing item with image URL
      setEditingItem(prev => ({
        ...prev,
        image_url: publicUrl
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video file must be less than 100MB');
      return;
    }

    try {
      setUploadingVideo(true);

      // Generate unique file name
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExt = file.name.split('.').pop();
      const fileName = `template-previews/${timestamp}-${randomString}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Update editing item with video URL
      setEditingItem(prev => ({
        ...prev,
        video_preview_url: publicUrl
      }));

      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSave = async (item) => {
    try {
      const tableName = type === 'packages' ? 'video_packages' :
                       type === 'content' ? 'content_sections' : 
                       type;

      const { error } = await supabase
        .from(tableName)
        .upsert(item);

      if (error) throw error;
      
      toast.success('Changes saved successfully');
      setEditingItem(null);
      fetchContent();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleFeatureChange = (features, index, newValue) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = newValue;
    return updatedFeatures;
  };

  const getIcon = () => {
    switch (type) {
      case 'templates':
        return <Image className="w-8 h-8 text-blue-600" />;
      case 'packages':
        return <Package className="w-8 h-8 text-blue-600" />;
      case 'settings':
        return <Settings className="w-8 h-8 text-blue-600" />;
      default:
        return <PenSquare className="w-8 h-8 text-blue-600" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'templates':
        return 'Video Templates';
      case 'packages':
        return 'Pricing Packages';
      case 'settings':
        return 'Site Settings';
      default:
        return 'Content Management';
    }
  };

  const renderEditForm = () => {
    if (!editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">
              {editingItem.id ? 'Edit' : 'Add New'} {getTitle().slice(0, -1)}
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {type === 'templates' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Template Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="Template Description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Image
                  </label>
                  <div className="space-y-2">
                    {editingItem.image_url && (
                      <div className="relative aspect-video w-full max-w-md">
                        <img 
                          src={editingItem.image_url}
                          alt="Template Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </button>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files?.[0])}
                        className="hidden"
                      />
                      {editingItem.image_url && (
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, image_url: '' })}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preview Video
                  </label>
                  <div className="space-y-2">
                    {editingItem.video_preview_url && (
                      <div className="relative aspect-video w-full max-w-md">
                        <video 
                          src={editingItem.video_preview_url}
                          className="w-full h-full rounded-lg"
                          controls
                          preload="metadata"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={uploadingVideo}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        {uploadingVideo ? 'Uploading...' : 'Upload Video'}
                      </button>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleVideoUpload(e.target.files?.[0])}
                        className="hidden"
                      />
                      {editingItem.video_preview_url && (
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, video_preview_url: '' })}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove Video
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prompt
                  </label>
                  <textarea
                    value={editingItem.prompt || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, prompt: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={4}
                    placeholder="Template generation prompt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orientation
                  </label>
                  <select
                    value={editingItem.orientation || 'landscape'}
                    onChange={(e) => setEditingItem({ ...editingItem, orientation: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="portrait">Portrait (9:16)</option>
                  </select>
                </div>
              </div>
            )}

            {type === 'packages' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credits
                    </label>
                    <input
                      type="number"
                      value={editingItem.credits || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, credits: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validity (Days)
                    </label>
                    <input
                      type="number"
                      value={editingItem.validity_days || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, validity_days: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      value={editingItem.price || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (ILS)
                    </label>
                    <input
                      type="number"
                      value={editingItem.price_ils || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, price_ils: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {(editingItem.features || []).map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            features: handleFeatureChange(editingItem.features, index, e.target.value)
                          })}
                          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                          onClick={() => setEditingItem({
                            ...editingItem,
                            features: editingItem.features.filter((_, i) => i !== index)
                          })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setEditingItem({
                        ...editingItem,
                        features: [...(editingItem.features || []), '']
                      })}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      Add Feature
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Resolution
                    </label>
                    <select
                      value={editingItem.max_resolution || '1080p'}
                      onChange={(e) => setEditingItem({ ...editingItem, max_resolution: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                      <option value="4K">4K</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Support Level
                    </label>
                    <select
                      value={editingItem.support_level || 'standard'}
                      onChange={(e) => setEditingItem({ ...editingItem, support_level: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="standard">Standard</option>
                      <option value="priority">Priority</option>
                      <option value="24/7">24/7</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(editingItem)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      );
    }

    if (content.length === 0) {
      return (
        <div className="text-center text-gray-500 py-12">
          No content found
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {content.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {item.title || item.name || item.key}
                </h3>
                <p className="text-gray-600">
                  {item.description || item.subtitle || JSON.stringify(item.value)}
                </p>
                {type === 'templates' && item.prompt && (
                  <div className="mt-4">
                    <span className="text-gray-500">Prompt:</span>
                    <p className="mt-1 text-gray-600">{item.prompt}</p>
                  </div>
                )}
                {type === 'templates' && (
                  <div className="mt-4 space-y-4">
                    {item.image_url && (
                      <div>
                        <span className="text-gray-500">Preview Image:</span>
                        <div className="mt-2 relative aspect-video w-full max-w-md">
                          <img 
                            src={item.image_url}
                            alt="Template Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                    {item.video_preview_url && (
                      <div>
                        <span className="text-gray-500">Preview Video:</span>
                        <div className="mt-2 relative aspect-video w-full max-w-md">
                          <video 
                            src={item.video_preview_url}
                            className="w-full h-full rounded-lg"
                            controls
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {type === 'packages' && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Credits:</span>
                      <span className="font-medium">{item.credits}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">USD:</span>
                        <span className="font-medium">${item.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">ILS:</span>
                        <span className="font-medium">₪{item.price_ils}</span>
                      </div>
                    </div>
                    {item.features && (
                      <div className="mt-4">
                        <span className="text-gray-500">Features:</span>
                        <ul className="mt-2 space-y-1">
                          {item.features.map((feature, index) => (
                            <li key={index} className="text-gray-600">• {feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  onClick={() => setEditingItem(item)}
                >
                  <PenSquare className="w-5 h-5" />
                </button>
                <button 
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {getIcon()}
          <h1 className="text-3xl font-bold">{getTitle()}</h1>
        </div>
        <button 
          onClick={() => setEditingItem({})}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>

      {renderContent()}
      {renderEditForm()}
    </div>
  );
};

export default ContentEditor;