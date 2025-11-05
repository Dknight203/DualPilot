import React from 'react';
import { GscDataPoint } from '../../../types';

interface ChartGscPerformanceProps {
  data: GscDataPoint[];
}

const ChartGscPerformance: React.FC<ChartGscPerformanceProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No GSC data available.</p>;
  }

  const width = 500;
  const height = 200;
  const padding = 40;

  const clicks = data.map(d => d.clicks);
  const impressions = data.map(d => d.impressions);

  const maxImpressions = Math.max(...impressions);
  const maxClicks = Math.max(...clicks);

  const getX = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
  
  const getClickY = (click: number) => height - padding - (click / maxClicks) * (height - 2 * padding);
  const getImpressionY = (impression: number) => height - padding - (impression / maxImpressions) * (height - 2 * padding);

  const clickPath = data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getClickY(point.clicks)}`).join(' ');
  const impressionPath = data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getImpressionY(point.impressions)}`).join(' ');

  return (
    <div className="w-full h-64 relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Y-axis labels for Impressions */}
        <text x="10" y={padding - 10} fontSize="10" fill="#0A66C2">{maxImpressions.toLocaleString()}</text>
        <text x="10" y={height - padding + 10} fontSize="10" fill="#0A66C2">0</text>
        
        {/* Y-axis labels for Clicks */}
        <text x={width - 10} y={padding - 10} textAnchor="end" fontSize="10" fill="#4F46E5">{maxClicks.toLocaleString()}</text>
        <text x={width - 10} y={height - padding + 10} textAnchor="end" fontSize="10" fill="#4F46E5">0</text>

        {/* X-axis labels */}
        <text x={padding} y={height - 10} fontSize="10" fill="currentColor" className="text-slate-500">{data[0].date}</text>
        <text x={width - padding} y={height - 10} textAnchor="end" fontSize="10" fill="currentColor" className="text-slate-500">{data[data.length - 1].date}</text>

        <path d={impressionPath} stroke="#0A66C2" fill="none" strokeWidth="2" />
        <path d={clickPath} stroke="#4F46E5" fill="none" strokeWidth="2" />
      </svg>
      <div className="flex justify-center space-x-4 mt-2">
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0A66C2' }}></div>
            <span className="text-sm text-slate-600">Impressions</span>
        </div>
         <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4F46E5' }}></div>
            <span className="text-sm text-slate-600">Clicks</span>
        </div>
      </div>
    </div>
  );
};

export default ChartGscPerformance;
