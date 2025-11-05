import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', isLoading = false, className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center border border-transparent font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-accent-start to-accent-end text-white hover:opacity-90 focus:ring-[#93C5FD]',
    secondary: 'bg-secondary text-white hover:bg-primary-focus focus:ring-secondary',
    outline: 'border border-[#0A66C2] text-[#0A66C2] bg-white hover:bg-[#EEF5FD] focus:ring-[#93C5FD] disabled:bg-slate-100 disabled:text-slate-500',
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const disabled = props.disabled || isLoading;
  const disabledClasses = (variant === 'primary' || variant === 'secondary') ? 'disabled:opacity-50' : '';

  return (
    <button
      {...props}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;