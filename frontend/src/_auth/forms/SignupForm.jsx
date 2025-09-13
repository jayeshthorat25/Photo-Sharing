import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useCreateUserAccount, useSignInAccount } from "@/hooks/useQueries";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

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
    try {
      const newUser = await createUserAccount(formData);

      if (!newUser) {
        alert("Sign up failed. Please try again.");
        return;
      }

      const session = await signInAccount({
        email: formData.email,
        password: formData.password,
      });

      if (!session) {
        alert("Something went wrong. Please login your new account");
        navigate("/sign-in");
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        setFormData({ name: "", username: "", email: "", password: "", password_confirm: "" });
        navigate("/home");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
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
            className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
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
            className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-sm text-red-500 mt-1">{errors.username}</p>
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

        <div>
          <label htmlFor="password_confirm" className="block text-sm font-medium text-light-1 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="password_confirm"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Confirm your password"
          />
          {errors.password_confirm && (
            <p className="text-sm text-red-500 mt-1">{errors.password_confirm}</p>
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
