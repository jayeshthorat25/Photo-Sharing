import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  id,
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = `flex h-10 w-full rounded-md border border-dark-4 bg-dark-4 px-3 py-2 text-sm text-light-1 ring-offset-dark-2 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-light-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red' : ''} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block text-light-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
