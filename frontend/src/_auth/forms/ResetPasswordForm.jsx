import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useResetPassword } from "@/hooks/useQueries";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { callApi: resetPassword, isLoading } = useResetPassword();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if token is valid on component mount
  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

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
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      await resetPassword(token, formData.password);
      setIsSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid or expired reset token.";
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
          Password reset successful!
        </h2>
        <p className="text-light-3 small-medium md:base-regular text-center mb-8">
          Your password has been successfully updated. You can now log in with your new password.
        </p>

        <Link
          to="/sign-in"
          className="w-full h-10 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 transition-colors flex items-center justify-center"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/logo.svg" alt="logo" />

      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
        Reset your password
      </h2>
      <p className="text-light-3 small-medium md:base-regular mt-2 text-center">
        Enter your new password below.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full mt-4">
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
            <p className="text-sm text-red">{apiError}</p>
          </div>
        )}
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-light-1 mb-2">
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-10 px-3 py-2 pr-10 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-1 hover:text-primary-500 transition-colors"
            >
              <img
                src={showPassword ? "/assets/icons/eye-slash.svg" : "/assets/icons/eye.svg"}
                alt={showPassword ? "Hide password" : "Show password"}
                className="w-5 h-5 filter brightness-0 invert"
              />
            </button>
          </div>
          {errors.password && (
            <p className="text-sm mt-1 text-red">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-1 mb-2">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full h-10 px-3 py-2 pr-10 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-1 hover:text-primary-500 transition-colors"
            >
              <img
                src={showConfirmPassword ? "/assets/icons/eye-slash.svg" : "/assets/icons/eye.svg"}
                alt={showConfirmPassword ? "Hide password" : "Show password"}
                className="w-5 h-5 filter brightness-0 invert"
              />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm mt-1 text-red">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full h-10 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isLoading ? "Updating..." : "Update password"}
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

export default ResetPasswordForm;
