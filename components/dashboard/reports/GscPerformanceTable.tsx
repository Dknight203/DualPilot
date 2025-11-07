import React from 'react';
import { GscDataPoint } from '../../../types';

interface GscPerformanceTableProps {
    data: {
        current: GscDataPoint[];
        previous?: GscDataPoint[];
    }
}

const ChangeIndicator: React.FC<{ change: number | null }> = ({ change }) => {
    if (change === null) return null;
    const isPositive = change > 0;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    return (
        <span className={`text-xs font-semibold ${color} ml-2`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
        </span>
    );
}

const GscPerformanceTable: React.FC<GscPerformanceTableProps> = ({ data }) => {
    const { current: currentData, previous: previousData } = data;
    
    return (
        <div className="overflow-auto max-h-[32rem]">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Clicks</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Impressions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {currentData.map((row, index) => {
                        const prevRow = previousData?.[index];
                        const clicksChange = prevRow && prevRow.clicks > 0 ? ((row.clicks - prevRow.clicks) / prevRow.clicks) * 100 : null;
                        const impressionsChange = prevRow && prevRow.impressions > 0 ? ((row.impressions - prevRow.impressions) / prevRow.impressions) * 100 : null;

                        return (
                            <tr key={row.date}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">{row.date}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-800 text-right font-medium">
                                    {Math.round(row.clicks).toLocaleString()}
                                    {prevRow && <ChangeIndicator change={clicksChange} />}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-800 text-right font-medium">
                                    {Math.round(row.impressions).toLocaleString()}
                                    {prevRow && <ChangeIndicator change={impressionsChange} />}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default GscPerformanceTable;