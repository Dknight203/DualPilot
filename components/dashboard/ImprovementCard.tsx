import React from 'react';
import { Link } from 'react-router-dom';
import { ImprovedPage } from '../../types';
import Card from '../common/Card';

interface ImprovementCardProps {
    page: ImprovedPage;
}

const MetaDiff: React.FC<{ label: string; oldValue: string; newValue: string }> = ({ label, oldValue, newValue }) => (
    <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</h4>
        <p className="mt-1 text-sm text-red-600 line-through decoration-red-400">{oldValue}</p>
        <p className="mt-1 text-sm text-green-700">{newValue}</p>
    </div>
);

const ImprovementCard: React.FC<ImprovementCardProps> = ({ page }) => {
    return (
        <Card interactive={true}>
            <div className="flex flex-col h-full">
                <div className="flex-grow">
                    <Link to={`/dashboard/page/${page.pageId}`} className="font-bold text-slate-800 hover:text-accent-default transition-colors truncate">
                        {page.url}
                    </Link>
                    <div className="mt-4 space-y-4">
                        <MetaDiff label="Title" oldValue={page.oldTitle} newValue={page.newTitle} />
                        <MetaDiff label="Description" oldValue={page.oldDescription} newValue={page.newDescription} />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 text-right">
                    <Link to={`/dashboard/page/${page.pageId}`} className="text-sm font-semibold text-accent-default hover:underline">
                        View Details &rarr;
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default ImprovementCard;