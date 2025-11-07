
import React from 'react';
import { LineChartData } from '../../types';

interface ChartLineVisibilityProps {
  data: LineChartData[];
}

const ChartLineVisibility: React.FC<ChartLineVisibilityProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-slate-500">No visibility data available.</p>;
  }

  const width = 500;
  const height = 200;
  const padding = 30;

  const scores = data.map(d => d.score);
  const minScore = Math.max(0, Math.floor(Math.min(...scores) / 10) * 10 - 10);
  const maxScore = Math.min(100, Math.ceil(Math.max(...scores) / 10) * 10 + 10);

  const getX = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
  const getY = (score: number) => height - padding - ((score - minScore) / (maxScore - minScore)) * (height - 2 * padding);
  
  const pathData = data.map((point, i) => {
      const x = getX(i);
      const y = getY(point.score);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

  const areaData = `${pathData} L ${getX(data.length - 1)},${height - padding} L ${getX(0)},${height - padding} Z`;

  return (
    <div className="w-full h-64">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
            <linearGradient id="visibilityGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(37, 99, 235, 0.2)" />
                <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
            </linearGradient>
        </defs>
        {/* Y-axis labels */}
        <text x="10" y={getY(maxScore) + 5} fontSize="10" fill="currentColor" className="text-slate-500">{maxScore}</text>
        <text x="10" y={getY(minScore) + 5} fontSize="10" fill="currentColor" className="text-slate-500">{minScore}</text>
        
        {/* X-axis labels */}
        <text x={padding} y={height - 10} fontSize="10" fill="currentColor" className="text-slate-500">{data[0].date}</text>
        <text x={width - padding} y={height - 10} textAnchor="end" fontSize="10" fill="currentColor" className="text-slate-500">{data[data.length - 1].date}</text>

        {/* Area */}
        <path d={areaData} fill="url(#visibilityGradient)" />

        {/* Line */}
        <path d={pathData} stroke="#2563EB" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export default ChartLineVisibility;
