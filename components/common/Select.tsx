import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => {
  const baseClasses = 'block w-full pl-3 pr-10 py-2 border border-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-slate-50 text-slate-900';
  return <select className={`${baseClasses} ${className}`} {...props}>{children}</select>;
};

export default Select;