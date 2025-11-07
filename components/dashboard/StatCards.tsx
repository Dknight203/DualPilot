import React from 'react';
import { Site } from '../../types';
import Card from '../common/Card';

interface StatCardsProps {
    site: Site;
}

const StatCard: React.FC<{ title: string; value: string | number; subtext?: string; children?: React.ReactNode }> = ({ title, value, subtext, children }) => (
    <Card>
        <h4 className="text-sm font-medium text-slate-500">{title}</h4>
        <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
        {subtext && <p className="text-sm text-slate-500">{subtext}</p>}
        {children}
    </Card>
);

const StatCards: React.FC<StatCardsProps> = ({ site }) => {
    const usagePercent = site.totalPages > 0 ? Math.round((site.optimizedPages / site.totalPages) * 100) : 0;
    
    let usageColor = 'bg-green-500';
    if (usagePercent > 90) usageColor = 'bg-red-500';
    else if (usagePercent > 75) usageColor = 'bg-yellow-500';

    return (
        <div id="stat-cards-container" className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Avg. Visibility Score" value="91" subtext="Across all optimized pages" />
            <StatCard title="Pages Optimized" value={`${site.optimizedPages} / ${site.totalPages}`}>
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                    <div className={`${usageColor} h-2.5 rounded-full`} style={{ width: `${usagePercent}%` }}></div>
                </div>
            </StatCard>
            <StatCard title="Index Pings (24h)" value="99.8%" subtext="145 successful pings" />
            <StatCard title="Next Refresh" value="23h 45m" subtext={`Daily refresh per ${site.plan} plan`} />
        </div>
    );
};

export default StatCards;