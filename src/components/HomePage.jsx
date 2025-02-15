import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Upload, Zap, Building2, Star, ArrowRight, Clock, Volume2, VolumeX, Sparkles, Wand2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const HomePage = () => {
  const [templates, setTemplates] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch featured templates
      const { data: templatesData } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (templatesData) {
        setTemplates(templatesData);
        setActiveTemplate(templatesData[0]); // Set first template as active
      }

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (testimonialsData) {
        setTestimonials(testimonialsData);
      }
    };

    fetchData();
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <video 
            src="https://home-market.co.il/wp-content/uploads/2025/01/Gray-and-Black-Minimal-Website-Animated-Presentation-Video.mp4"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="object-cover w-full h-full opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/90" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Transform Property Images Into <span className="bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">Cinematic Videos</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Create stunning property videos in minutes with AI-powered technology. Perfect for real estate agents, property developers, and marketing teams.
              </p>
              
              {/* Primary CTA Section */}
              <div className="space-y-4">
                <Link 
                  to="/templates"
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-white px-8 py-4 font-bold transition duration-300 ease-out hover:scale-105"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-transform duration-500 group-hover:translate-x-[-10%] group-hover:scale-110"></span>
                  <span className="relative flex items-center gap-2 text-white">
                    <Wand2 className="w-5 h-5" />
                    Create Your First Video Free
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>

                <div className="flex items-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>2 Free Videos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>Ready in Minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    <span>Professional Quality</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Template Preview */}
            <div className="relative">
              {activeTemplate && (
                <div className="relative rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src={activeTemplate.image_url}
                    alt={activeTemplate.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold mb-2">{activeTemplate.title}</h3>
                      <p className="text-sm text-gray-200">{activeTemplate.description}</p>
                      <Link
                        to="/templates"
                        className="inline-flex items-center gap-2 mt-4 text-blue-300 hover:text-blue-200 transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        View All Templates
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Create Professional Videos in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              No video editing skills required. Just upload your image and let our AI do the magic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="w-8 h-8 text-blue-600" />,
                title: "Upload Image",
                description: "Upload any property photo or 3D render"
              },
              {
                icon: <Zap className="w-8 h-8 text-blue-600" />,
                title: "Choose Template",
                description: "Select from our professional video templates"
              },
              {
                icon: <Play className="w-8 h-8 text-blue-600" />,
                title: "Get Your Video",
                description: "Receive your cinematic video in minutes"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Preview */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Professional Templates for Every Property
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our collection of carefully crafted video styles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.length > 0 ? templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={template.image_url}
                    alt={template.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-lg font-bold mb-2">{template.title}</h3>
                      <p className="text-sm">{template.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              // Placeholder templates while loading or if no templates exist
              Array(3).fill(null).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-200 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-lg font-bold mb-2">Loading...</h3>
                        <p className="text-sm">Please wait</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why Choose Our Platform
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <Clock />,
                    title: "Save Time & Money",
                    description: "Create videos in minutes instead of days. No need for expensive video equipment or editing software."
                  },
                  {
                    icon: <Star />,
                    title: "Professional Quality",
                    description: "Get stunning, cinematic results every time with our AI-powered technology."
                  },
                  {
                    icon: <Building2 />,
                    title: "Perfect for Real Estate",
                    description: "Templates designed specifically for property showcasing and real estate marketing."
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="text-blue-600">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                alt="Platform Benefits"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Real Estate Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers are saying about us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-2 text-yellow-400 mb-4">
                  {Array(testimonial.rating).fill(null).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            )) : (
              // Placeholder testimonials while loading or if no testimonials exist
              Array(3).fill(null).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center gap-2 text-yellow-400 mb-4">
                    {Array(5).fill(null).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse mb-4" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                    <div>
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Property Listings?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get started for free and create your first video in minutes
          </p>
          <Link 
            to="/pricing" 
            className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors flex items-center mx-auto inline-flex"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;