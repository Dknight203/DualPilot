import React from 'react';
import Card from '../common/Card';

const ImprovementCardSkeleton: React.FC = () => (
    <Card>
        <div className="animate-pulse flex flex-col h-full">
            <div className="flex-grow space-y-4">
                <div className="h-5 bg-slate-300 rounded w-3/4"></div>
                <div className="space-y-2 pt-2">
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-300 rounded w-full"></div>
                </div>
                 <div className="space-y-2 pt-2">
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-300 rounded w-full"></div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="h-4 bg-slate-300 rounded w-1/3 ml-auto"></div>
            </div>
        </div>
    </Card>
);

export default ImprovementCardSkeleton;