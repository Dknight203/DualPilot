import React from 'react';
import { LineChartData } from '../../types';

interface ChartLineVisibilityProps {
  data: LineChartData[];
}

const ChartLineVisibility: React.FC<ChartLineVisibilityProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const width = 500;
  const height = 200;
  const padding = 30;

  const scores = data.map(d => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

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
        <text x="10" y={padding} fontSize="10" fill="currentColor" className="text-slate-500">{Math.round(maxScore)}</text>
        <text x="10" y={height - padding} fontSize="10" fill="currentColor" className="text-slate-500">{Math.round(minScore)}</text>
        
        {/* X-axis labels */}
        <text x={padding} y={height - 10} fontSize="10" fill="currentColor" className="text-slate-500">{data[0].date}</text>
        <text x={width - padding} y={height - 10} textAnchor="end" fontSize="10" fill="currentColor" className="text-slate-500">{data[data.length - 1].date}</text>

        {/* Line */}
        <path d={pathData} stroke="#3b82f6" fill="none" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default ChartLineVisibility;
