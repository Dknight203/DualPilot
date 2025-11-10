import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import ScanPage from './pages/ScanPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import PageDetailPage from './pages/PageDetailPage';
import AdminPage from './pages/AdminPage';
import AiVisibilityPage from './pages/AiVisibilityPage';
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { SiteProvider } from './components/site/SiteContext';
import SettingsLayout from './components/layout/SettingsLayout';
import ProfileSettings from './pages/settings/Profile';
import SiteSettings from './pages/settings/Site';
import BillingSettings from './pages/settings/Billing';
import TeamSettings from './pages/settings/Team';
import BrandingSettings from './pages/settings/Branding';
import ApiSettings from './pages/settings/Api';
import CmsSettings from './pages/settings/Cms';
import DangerZone from './pages/settings/DangerZone';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardLayout from './components/layout/DashboardLayout';

const AppLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen text-slate-600">
    <NavBar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <SiteProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="scan" element={<ScanPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password/:token" element={<ResetPasswordPage />} />
            </Route>
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="onboarding" element={<OnboardingPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="dashboard/ai-visibility" element={<AiVisibilityPage />} />
                <Route path="dashboard/reports" element={<ReportsPage />} />
                <Route path="dashboard/page/:pageId" element={<PageDetailPage />} />
                <Route path="admin" element={<AdminPage />} />

                <Route path="settings" element={<SettingsLayout />}>
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="site" element={<SiteSettings />} />
                  <Route path="billing" element={<BillingSettings />} />
                  <Route path="team" element={<TeamSettings />} />
                  <Route path="branding" element={<BrandingSettings />} />
                  <Route path="api" element={<ApiSettings />} />
                  <Route path="cms" element={<CmsSettings />} />
                  <Route path="danger" element={<DangerZone />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </SiteProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;