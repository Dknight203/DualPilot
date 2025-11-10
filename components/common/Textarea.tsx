import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => {
  const baseClasses = 'block w-full px-3 py-2 border border-slate-200 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-slate-50 text-slate-900';
  return <textarea className={`${baseClasses} ${className}`} {...props} />;
};

export default Textarea;