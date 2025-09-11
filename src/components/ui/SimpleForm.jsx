import React, { createContext, useContext } from 'react';

const FormContext = createContext(undefined);

export const Form = ({ children, onSubmit, className = '' }) => {
  const [errors, setErrors] = React.useState({});

  return (
    <FormContext.Provider value={{ errors, setErrors }}>
      <form onSubmit={onSubmit} className={className}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

export const FormField = ({ name, children }) => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('FormField must be used within a Form');
  }
  
  const { errors } = context;
  return <>{children({ error: errors[name] })}</>;
};

export const FormItem = ({ children, className = '' }) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

export const FormLabel = ({ children, htmlFor, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  );
};

export const FormControl = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export const FormMessage = ({ children, className = '' }) => {
  return <p className={`text-sm text-red-500 ${className}`}>{children}</p>;
};
