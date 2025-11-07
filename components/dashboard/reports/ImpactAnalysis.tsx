import React from 'react';
import { ImpactAnalysisItem } from '../../../types';
import Card from '../../common/Card';

interface ImpactAnalysisProps {
    data: ImpactAnalysisItem[];
}

const ImpactBadge: React.FC<{ impact: 'High' | 'Medium' | 'Low' }> = ({ impact }) => {
    const colors = {
        High: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Low: 'bg-blue-100 text-blue-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[impact]}`}>
            {impact} Impact
        </span>
    );
};

const ImpactAnalysis: React.FC<ImpactAnalysisProps> = ({ data }) => {
    return (
        <Card title="What's Working: An Analysis of Your Actions">
            {(!data || data.length === 0) ? (
                 <p className="text-center text-slate-500 py-8">Not enough data to analyze impact yet. Keep optimizing!</p>
            ) : (
                <ul className="divide-y divide-slate-200">
                    {data.map((item, index) => (
                        <li key={index} className="py-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-slate-800">{item.type}</h4>
                                <ImpactBadge impact={item.impact} />
                            </div>
                            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
};

export default ImpactAnalysis;