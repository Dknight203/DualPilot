import React from 'react';
import { StackedBarChartData } from '@/lib/types';

interface ChartStackedIssuesProps {
    data: StackedBarChartData[];
}

export default function ChartStackedIssues({ data }: ChartStackedIssuesProps) {
    if (!data || data.length === 0) {
        return <p>No data available.</p>;
    }

    const width = 800;
    const height = 300;
    const padding = 40;
    const barWidth = (width - 2 * padding) / data.length;

    const categories = ['title', 'description', 'canonical', 'schema', 'brokenLinks'] as const;
    const colors = {
        title: '#3b82f6', // blue-500
        description: '#60a5fa', // blue-400
        canonical: '#2563eb', // blue-600
        schema: '#1d4ed8', // blue-700
        brokenLinks: '#93c5fd', // blue-300
    };

    const maxVal = Math.max(...data.map(d => categories.reduce((sum, cat) => sum + d[cat], 0)));
    if (maxVal === 0) return <p className="text-center text-gray-500">No issues fixed in this period.</p>;

    return (
        <div className="w-full h-80">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                {data.map((d, i) => {
                    let yOffset = height - padding;
                    const x = padding + i * barWidth;
                    
                    return (
                        <g key={d.date}>
                            {categories.map(cat => {
                                const barHeight = (d[cat] / maxVal) * (height - 2 * padding);
                                yOffset -= barHeight;
                                return (
                                    <rect
                                        key={cat}
                                        x={x}
                                        y={yOffset}
                                        width={barWidth * 0.8}
                                        height={barHeight}
                                        fill={colors[cat]}
                                    />
                                );
                            })}
                             <text x={x + (barWidth * 0.4)} y={height - 25} textAnchor="middle" fontSize="10" className="text-gray-500 fill-current">
                                {new Date(d.date).getDate()}
                            </text>
                        </g>
                    );
                })}
            </svg>
             <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-4">
                {categories.map(cat => (
                    <div key={cat} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[cat] }}></div>
                        <span className="text-sm text-gray-600 capitalize">{cat.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
