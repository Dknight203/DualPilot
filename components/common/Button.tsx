import React from 'react';

// FIX: Add size prop to ButtonProps to allow for different button sizes ('sm', 'md', 'lg').
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', isLoading = false, className = '', ...props }) => {
  // FIX: Remove size-specific classes (padding, font-size) from baseClasses to be handled dynamically by the size prop.
  const baseClasses = 'inline-flex items-center justify-center border border-transparent font-semibold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-accent-start to-accent-end text-white hover:opacity-90 focus:ring-accent-default',
    secondary: 'bg-secondary text-white hover:bg-primary-focus focus:ring-secondary',
    outline: 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-accent-default disabled:bg-slate-100 disabled:text-slate-500',
  };

  // FIX: Define a map of classes for each button size.
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabled = props.disabled || isLoading;

  // Primary and secondary variants get a simple opacity change when disabled.
  // Outline gets a specific color change for better clarity.
  const disabledClasses = (variant === 'primary' || variant === 'secondary') ? 'disabled:opacity-50' : '';

  return (
    <button
      {...props}
      disabled={disabled}
      // FIX: Apply the appropriate size class based on the size prop.
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