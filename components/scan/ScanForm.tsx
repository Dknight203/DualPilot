import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

interface ScanFormProps {
  onScan: (domain: string) => void;
  isLoading: boolean;
}

const ScanForm: React.FC<ScanFormProps> = ({ onScan, isLoading }) => {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain) {
      onScan(domain);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto sm:flex">
      <div className="min-w-0 flex-1">
        <label htmlFor="domain" className="sr-only">Domain</label>
        <Input
          id="domain"
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter your domain (e.g., example.com)"
          disabled={isLoading}
        />
      </div>
      <div className="mt-3 sm:mt-0 sm:ml-3">
        <Button
          type="submit"
          className="w-full px-5 py-3"
          isLoading={isLoading}
          disabled={!domain || isLoading}
        >
          Scan Now
        </Button>
      </div>
    </form>
  );
};

export default ScanForm;