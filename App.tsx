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
import IntegrationsSettings from './pages/settings/Integrations';
import DangerZone from './pages/settings/DangerZone';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardLayout from './components/layout/DashboardLayout';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import AddSitePage from './pages/AddSitePage';

// Placeholder content for legal pages
const termsContent = (
    <>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using DualPilot ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
        <h2>2. Description of Service</h2>
        <p>The Service is an AI-powered search visibility engine designed to audit, optimize, and improve website metadata and schema. All services are provided "as-is" and we assume no responsibility for the timeliness, deletion, or failure to store any user communications or personalization settings.</p>
        <h2>3. User Conduct</h2>
        <p>You are responsible for all activity occurring under your account and shall abide by all applicable local, state, national and foreign laws, treaties and regulations in connection with your use of the Service.</p>
    </>
);

const privacyContent = (
    <>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, and information we get when you use our services, such as your website data and performance metrics from connected services like Google Search Console.</p>
        <h2>2. How We Use Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and our users. We do not share your personal information with companies, organizations, or individuals outside of our company, except for the purposes of providing the service.</p>
        <h2>3. Data Security</h2>
        <p>We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>
    </>
);

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
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="terms" element={<LegalPage title="Terms of Service" lastUpdated="October 27, 2023" content={termsContent} />} />
              <Route path="privacy" element={<LegalPage title="Privacy Policy" lastUpdated="October 27, 2023" content={privacyContent} />} />
            </Route>
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="onboarding" element={<OnboardingPage />} />
                <Route path="add-site" element={<AddSitePage />} />
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
                  <Route path="integrations" element={<IntegrationsSettings />} />
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