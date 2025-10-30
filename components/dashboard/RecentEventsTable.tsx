import React from 'react';
import { Event as AppEvent } from '../../types';

interface RecentEventsTableProps {
  events: AppEvent[];
}

const statusColors: Record<AppEvent['status'], string> = {
    'Success': 'bg-green-100 text-green-800',
    'Failed': 'bg-red-100 text-red-800',
    'In Progress': 'bg-blue-100 text-blue-800',
};

const RecentEventsTable: React.FC<RecentEventsTableProps> = ({ events }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Event Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{event.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[event.status]}`}>
                                    {event.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(event.timestamp).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{event.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentEventsTable;
