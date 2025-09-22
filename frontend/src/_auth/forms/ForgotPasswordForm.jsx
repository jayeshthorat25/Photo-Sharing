import { Link } from "react-router-dom";
import { useState } from "react";
import { useForgotPassword } from "@/hooks/useQueries";

const ForgotPasswordForm = () => {
  const { callApi: forgotPassword, isLoading } = useForgotPassword();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError("");
    }
  };

  // Simple validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError("");
    
    try {
      await forgotPassword(formData.email);
      setIsSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 404) {
        errorMessage = "No account found with this email address.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="sm:w-420 flex-center flex-col">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="h3-bold md:h2-bold text-center mb-4">
          Check your email
        </h2>
        <p className="text-light-3 small-medium md:base-regular text-center mb-6">
          We've sent a password reset link to <strong>{formData.email}</strong>
        </p>
        <p className="text-light-3 small-medium text-center mb-8">
          Didn't receive the email? Check your spam folder or try again.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({ email: "" });
            }}
            className="w-full h-10 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 transition-colors"
          >
            Try another email
          </button>
          
          <Link
            to="/sign-in"
            className="w-full h-10 bg-dark-4 text-light-1 rounded-md font-medium hover:bg-dark-3 transition-colors flex items-center justify-center"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/logo.svg" alt="logo" />

      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
        Forgot your password?
      </h2>
      <p className="text-light-3 small-medium md:base-regular mt-2 text-center">
        No worries! Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full mt-4">
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
            <p className="text-sm text-red">{apiError}</p>
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-light-1 mb-2">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-sm mt-1 text-red">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full h-10 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isLoading ? "Sending..." : "Send reset link"}
        </button>

        <div className="text-center">
          <Link
            to="/sign-in"
            className="text-primary-500 text-small-semibold hover:text-primary-400 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
