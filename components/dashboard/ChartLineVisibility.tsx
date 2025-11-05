import React, { useState, useRef } from 'react';
import { LineChartData } from '../../types';

interface ChartLineVisibilityProps {
  data: LineChartData[];
}

const ChartLineVisibility: React.FC<ChartLineVisibilityProps> = ({ data }) => {
  const [hoverData, setHoverData] = useState<{ x: number; y: number; point: LineChartData } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) {
    return <p className="text-center text-slate-500">No visibility data available.</p>;
  }

  const width = 600;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  const scores = data.map(d => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const yAxisMin = Math.max(0, Math.floor(minScore / 10) * 10 - 10);
  const yAxisMax = Math.ceil(maxScore / 10) * 10 + 10;
  
  const xScale = (index: number) => 
    padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);

  const yScale = (score: number) => 
    height - padding.bottom - ((score - yAxisMin) / (yAxisMax - yAxisMin)) * (height - padding.top - padding.bottom);

  const pathData = data.map((point, i) => {
    const x = xScale(i);
    const y = yScale(point.score);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    
    // Create an SVG point for the mouse event's screen coordinates
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    // Get the transformation matrix from screen coordinates to SVG's internal coordinates
    const ctm = svg.getScreenCTM();
    if (ctm) {
        // Transform the point using the inverse of the matrix
        const svgPoint = point.matrixTransform(ctm.inverse());
        const viewBoxX = svgPoint.x;

        // Calculate the data point index based on the precise position within the viewBox
        const plotAreaWidth = width - padding.left - padding.right;
        const positionInPlotArea = viewBoxX - padding.left;
        const ratio = Math.max(0, Math.min(1, positionInPlotArea / plotAreaWidth));
        const index = Math.round(ratio * (data.length - 1));

        if (index >= 0 && index < data.length) {
            const pointData = data[index];
            setHoverData({
                x: xScale(index),
                y: yScale(pointData.score),
                point: pointData,
            });
        }
    }
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  // Generate Y-axis grid lines and labels
  const yAxisTicks = Array.from({ length: 5 }, (_, i) => {
    const score = yAxisMin + (i / 4) * (yAxisMax - yAxisMin);
    return { score: Math.round(score), y: yScale(score) };
  });

  return (
    <div className="w-full h-72 -ml-4">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-full" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        {/* Grid Lines */}
        {yAxisTicks.map(tick => (
          <line key={tick.score} x1={padding.left} y1={tick.y} x2={width - padding.right} y2={tick.y} stroke="#E2E8F0" strokeWidth="1" />
        ))}

        {/* Y-axis labels */}
        {yAxisTicks.map(tick => (
          <text key={tick.score} x={padding.left - 8} y={tick.y + 3} textAnchor="end" fontSize="10" fill="currentColor" className="text-slate-500">
            {tick.score}
          </text>
        ))}

        {/* X-axis labels */}
        <text x={padding.left} y={height - 10} fontSize="10" fill="currentColor" className="text-slate-500">{data[0].date}</text>
        <text x={width - padding.right} y={height - 10} textAnchor="end" fontSize="10" fill="currentColor" className="text-slate-500">{data[data.length - 1].date}</text>

        {/* Line Path */}
        <path d={pathData} stroke="#2563EB" fill="none" strokeWidth="2" />
        
        {/* Interactive Tooltip */}
        {hoverData && (
          <g>
            <line x1={hoverData.x} y1={padding.top} x2={hoverData.x} y2={height - padding.bottom} stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={hoverData.x} cy={hoverData.y} r="4" fill="#2563EB" stroke="white" strokeWidth="2" />
            <g transform={`translate(${hoverData.x > width / 2 ? hoverData.x - 120 : hoverData.x + 10}, ${hoverData.y - 20})`}>
                <rect width="110" height="40" rx="4" fill="rgba(15, 23, 42, 0.8)" />
                <text x="10" y="18" fontSize="12" fill="white" className="font-semibold">{hoverData.point.date}</text>
                <text x="10" y="32" fontSize="12" fill="white">Score: <tspan className="font-bold">{hoverData.point.score.toFixed(1)}</tspan></text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default ChartLineVisibility;