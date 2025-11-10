import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  const baseClasses = 'appearance-none block w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-slate-50 text-slate-900 disabled:bg-slate-200 disabled:cursor-not-allowed';
  return <input className={`${baseClasses} ${className}`} {...props} />;
};

export default Input;