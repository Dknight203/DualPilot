import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, interactive = false, ...props }) => {
  const interactiveClasses = interactive ? 'card-interactive' : '';
  
  return (
    <div {...props} className={`bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden flex flex-col ${interactiveClasses} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg leading-6 font-bold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="p-6 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;