import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import ProfileUploader from "@/components/ProfileUploader";
import Loader from "@/components/Loader";
import PrivacyToggle from "@/components/PrivacyToggle";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useUpdateUser, useToggleUserPrivacy } from "@/hooks/useQueries";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();

  // Use current user if no ID provided, otherwise use the ID from params
  const userId = id || user.id;

  // Queries
  const { data: currentUser } = useGetUserById(userId);
  const { callApi: updateUser, isLoading: isLoadingUpdate } = useUpdateUser();
  const { callApi: togglePrivacy } = useToggleUserPrivacy();

  // Simple form state
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio || "",
    location: user.location || "",
    is_private: user.is_private || false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

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

  // Handle privacy toggle
  const handlePrivacyToggle = async (isPrivate) => {
    try {
      await togglePrivacy(isPrivate);
      setFormData(prev => ({
        ...prev,
        is_private: isPrivate
      }));
      setUser(prev => ({
        ...prev,
        is_private: isPrivate
      }));
      // Note: The profile page will automatically refresh the currentUser data
      // because the useGetUserById hook will refetch when the component re-renders
    } catch (error) {
      console.error('Error toggling privacy:', error);
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
        location: formData.location,
        is_private: formData.is_private,
        file: selectedFiles, // Pass selected files for profile image
        imageUrl: currentUser?.imageUrl || "",
        imageId: currentUser?.imageId || "",
      });

      if (updatedUser) {
        setUser({
          ...user,
          name: updatedUser.name,
          bio: updatedUser.bio,
          location: updatedUser.location,
          is_private: updatedUser.is_private,
          imageUrl: updatedUser.imageUrl || "",
        });
        navigate(`/profile/${userId}`);
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
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex-start gap-3 justify-start w-full mb-6">
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
            <div className="flex flex-col gap-6 w-full">
              <div className="flex justify-center mb-4">
                <ProfileUploader
                  fieldChange={setSelectedFiles} // Pass files to form state
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
                className="w-full h-12 px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="w-full h-12 px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500 opacity-50 cursor-not-allowed"
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
                className="w-full h-12 px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500 opacity-50 cursor-not-allowed"
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
                className="w-full min-h-[100px] px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500 custom-scrollbar resize-none"
                placeholder="Tell us about yourself"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-light-1 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full h-12 px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Where are you from?"
              />
            </div>


            <div className="bg-dark-4 p-4 rounded-lg">
              <PrivacyToggle
                isPrivate={formData.is_private}
                onToggle={handlePrivacyToggle}
                label="Private Profile"
                description="When enabled, other users cannot see your posts unless you share them directly."
              />
            </div>

              <div className="flex gap-4 items-center justify-end pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoadingUpdate || isSubmitting}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                >
                  {isLoadingUpdate ? "Loading..." : "Update Profile"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
