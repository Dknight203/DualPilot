import React from 'react';

interface ChartPoint {
    label: string;
    value: number;
}

interface LineChartProps {
  data: ChartPoint[];
  compareData?: ChartPoint[];
  label: string;
  compareLabel?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, compareData, label, compareLabel }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-slate-500">No data available for this chart.</p>;
  }

  const allValues = [...data.map(d => d.value), ...(compareData ? compareData.map(d => d.value) : [])];
  const maxVal = Math.max(...allValues, 0);
  const minVal = 0; 

  const width = 500;
  const height = 250;
  const padding = 40;

  const getX = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
  const getY = (value: number) => height - padding - ((value - minVal) / (maxVal > 0 ? maxVal : 1)) * (height - 2 * padding);
  
  const createPath = (dataset: ChartPoint[]) => dataset.map((point, i) => {
      const x = getX(i);
      const y = getY(point.value);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');

  const mainPath = createPath(data);
  const comparePath = compareData ? createPath(compareData) : '';
  
  return (
    <div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* Y-axis labels */}
            <text x="10" y={getY(maxVal) + 5} fontSize="10" fill="currentColor" className="text-slate-500">{maxVal.toLocaleString()}</text>
            <text x="10" y={getY(minVal) + 5} fontSize="10" fill="currentColor" className="text-slate-500">{minVal}</text>
            
            {/* X-axis labels */}
            <text x={padding} y={height - 15} fontSize="10" fill="currentColor" className="text-slate-500">{data[0].label}</text>
            <text x={width - padding} y={height - 15} textAnchor="end" fontSize="10" fill="currentColor" className="text-slate-500">{data[data.length - 1].label}</text>

            {/* Compare Line */}
            {comparePath && <path d={comparePath} stroke="#a8b2c2" fill="none" strokeWidth="2" strokeDasharray="4" />}
            
            {/* Main Line */}
            <path d={mainPath} stroke="#2563EB" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                <span className="text-sm text-slate-600">{label}</span>
            </div>
            {compareData && compareLabel && (
                 <div className="flex items-center space-x-2">
                    <div className="w-3 h-0.5 bg-[#a8b2c2]"></div>
                    <span className="text-sm text-slate-600">{compareLabel}</span>
                </div>
            )}
        </div>
    </div>
  );
};

export default LineChart;
