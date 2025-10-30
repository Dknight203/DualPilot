import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-brand-blue text-2xl font-bold">DualPilot</h2>
            <p className="mt-1 text-gray-600">Rank on Google. Show up in AI.</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-base text-gray-600 hover:text-gray-900">Privacy</Link>
            <Link href="#" className="text-base text-gray-600 hover:text-gray-900">Terms</Link>
            <Link href="#" className="text-base text-gray-600 hover:text-gray-900">Contact</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-base text-gray-500 text-center md:order-1">&copy; {new Date().getFullYear()} DualPilot, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
