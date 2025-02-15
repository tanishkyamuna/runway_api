import React from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, Image, Users, Settings, TrendingUp, Package } from 'lucide-react';

const AdminDashboard = () => {
  const menuItems = [
    {
      title: 'Content Management',
      description: 'Edit website content and sections',
      icon: <PenSquare className="w-8 h-8 text-blue-600" />,
      link: '/admin/content'
    },
    {
      title: 'Templates',
      description: 'Manage video templates',
      icon: <Image className="w-8 h-8 text-blue-600" />,
      link: '/admin/templates'
    },
    {
      title: 'Users',
      description: 'View and manage users',
      icon: <Users className="w-8 h-8 text-blue-600" />,
      link: '/admin/users'
    },
    {
      title: 'Analytics',
      description: 'View site performance metrics',
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      link: '/admin/analytics'
    },
    {
      title: 'Packages',
      description: 'Manage pricing and packages',
      icon: <Package className="w-8 h-8 text-blue-600" />,
      link: '/admin/packages'
    },
    {
      title: 'Settings',
      description: 'Configure site settings',
      icon: <Settings className="w-8 h-8 text-blue-600" />,
      link: '/admin/settings'
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {item.icon}
              <div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;