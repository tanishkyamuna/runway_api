import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Play, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    {
      name: 'Product',
      dropdown: [
        { name: 'Features', href: '/features' },
        { name: 'Templates', href: '/templates' },
        { name: 'Examples', href: '/examples' },
        { name: 'Pricing', href: '/pricing' }
      ]
    },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Support', href: '/support' }
  ];

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProductDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center" onClick={closeMenus}>
                <Play className="w-6 h-6 mr-2" />
                PropVid
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:items-center md:space-x-4">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <button
                      onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                      className="px-3 py-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center"
                    >
                      {item.name}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className="px-3 py-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      onClick={closeMenus}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.dropdown && isProductDropdownOpen && (
                    <div className="absolute z-50 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeMenus}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/login"
              className="text-gray-500 hover:text-gray-900 flex items-center gap-2"
              onClick={closeMenus}
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={closeMenus}
            >
              <UserPlus className="w-5 h-5" />
              Sign Up Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-b shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                      className="w-full px-4 py-2 text-left text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center justify-between"
                    >
                      {item.name}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProductDropdownOpen && (
                      <div className="pl-4 bg-gray-50">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            onClick={closeMenus}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="block px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    onClick={closeMenus}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-between px-4 space-x-2">
              <Link
                to="/login"
                className="flex-1 text-center text-gray-500 hover:text-gray-900 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                onClick={closeMenus}
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                onClick={closeMenus}
              >
                <UserPlus className="w-5 h-5" />
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-bold flex items-center">
              <Play className="w-6 h-6 mr-2" />
              PropVid
            </Link>
            <p className="mt-4 text-gray-400">
              Transform your property images into stunning cinematic videos with AI technology.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              {[
                { name: 'Features', href: '/features' },
                { name: 'Templates', href: '/templates' },
                { name: 'Examples', href: '/examples' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Enterprise', href: '/enterprise' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { name: 'Documentation', href: '/documentation' },
                { name: 'Tutorials', href: '/tutorials' },
                { name: 'Blog', href: '/blog' },
                { name: 'Support', href: '/support' },
                { name: 'API', href: '/api' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@propvid.com" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  contact@propvid.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <span className="text-gray-400 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  New York, NY
                </span>
              </li>
            </ul>

            <div className="mt-6">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PropVid. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;