'use client';

import React, { useState } from 'react';
import ScanForm from '@/components/ScanForm';
import ScanResultComponent from '@/components/ScanResult';
import { ScanResult } from '@/lib/types';
import { scanDomain } from '@/lib/api';
import Loading from '@/components/Loading';

export default function ScanPage() {
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
        <div className="bg-white min-h-[calc(100vh-8rem)] py-10 px-4 sm:px-6 lg:px-8 md:py-14 lg:py-20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Get Your Free Visibility Score
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 leading-7">
                        Enter your domain to see how you rank on Google and show up in AI. No signup required.
                    </p>
                </div>

                <div className="mt-12">
                    <ScanForm onScan={handleScan} isLoading={isLoading} />
                </div>

                <div className="mt-8">
                    {isLoading && <div className="flex justify-center"><Loading text="Analyzing your site..." /></div>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {scanResult && <ScanResultComponent result={scanResult} />}
                </div>
            </div>
        </div>
    );
};
