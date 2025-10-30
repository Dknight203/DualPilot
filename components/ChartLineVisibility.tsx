import React from 'react';
import { LineChartData } from '@/lib/types';

interface ChartLineVisibilityProps {
  data: LineChartData[];
}

export default function ChartLineVisibility({ data }: ChartLineVisibilityProps) {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const width = 500;
  const height = 200;
  const padding = 30;

  const scores = data.map(d => d.score);
  // Give some vertical room so the line doesn't hit the top/bottom
  const minScore = Math.floor(Math.min(...scores) / 10) * 10 - 10;
  const maxScore = Math.ceil(Math.max(...scores) / 10) * 10 + 10;

  const getX = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
  const getY = (score: number) => height - padding - ((score - minScore) / (maxScore - minScore)) * (height - 2 * padding);
  
  const pathData = data.map((point, i) => {
      const x = getX(i);
      const y = getY(point.score);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

  return (
    <div className="w-full h-64">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Y-axis labels */}
        <text x="10" y={getY(maxScore) + 5} fontSize="10" fill="currentColor" className="text-gray-500">{maxScore}</text>
        <text x="10" y={getY(minScore) + 5} fontSize="10" fill="currentColor" className="text-gray-500">{minScore}</text>
        
        {/* X-axis labels */}
        <text x={padding} y={height - 10} fontSize="10" fill="currentColor" className="text-gray-500">{data[0].date}</text>
        <text x={width - padding} y={height - 10} textAnchor="end" fontSize="10" fill="currentColor" className="text-gray-500">{data[data.length - 1].date}</text>

        {/* Line */}
        <path d={pathData} stroke="#2563EB" fill="none" strokeWidth="2" />
      </svg>
    </div>
  );
};
