import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import RunwayComponent from './components/RunwayComponent';

// Lazy load components
const HomePage = lazy(() => import('./components/HomePage'));
const PricingPage = lazy(() => import('./components/PricingPage'));
const BillingPage = lazy(() => import('./components/BillingPage'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/Dashboard'));
const Analytics = lazy(() => import('./components/admin/Analytics'));
const ContentEditor = lazy(() => import('./components/admin/ContentEditor'));
const TemplatesGallery = lazy(() => import('./components/TemplatesGallery'));
const FeaturesPage = lazy(() => import('./components/FeaturesPage'));
const SupportPage = lazy(() => import('./components/SupportPage'));
const SignUpForm = lazy(() => import('./components/auth/SignUpForm'));
const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const VideoCreationPage = lazy(() => import('./components/VideoCreationPage'));
const InfluencerSignUpForm = lazy(() => import('./components/auth/InfluencerSignUpForm'));
const InfluencerLoginForm = lazy(() => import('./components/auth/InfluencerLoginForm'));
const AffiliateStats = lazy(() => import('./components/AffiliateStats'));


const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/runway" element={<Layout><RunwayComponent /></Layout>} /> 
          <Route path="/features" element={<Layout><FeaturesPage /></Layout>} />
          <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
          <Route path="/billing" element={<Layout><BillingPage /></Layout>} />
          <Route path="/templates" element={<Layout><TemplatesGallery /></Layout>} />
          <Route path="/create" element={<Layout><VideoCreationPage /></Layout>} />
          <Route path="/support" element={<Layout><SupportPage /></Layout>} />
          
          {/* Auth Routes */}
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Layout><UserDashboard /></Layout>} />
          
          {/* Influencer/Affiliate Routes */}
          <Route path="/influencer/signup" element={<InfluencerSignUpForm />} />
          <Route path="/influencer/login" element={<InfluencerLoginForm />} />
          <Route path="/affiliate" element={<Layout><AffiliateStats /></Layout>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<ContentEditor />} />
            <Route path="templates" element={<ContentEditor type="templates" />} />
            <Route path="users" element={<ContentEditor type="users" />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="packages" element={<ContentEditor type="packages" />} />
            <Route path="settings" element={<ContentEditor type="settings" />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;