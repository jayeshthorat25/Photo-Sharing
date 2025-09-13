import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useSignInAccount } from "@/hooks/useQueries";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/SimpleToast";

const SigninForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { callApi: signInAccount, isLoading } = useSignInAccount();
  const { toast } = useToast();

  // Simple form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  };

  // Simple validation
  const validateForm = () => {
    const newErrors = {};
    
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
    try {
      const session = await signInAccount(formData);

      if (!session) {
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
        });
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        setFormData({ email: "", password: "" });
        navigate("/home");
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/logo.svg" alt="logo" />

      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
        Log in to your account
      </h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        Welcome back! Please enter your details.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full mt-4">
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
            className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-light-1 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading || isUserLoading}
          className="w-full h-10 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || isUserLoading ? "Loading..." : "Log in"}
        </button>

        <p className="text-small-regular text-light-2 text-center mt-2">
          Don&apos;t have an account?
          <Link
            to="/sign-up"
            className="text-primary-500 text-small-semibold ml-1">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SigninForm;
