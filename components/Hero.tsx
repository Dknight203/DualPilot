'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import ScanForm from './ScanForm';
import ScoreGauge from './ScoreGauge';

const ScoreCard = () => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h3 className="text-lg font-bold text-gray-900">Visibility Score</h3>
        <p className="text-sm text-gray-600 mt-1">Example Score</p>
        <div className="mt-4 flex justify-center">
            <ScoreGauge score={72} size={140} />
        </div>
        <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">AI Readiness</span>
                <span className="font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md">Ready</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Classic Readiness</span>
                <span className="font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md">Ready</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Issues found</span>
                <span className="font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-md">3</span>
            </div>
        </div>
    </div>
);

export default function Hero() {
    const router = useRouter();

    const handleScan = (domain: string) => {
        // For the hero form, we want to navigate to the scan page with the domain
        router.push(`/scan?domain=${encodeURIComponent(domain)}`);
    };

    return (
        <div className="bg-white">
            <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 md:py-14 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Column */}
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                            Visibility on autopilot for search and AI
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 leading-7">
                            DualPilot audits pages, writes clean metadata and schema, and keeps you visible in Google, Bing, and modern AI assistants.
                        </p>
                        <div className="mt-8">
                            <ScanForm onScan={handleScan} isLoading={false} />
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                            Works with WordPress, Webflow, Shopify, and custom stacks.
                        </p>
                    </div>

                    {/* Right Column */}
                    <div className="w-full max-w-sm mx-auto">
                        <ScoreCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
