import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useCreateUserAccount, useSignInAccount } from "@/hooks/useQueries";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/SimpleToast";

const SignupForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { toast } = useToast();

  // Queries
  const { callApi: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { callApi: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  // Simple form state
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.password_confirm) {
      newErrors.password_confirm = "Please confirm your password";
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = "Passwords do not match";
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
    setApiError(""); // Clear any previous API errors
    
    try {
      const newUser = await createUserAccount(formData);

      if (!newUser) {
        setApiError("Sign up failed. Please try again with different credentials.");
        return;
      }

      const session = await signInAccount({
        email: formData.email,
        password: formData.password,
      });

      if (!session) {
        setApiError("Account created successfully! Please sign in with your new account.");
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        setFormData({ name: "", username: "", email: "", password: "", password_confirm: "" });
        navigate("/home");
      } else {
        setApiError("Account created but login failed. Please try signing in manually.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      // Extract specific error message from API response
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.username) {
        errorMessage = `Username: ${error.response.data.username[0]}`;
      } else if (error.response?.data?.email) {
        errorMessage = `Email: ${error.response.data.email[0]}`;
      } else if (error.response?.data?.password) {
        errorMessage = `Password: ${error.response.data.password[0]}`;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid request. Please check your input.";
      } else if (error.response?.status === 409) {
        errorMessage = "Username or email already exists. Please try different credentials.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/logo.svg" alt="logo" />

      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
        Create a new account
      </h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        To use snapgram, Please enter your details
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full mt-4">
        {apiError && (
          <div className={`border rounded-md p-3 ${
            apiError.includes("successfully") 
              ? "bg-green-500/10 border-green-500/20" 
              : "bg-red-500/10 border-red-500/20"
          }`}>
            <p className="text-sm" style={{ 
              color: apiError.includes("successfully") ? '#22c55e' : '#FF5A5A' 
            }}>{apiError}</p>
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-light-1 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-sm mt-1 text-red">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-light-1 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-sm mt-1 text-red">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-light-1 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm mt-1 text-red">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-light-1 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-10 px-3 py-2 pr-10 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your password"
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
          <label htmlFor="password_confirm" className="block text-sm font-medium text-light-1 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              className="w-full h-10 px-3 py-2 pr-10 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Confirm your password"
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
          {errors.password_confirm && (
            <p className="text-sm mt-1 text-red">{errors.password_confirm}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isCreatingAccount || isSigningInUser || isUserLoading}
          className="w-full h-10 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingAccount || isSigningInUser || isUserLoading ? "Loading..." : "Sign Up"}
        </button>

        <p className="text-small-regular text-light-2 text-center mt-2">
          Already have an account?
          <Link
            to="/sign-in"
            className="text-primary-500 text-small-semibold ml-1">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
