import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-default text-slate-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <h2 className="text-white text-3xl font-bold">DualPilot</h2>
            <p className="text-slate-200">Rank on Google. Show up in AI.</p>
            <p className="text-slate-300 text-sm max-w-xs">
              DualPilot is an automated AI plus Search visibility engine that audits, optimizes, and keeps your site visible.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="/pricing" className="text-base text-slate-200 hover:text-white">Pricing</Link></li>
                  <li><Link to="/scan" className="text-base text-slate-200 hover:text-white">Free Scan</Link></li>
                  <li><Link to="/dashboard" className="text-base text-slate-200 hover:text-white">Dashboard</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="#" className="text-base text-slate-200 hover:text-white">About</Link></li>
                  <li><Link to="#" className="text-base text-slate-200 hover:text-white">Contact</Link></li>
                  <li><Link to="#" className="text-base text-slate-200 hover:text-white">Terms of Service</Link></li>
                  <li><Link to="#" className="text-base text-slate-200 hover:text-white">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            {/* You can add more columns here if needed */}
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8">
          <p className="text-base text-slate-400 xl:text-center">&copy; {new Date().getFullYear()} DualPilot, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;