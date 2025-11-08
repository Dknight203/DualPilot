import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const DashboardLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800">
    <NavBar />
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
