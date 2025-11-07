import React from 'react';
import { OptimizationExample } from '../../types';

interface OptimizationExampleCardProps {
    example: OptimizationExample;
}

const OptimizationExampleCard: React.FC<OptimizationExampleCardProps> = ({ example }) => {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-sm font-medium text-slate-700 truncate">{example.url}</p>
            <div className="mt-2 text-sm">
                <p className="text-red-600 line-through decoration-red-400">
                    <span className="font-semibold">Before:</span> {example.oldTitle}
                </p>
                <p className="text-green-700">
                    <span className="font-semibold">After:</span> {example.newTitle}
                </p>
            </div>
        </div>
    );
};

export default OptimizationExampleCard;