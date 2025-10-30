import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg leading-6 font-bold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;