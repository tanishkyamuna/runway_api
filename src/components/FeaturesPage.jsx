import React from 'react';
import { Wand2, Clock, Palette, Video, BadgeDollarSign, BarChart3, Smartphone, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  const features = [
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "AI-Powered Video Generation",
      description: "Transform static property images into cinematic videos in minutes using cutting-edge AI technology",
      benefits: [
        "High-quality video output",
        "Multiple camera angles",
        "Professional transitions",
        "Dynamic movement"
      ]
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Lightning Fast Delivery",
      description: "Get your videos in minutes, not days. Perfect for time-sensitive listings",
      benefits: [
        "5-10 second videos",
        "Instant processing",
        "Bulk generation",
        "Quick downloads"
      ]
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Professional Templates",
      description: "Choose from our library of professionally designed real estate video templates",
      benefits: [
        "Exterior showcases",
        "Interior walkthroughs",
        "Aerial views",
        "Custom animations"
      ]
    }
  ];

  const advancedFeatures = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Customization",
      description: "Adjust duration, style, and effects to match your brand"
    },
    {
      icon: <BadgeDollarSign className="w-6 h-6" />,
      title: "Flexible Pricing",
      description: "Pay per video or choose monthly subscription plans"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Track performance and optimize your video content"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Optimized",
      description: "Create and manage videos from any device"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Features that Transform Your Property Listings
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Everything you need to create stunning property videos that capture attention and drive sales
            </p>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-block p-4 bg-blue-50 rounded-full mb-6">
                  <div className="text-blue-600">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="text-left space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center">
                      <Zap className="w-5 h-5 text-blue-600 mr-2" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Demo */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                See the Magic in Action
              </h2>
              <p className="text-gray-600 mb-8">
                Watch how our AI transforms a simple property image into a stunning cinematic video in minutes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {advancedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-blue-600">{feature.icon}</div>
                    <div>
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                alt="Feature Demo"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Video className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Videos Generated" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "75%", label: "Time Saved" },
              { number: "3X", label: "More Engagement" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
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
            Join thousands of real estate professionals already using our platform
          </p>
          <Link 
            to="/templates" 
            className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;