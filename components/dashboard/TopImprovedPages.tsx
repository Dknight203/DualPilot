import React from 'react';
import { ImprovedPage } from '../../types';
import ImprovementCard from './ImprovementCard';

interface TopImprovedPagesProps {
    pages: ImprovedPage[];
}

const TopImprovedPages: React.FC<TopImprovedPagesProps> = ({ pages }) => {
    return (
        <div id="top-pages-container">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Top Pages by Improvement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map(page => (
                    <ImprovementCard key={page.pageId} page={page} />
                ))}
            </div>
        </div>
    );
};

export default TopImprovedPages;