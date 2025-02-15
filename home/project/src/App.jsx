import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './components/HomePage';
import PricingPage from './components/PricingPage';
import BillingPage from './components/BillingPage';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ContentManagement from './components/admin/ContentManagement';
import Layout from './components/Layout';
import CreditCardForm from './components/CreditCardForm';
import ExamplesGallery from './components/ExamplesGallery';
import TemplatesGallery from './components/TemplatesGallery';
import FeaturesPage from './components/FeaturesPage';
import SupportPage from './components/SupportPage';
import SignUpForm from './components/auth/SignUpForm';
import LoginForm from './components/auth/LoginForm';
import UserDashboard from './components/UserDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/features" element={<Layout><FeaturesPage /></Layout>} />
        <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
        <Route path="/billing" element={<Layout><BillingPage /></Layout>} />
        <Route path="/payment" element={<Layout><CreditCardForm /></Layout>} />
        <Route path="/examples" element={<Layout><ExamplesGallery /></Layout>} />
        <Route path="/templates" element={<Layout><TemplatesGallery /></Layout>} />
        <Route path="/support" element={<Layout><SupportPage /></Layout>} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Layout><UserDashboard /></Layout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="content" element={<ContentManagement />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;