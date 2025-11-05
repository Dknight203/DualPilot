import React from 'react';
import { PageImprovementData } from '../../../types';

interface ChartPageImprovementsProps {
  data: PageImprovementData[];
}

const ChartPageImprovements: React.FC<ChartPageImprovementsProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-slate-500">No page improvements to display yet.</p>;
  }

  const maxChange = Math.max(...data.map(d => d.scoreChange));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-1/3 text-sm text-slate-600 truncate text-right">{item.url}</div>
          <div className="w-2/3 bg-slate-200 rounded-full h-6">
            <div
              className="bg-gradient-to-r from-accent-start to-accent-end h-6 rounded-full flex items-center px-2"
              style={{ width: `${(item.scoreChange / maxChange) * 100}%` }}
            >
              <span className="text-white font-bold text-sm">+{item.scoreChange}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartPageImprovements;
