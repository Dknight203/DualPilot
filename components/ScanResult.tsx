import React from 'react';
import Link from 'next/link';
import { ScanResult } from '@/lib/types';
import ScoreGauge from './ScoreGauge';
import IssueList from './IssueList';

const ReadinessIndicator: React.FC<{ isReady: boolean; text: string }> = ({ isReady, text }) => (
    <div className="flex items-center space-x-2">
        {isReady ? (
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ) : (
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )}
        <span className="text-gray-700">{text}</span>
    </div>
);


export default function ScanResultComponent({ result }: { result: ScanResult }) {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h3 className="text-lg font-medium text-gray-600">Visibility Score</h3>
          <ScoreGauge score={result.score} />
        </div>
        <div className="md:col-span-2 space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Readiness Check</h3>
                <div className="mt-2 flex space-x-8">
                    <ReadinessIndicator isReady={result.classicReadiness} text="Classic Readiness" />
                    <ReadinessIndicator isReady={result.aiReadiness} text="AI Readiness" />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">Issues Found</h3>
                <IssueList issues={result.issues} />
            </div>
        </div>
      </div>
      <div className="mt-8 text-center bg-gray-50 p-6 rounded-2xl">
        <h4 className="text-xl font-bold text-gray-800">{result.suggestedNextStep}</h4>
        <p className="mt-2 text-gray-600">Go beyond the audit. Start optimizing automatically and watch your score climb.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Automate fixes with DualPilot
            </Link>
             <Link href="/pricing" className="rounded-xl bg-white px-5 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                View pricing
            </Link>
        </div>
      </div>
    </div>
  );
};
