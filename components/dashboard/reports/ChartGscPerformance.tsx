import React, { useState, useMemo } from 'react';
import { GscDataPoint } from '../../../types';

interface ChartGscPerformanceProps {
  currentData: GscDataPoint[];
  previousData?: GscDataPoint[];
}

const ChartGscPerformance: React.FC<ChartGscPerformanceProps> = ({ currentData, previousData }) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    index: number;
  } | null>(null);

  const combinedData = useMemo(() => {
    return currentData.map((currentPoint, index) => ({
      ...currentPoint,
      previousClicks: previousData?.[index]?.clicks,
      previousImpressions: previousData?.[index]?.impressions,
    }));
  }, [currentData, previousData]);

  if (!currentData || currentData.length === 0) {
    return <p className="text-center text-slate-500 py-10">No GSC data available for this period.</p>;
  }

  const width = 500;
  const height = 200;
  const padding = { top: 20, right: 50, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;


  const allImpressions = combinedData.flatMap(d => [d.impressions, d.previousImpressions]).filter(v => v !== undefined) as number[];
  const allClicks = combinedData.flatMap(d => [d.clicks, d.previousClicks]).filter(v => v !== undefined) as number[];

  const maxImpressions = Math.ceil(Math.max(1, ...allImpressions) * 1.1);
  const maxClicks = Math.ceil(Math.max(1, ...allClicks) * 1.1);

  const getX = (index: number) => padding.left + (index / (currentData.length - 1)) * chartWidth;
  
  const getImpressionY = (imp: number) => padding.top + (1 - imp / maxImpressions) * chartHeight;
  const getClickY = (click: number) => padding.top + (1 - click / maxClicks) * chartHeight;

  const createPath = (dataKey: 'clicks' | 'impressions', source: 'current' | 'previous' = 'current') => {
    const data = source === 'current' ? currentData : previousData;
    if (!data) return '';
    const getY = dataKey === 'clicks' ? getClickY : getImpressionY;
    return data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(point[dataKey])}`).join(' ');
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    if (mouseX < padding.left || mouseX > width - padding.right) {
        if (tooltip) handleMouseLeave();
        return;
    }
    
    // ACCURATE TOOLTIP LOGIC: Find the closest data point to the mouse
    let closestIndex = 0;
    let minDistance = Infinity;
    currentData.forEach((_, index) => {
        const pointX = getX(index);
        const distance = Math.abs(mouseX - pointX);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });

    const index = closestIndex;

    if (index >= 0 && index < currentData.length) {
      const x = getX(index);
      setTooltip({ visible: true, x, y: e.clientY - rect.top, index });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const tooltipData = tooltip ? combinedData[tooltip.index] : null;

  return (
    <div className="w-full h-72 relative" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <g className="grid">
            {/* Y-axis grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                <line key={tick} x1={padding.left} x2={width - padding.right} y1={padding.top + tick * chartHeight} y2={padding.top + tick * chartHeight} stroke="#E2E8F0" strokeWidth="1"/>
            ))}
             {/* X-axis grid lines (simplified) */}
            {[0, 0.5, 1].map(tick => (
                 <line key={tick} x1={padding.left + tick * chartWidth} x2={padding.left + tick * chartWidth} y1={padding.top} y2={height-padding.bottom} stroke="#E2E8F0" strokeWidth="1"/>
            ))}
        </g>

        {/* Y-axis labels */}
        <text x={padding.left - 10} y={padding.top + 5} textAnchor="end" fontSize="10" className="fill-slate-500">{maxImpressions.toLocaleString()}</text>
        <text x={padding.left - 10} y={height - padding.bottom} textAnchor="end" fontSize="10" className="fill-slate-500">0</text>
        <text x={width - padding.right + 10} y={padding.top + 5} textAnchor="start" fontSize="10" className="fill-slate-500">{maxClicks.toLocaleString()}</text>
        
        {/* X-axis labels */}
        <text x={padding.left} y={height - 10} fontSize="10" className="fill-slate-500">{currentData[0].date}</text>
        <text x={width - padding.right} y={height - 10} textAnchor="end" fontSize="10" className="fill-slate-500">{currentData[currentData.length - 1].date}</text>

        {/* Previous data lines (dashed) */}
        {previousData && <>
            <path d={createPath('impressions', 'previous')} stroke="#60A5FA" fill="none" strokeWidth="2" strokeDasharray="4 4" />
            <path d={createPath('clicks', 'previous')} stroke="#A78BFA" fill="none" strokeWidth="2" strokeDasharray="4 4" />
        </>}
        
        {/* Current data lines (solid) */}
        <path d={createPath('impressions')} stroke="#2563EB" fill="none" strokeWidth="2" />
        <path d={createPath('clicks')} stroke="#7C3AED" fill="none" strokeWidth="2" />

        {/* Tooltip vertical line */}
        {tooltip?.visible && (
            <line x1={tooltip.x} y1={padding.top} x2={tooltip.x} y2={height - padding.bottom} stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,3" />
        )}
      </svg>
      
      {/* Tooltip box */}
      {tooltip?.visible && tooltipData && (
        <div 
          className="absolute bg-white p-3 rounded-lg shadow-lg border border-slate-200 pointer-events-none transition-transform duration-100"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 40}px`,
            transform: `translateX(${tooltip.x > width / 2 ? '-110%' : '0'})`,
          }}
        >
            <p className="font-bold text-sm mb-2">{tooltipData.date}</p>
            <div className="text-xs space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Impressions:</span><span className="font-semibold ml-2" style={{color: '#2563EB'}}>{Math.round(tooltipData.impressions).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Clicks:</span><span className="font-semibold ml-2" style={{color: '#7C3AED'}}>{Math.round(tooltipData.clicks).toLocaleString()}</span></div>
                {tooltipData.previousImpressions !== undefined && <div className="flex justify-between opacity-70"><span className="text-slate-500">Prev. Impressions:</span><span className="font-semibold ml-2" style={{color: '#60A5FA'}}>{Math.round(tooltipData.previousImpressions).toLocaleString()}</span></div>}
                {tooltipData.previousClicks !== undefined && <div className="flex justify-between opacity-70"><span className="text-slate-500">Prev. Clicks:</span><span className="font-semibold ml-2" style={{color: '#A78BFA'}}>{Math.round(tooltipData.previousClicks).toLocaleString()}</span></div>}
            </div>
        </div>
      )}

      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4">
        <div className="flex items-center space-x-2 text-sm"><div className="w-3 h-3 rounded-full bg-[#2563EB]"></div><span className="text-slate-600">Impressions</span></div>
        <div className="flex items-center space-x-2 text-sm"><div className="w-3 h-3 rounded-full bg-[#7C3AED]"></div><span className="text-slate-600">Clicks</span></div>
        {previousData && <div className="flex items-center space-x-2 text-sm"><div className="w-3 h-0.5 bg-[#60A5FA]"></div><span className="text-slate-600">Prev. Impressions</span></div>}
        {previousData && <div className="flex items-center space-x-2 text-sm"><div className="w-3 h-0.5 bg-[#A78BFA]"></div><span className="text-slate-600">Prev. Clicks</span></div>}
      </div>
    </div>
  );
};

export default ChartGscPerformance;