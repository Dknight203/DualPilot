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
import SiteSettings from './pages/settings/Site';
import BillingSettings from './pages/settings/Billing';
import TeamSettings from './pages/settings/Team';
import BrandingSettings from './pages/settings/Branding';
import ApiSettings from './pages/settings/Api';
import CmsSettings from './pages/settings/Cms';
import DangerZone from './pages/settings/DangerZone';

const AppLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
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
            <Route path="/" element={<AppLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="scan" element={<ScanPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="onboarding" element={<OnboardingPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="dashboard/ai-visibility" element={<AiVisibilityPage />} />
                <Route path="dashboard/reports" element={<ReportsPage />} />
                <Route path="dashboard/page/:pageId" element={<PageDetailPage />} />
                <Route path="admin" element={<AdminPage />} />

                <Route path="settings" element={<SettingsLayout />}>
                  <Route index element={<Navigate to="site" replace />} />
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