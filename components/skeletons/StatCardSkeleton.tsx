import React from 'react';
import Card from '../common/Card';

const StatCardSkeleton: React.FC = () => (
    <Card>
        <div className="animate-pulse flex flex-col space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-300 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            <div className="h-2.5 bg-slate-200 rounded-full mt-2"></div>
        </div>
    </Card>
);

export default StatCardSkeleton;
