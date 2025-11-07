import React from 'react';
import { Link } from 'react-router-dom';
import { OptimizationActivity } from '../../../types';

interface OptimizationActivityTableProps {
    data: OptimizationActivity[];
}

const OptimizationActivityTable: React.FC<OptimizationActivityTableProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-slate-500 py-8">No optimization activity in this period.</p>;
    }

    return (
        <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Page URL</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score Change</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Keywords Added</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {data.map((activity) => (
                        <tr key={activity.pageId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                <Link to={`/dashboard/page/${activity.pageId}`} className="text-accent-default hover:underline truncate">
                                    {activity.url}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {new Date(activity.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                +{activity.scoreChange}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                <div className="flex flex-wrap gap-1">
                                    {activity.keywords.slice(0, 3).map(kw => (
                                        <span key={kw} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">{kw}</span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OptimizationActivityTable;
