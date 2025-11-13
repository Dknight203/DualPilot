import React from 'react';

// FIX: Used Omit to resolve title prop type conflict between custom ReactNode title and HTMLAttributes string title.
interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  interactive?: boolean;
  bodyClassName?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, interactive = false, bodyClassName = 'p-6', ...props }) => {
  const interactiveClasses = interactive ? 'card-interactive' : '';
  
  return (
    <div {...props} className={`bg-white shadow rounded-2xl border border-slate-100 overflow-hidden flex flex-col ${interactiveClasses} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-100">
          {typeof title === 'string' ? (
            <h3 className="text-lg leading-6 font-bold text-slate-900">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      <div className={`${bodyClassName} flex-grow`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
