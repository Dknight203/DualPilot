import React from 'react';
import Card from '../../common/Card';

const GeoInsightsPlaceholder: React.FC = () => {
    return (
        <Card title="GEO & Local Search Insights">
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="mt-4 font-semibold text-slate-800">Coming Soon</h4>
                <p className="mt-1 text-sm text-slate-500">
                    Unlock insights into your performance in local search and map-grounded AI answers.
                </p>
            </div>
        </Card>
    );
};

export default GeoInsightsPlaceholder;
