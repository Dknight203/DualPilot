import React, { useState } from 'react';
import ScanForm from '../components/scan/ScanForm';
import ScanResultComponent from '../components/scan/ScanResult';
import { ScanResult } from '../types';
import { scanDomain } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ScanPage: React.FC = () => {
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleScan = async (domain: string) => {
        setIsLoading(true);
        setError(null);
        setScanResult(null);
        try {
            const result = await scanDomain(domain);
            setScanResult(result);
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                        Get Your Free Visibility Score
                    </h1>
                    <p className="mt-4 text-xl text-slate-600">
                        Enter your domain to see how you rank on Google and show up in AI. No signup required.
                    </p>
                </div>

                <div className="mt-12">
                    <ScanForm onScan={handleScan} isLoading={isLoading} />
                </div>

                <div className="mt-8">
                    {isLoading && <LoadingSpinner text="Analyzing your site..." />}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {scanResult && <ScanResultComponent result={scanResult} />}
                </div>
            </div>
        </div>
    );
};

export default ScanPage;
