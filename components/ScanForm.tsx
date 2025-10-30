import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ScanFormProps {
  onScan: (domain: string) => void;
  isLoading: boolean;
}

export default function ScanForm({ onScan, isLoading }: ScanFormProps) {
  const [domain, setDomain] = useState('');
  const searchParams = useSearchParams();

  // Pre-fill and auto-scan if domain is in URL query params
  useEffect(() => {
    const domainFromQuery = searchParams.get('domain');
    if (domainFromQuery) {
      const sanitizedDomain = domainFromQuery.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
      setDomain(sanitizedDomain);
      onScan(sanitizedDomain);
    }
  }, [searchParams, onScan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain) {
      onScan(domain);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto sm:flex sm:gap-3">
      <div className="min-w-0 flex-1">
        <label htmlFor="domain" className="sr-only">Domain</label>
        <input
          id="domain"
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="block w-full px-5 py-3 text-base text-gray-900 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          placeholder="Enter your domain"
          disabled={isLoading}
        />
      </div>
      <div className="mt-3 sm:mt-0">
        <button
          type="submit"
          className="w-full flex items-center justify-center px-5 py-3 border border-transparent font-semibold rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50"
          disabled={!domain || isLoading}
        >
          {isLoading ? 'Scanning...' : 'Run Free Scan'}
        </button>
      </div>
    </form>
  );
};
