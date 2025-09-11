import React from 'react';

const Textarea = ({ 
  label, 
  error, 
  className = '', 
  id,
  ...props 
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const textareaClasses = `flex min-h-[80px] w-full rounded-md border border-dark-4 bg-dark-4 px-3 py-2 text-sm text-light-1 ring-offset-dark-2 placeholder:text-light-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red' : ''} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block text-light-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red mt-1">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
