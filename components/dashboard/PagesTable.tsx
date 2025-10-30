import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, PageStatus } from '../../types';
import Button from '../common/Button';

interface PagesTableProps {
  pages: Page[];
}

const statusColors: Record<PageStatus, string> = {
  [PageStatus.Optimized]: 'bg-green-100 text-green-800',
  [PageStatus.Pending]: 'bg-blue-100 text-blue-800',
  [PageStatus.NeedsReview]: 'bg-yellow-100 text-yellow-800',
  [PageStatus.Failed]: 'bg-red-100 text-red-800',
};

const PagesTable: React.FC<PagesTableProps> = ({ pages }) => {
    const navigate = useNavigate();

    const handleView = (pageId: string) => {
        navigate(`/dashboard/page/${pageId}`);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Page URL</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Optimized</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {pages.map((page) => (
                        <tr key={page.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{page.url}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{page.lastOptimized ? new Date(page.lastOptimized).toLocaleDateString() : 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{page.score}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[page.status]}`}>
                                    {page.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="outline" size="sm" onClick={() => handleView(page.id)}>View</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PagesTable;
