import { useState } from 'react';

// Simple form hook for beginners
export const useSimpleForm = ({
  initialValues,
  validate,
  onSubmit
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update a single field value
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Set error for a specific field
  const setError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Set multiple errors at once
  const setFormErrors = (newErrors) => {
    setErrors(newErrors);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form if validation function is provided
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial values
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    setErrors: setFormErrors,
    handleSubmit,
    reset
  };
};
