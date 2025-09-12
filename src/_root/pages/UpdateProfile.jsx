import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { ProfileUploader, Loader } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useUpdateUser } from "@/hooks/useQueries";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();

  // Queries
  const { data: currentUser } = useGetUserById(id || "");
  const { callApi: updateUser, isLoading: isLoadingUpdate } = useUpdateUser();

  // Simple form state
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio || "",
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
      const updatedUser = await updateUser({
        userId: currentUser?.id || "",
        name: formData.name,
        bio: formData.bio,
        file: [],
        imageUrl: currentUser?.imageUrl || "",
        imageId: currentUser?.imageId || "",
      });

      if (updatedUser) {
        setUser({
          ...user,
          name: updatedUser.name,
          bio: updatedUser.bio,
          imageUrl: updatedUser.imageUrl || "",
        });
        navigate(`/profile/${id}`);
      } else {
        alert("Update user failed. Please try again.");
      }
    } catch (error) {
      console.error('Update error:', error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
            <div className="flex">
              <ProfileUploader
                fieldChange={() => {}} // Profile uploader handles its own state
                mediaUrl={currentUser?.imageUrl || ""}
              />
            </div>

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
                placeholder="Enter your name"
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
                disabled
                className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500 opacity-50 cursor-not-allowed"
                placeholder="Username"
              />
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
                disabled
                className="w-full h-10 px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500 opacity-50 cursor-not-allowed"
                placeholder="Email"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-light-1 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full min-h-[80px] px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500 custom-scrollbar"
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="flex gap-4 items-center justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoadingUpdate || isSubmitting}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoadingUpdate ? "Loading..." : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
