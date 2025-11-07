import React from 'react';
import { AiCoverageData } from '../../../types';

interface ChartAiCoverageProps {
    data: AiCoverageData[];
}

const ChartAiCoverage: React.FC<ChartAiCoverageProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No data available.</p>;
    }

    const coveredItem = data.find(d => d.name === 'Covered');
    const coveredPercent = coveredItem ? coveredItem.value : 0;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const strokeDashoffset = 251.2 - (251.2 * (coveredPercent / total)); 

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="text-slate-200"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className="text-brand-blue"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        style={{
                            strokeDasharray: 251.2,
                            strokeDashoffset,
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                            transition: 'stroke-dashoffset 0.5s ease-in-out'
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">{coveredPercent}%</span>
                </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 text-center">Percentage of your pages with AI-ready summaries and schema.</p>
        </div>
    );
};

export default ChartAiCoverage;
