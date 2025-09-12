import React from 'react';

const Button = ({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    default: 'bg-primary-500 text-light-1 hover:bg-primary-500/90',
    destructive: 'bg-red text-light-1 hover:bg-red/90',
    outline: 'border border-dark-4 bg-dark-4 hover:bg-dark-3 hover:text-light-1',
    secondary: 'bg-dark-3 text-light-1 hover:bg-dark-4',
    ghost: 'hover:bg-dark-4 hover:text-light-1',
    link: 'text-light-1 underline-offset-4 hover:underline',
  };
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
