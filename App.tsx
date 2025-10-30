import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';

import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import ScanPage from './pages/ScanPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import InstallPage from './pages/InstallPage';
import DashboardPage from './pages/DashboardPage';
import PageDetailPage from './pages/PageDetailPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const AppLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
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
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="install" element={<InstallPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="dashboard/page/:pageId" element={<PageDetailPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;