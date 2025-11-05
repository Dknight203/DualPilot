import React from 'react';
import { Link } from 'react-router-dom';
import { ScanResult } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import ScoreGauge from '../common/ScoreGauge';
import Checklist from './Checklist';

interface ScanResultProps {
  result: ScanResult;
}

const ReadinessIndicator: React.FC<{ isReady: boolean; text: string }> = ({ isReady, text }) => (
    <div className="flex items-center space-x-2">
        {isReady ? (
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ) : (
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )}
        <span className="text-slate-700">{text}</span>
    </div>
);


const ScanResultComponent: React.FC<ScanResultProps> = ({ result }) => {
  return (
    <Card className="animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h3 className="text-lg font-medium text-slate-500">Visibility Score</h3>
          <ScoreGauge score={result.score} />
        </div>
        <div className="md:col-span-2 space-y-6">
            <div>
                <h3 className="text-lg font-medium text-slate-900">Readiness Check</h3>
                <div className="mt-2 flex space-x-8">
                    <ReadinessIndicator isReady={result.classicReadiness} text="Classic Search Ready" />
                    <ReadinessIndicator isReady={result.aiReadiness} text="AI Assistant Ready" />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium text-slate-900">Your Action Checklist</h3>
                <div className="mt-2">
                   <Checklist issues={result.issues} />
                </div>
            </div>
        </div>
      </div>
      <div className="mt-8 text-center bg-slate-50 p-6 rounded-lg">
        <h4 className="text-xl font-bold text-slate-800">{result.suggestedNextStep}</h4>
        <p className="mt-2 text-slate-600">Go beyond the audit. Start optimizing automatically and watch your score climb.</p>
        <Link to="/signup" className="mt-4 inline-block">
          <Button variant="primary">Automate Fixes with DualPilot</Button>
        </Link>
      </div>
    </Card>
  );
};

export default ScanResultComponent;
