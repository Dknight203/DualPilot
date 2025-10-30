import React from 'react';
import { PieChartData, PageStatus } from '@/lib/types';

interface ChartPieStatusProps {
    data: PieChartData[];
}

export default function ChartPieStatus({ data }: ChartPieStatusProps) {
    if (!data || data.length === 0) {
        return <p>No data available.</p>;
    }

    const colors: Record<PageStatus, string> = {
        [PageStatus.Optimized]: '#22c55e', // green-500
        [PageStatus.NeedsReview]: '#f59e0b', // amber-500
        [PageStatus.Pending]: '#3b82f6', // blue-500
        [PageStatus.Failed]: '#ef4444', // red-500
    };

    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <p className="text-center text-gray-500">No page data to display.</p>;
    
    let cumulativePercent = 0;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="flex flex-col items-center">
            <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-48 h-48 transform -rotate-90">
                {data.map(item => {
                    const slicePercent = item.value / total;
                    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                    cumulativePercent += slicePercent;
                    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                    const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

                    const pathData = [
                        `M ${startX} ${startY}`, // Move
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                        `L 0 0`, // Line to center
                    ].join(' ');

                    return <path key={item.name} d={pathData} fill={colors[item.name]} />;
                })}
            </svg>
            <div className="mt-4 w-full">
                <ul className="space-y-2">
                    {data.map(item => (
                        <li key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[item.name] }}></span>
                                <span>{item.name}</span>
                            </div>
                            <span className="font-medium">{item.value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
