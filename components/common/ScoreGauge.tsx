import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-green-500';
    if (s >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const colorClass = getScoreColor(score);
  
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-slate-200"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${colorClass} transition-all duration-1000`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <span className={`absolute text-3xl font-bold ${colorClass}`}>
        {score}
      </span>
    </div>
  );
};

export default ScoreGauge;
