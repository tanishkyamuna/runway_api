import React from 'react';
import { Image, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/templates"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Manage Templates</h2>
              <p className="text-gray-600">Add or edit video templates</p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/testimonials"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Manage Testimonials</h2>
              <p className="text-gray-600">Add or edit customer testimonials</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;