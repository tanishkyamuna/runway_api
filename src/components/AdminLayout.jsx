import React from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, PenSquare, Image, Users, Settings, TrendingUp, Package, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: 'Dashboard',
      path: '/admin'
    },
    {
      icon: <PenSquare className="w-5 h-5" />,
      title: 'Content',
      path: '/admin/content'
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: 'Templates',
      path: '/admin/templates'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Users',
      path: '/admin/users'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Analytics',
      path: '/admin/analytics'
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: 'Packages',
      path: '/admin/packages'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: 'Settings',
      path: '/admin/settings'
    }
  ];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6">
        <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 p-3 rounded transition-colors ${
                location.pathname === item.path
                  ? 'bg-white/20 text-white'
                  : 'hover:bg-white/10'
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 p-3 rounded hover:bg-white/10 transition-colors w-full text-left mt-8"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;