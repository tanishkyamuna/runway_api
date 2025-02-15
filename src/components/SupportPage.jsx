import React, { useState } from 'react';
import { Search, Book, MessageCircle, Play, Image, AlertCircle, Zap, FileQuestion } from 'lucide-react';

const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: <Play /> },
    { id: 'image-guidelines', name: 'Image Guidelines', icon: <Image /> },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: <AlertCircle /> },
    { id: 'best-practices', name: 'Best Practices', icon: <Zap /> },
  ];

  const faqs = {
    'getting-started': [
      {
        question: "How do I create my first video?",
        answer: "Creating your first video is simple: 1. Upload your property image 2. Choose a template style 3. Click 'Generate Video' and wait for processing. Your video will be ready in minutes."
      },
      {
        question: "What video formats do you support?",
        answer: "We deliver videos in MP4 format, optimized for all major platforms including social media, websites, and mobile devices."
      },
      {
        question: "How many credits do I need per video?",
        answer: "Each video generation uses 1 credit, regardless of whether it's a 5 or 10-second video."
      }
    ],
    'image-guidelines': [
      {
        question: "What are the recommended image specifications?",
        answer: "For best results, use images with: Minimum resolution of 2000x1500 pixels, JPG or PNG format, good lighting, and clear composition."
      },
      {
        question: "Can I use 3D renders?",
        answer: "Yes! Our system works great with both photographs and 3D architectural renders."
      }
    ],
    'troubleshooting': [
      {
        question: "What if I'm not happy with the result?",
        answer: "You can regenerate the video with a different template or adjust your input image. If you're still not satisfied, contact our support team."
      },
      {
        question: "Why is my video taking longer than usual?",
        answer: "Processing usually takes 2-3 minutes. During peak times or for complex scenes, it might take longer. You'll receive an email when your video is ready."
      }
    ],
    'best-practices': [
      {
        question: "Which template should I choose?",
        answer: "For exteriors, use our 'Cinematic Approach' for grand entrances. For interiors, 'Room Flow' works best for showing space connectivity."
      },
      {
        question: "How can I make my videos more engaging?",
        answer: "Choose high-quality images, ensure good lighting, and select templates that match your property type. For luxury properties, longer 10-second videos work best."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-6 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {category.icon}
                <span className="font-medium">{category.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y">
                {faqs[selectedCategory].map((faq, index) => (
                  <div key={index} className="p-6">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                      <FileQuestion className="w-5 h-5 text-blue-600" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 pl-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            {/* Quick Start Guide */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Book className="w-5 h-5 text-blue-600" />
                  Quick Start Guide
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">1</div>
                    <span>Upload your property image</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">2</div>
                    <span>Choose your preferred template</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">3</div>
                    <span>Generate and download your video</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Still Need Help?
                </h3>
                <p className="text-gray-600 mb-4">
                  Our support team is available 24/7 to help you with any questions.
                </p>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative">
                  <img 
                    src={`https://images.unsplash.com/photo-${index + 1}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80`}
                    alt={`Tutorial ${index}`}
                    className="w-full"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors">
                    <Play className="w-12 h-12 text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">Tutorial Title {index}</h3>
                  <p className="text-gray-600 text-sm">Learn how to create stunning property videos in minutes.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;