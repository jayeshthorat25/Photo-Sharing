import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useUserContext } from "@/context/AuthContext";
import FileUploader from "@/components/FileUploader";
import PrivacyToggle from "@/components/PrivacyToggle";
import { useCreatePost, useUpdatePost } from "@/hooks/useQueries";

const PostForm = ({ post, action }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  // Query
  const { callApi: createPost, isLoading: isLoadingCreate } = useCreatePost();
  const { callApi: updatePost, isLoading: isLoadingUpdate } = useUpdatePost();

  // Simple form state
  const [formData, setFormData] = useState({
    caption: post ? post?.caption : "",
    location: post ? post.location : "",
    tags: post ? (Array.isArray(post.tags) ? post.tags.join(",") : post.tags || "") : "",
    is_private: post ? post.is_private : false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Update form data when post changes (for edit mode)
  useEffect(() => {
    if (post && action === "Update") {
      const newFormData = {
        caption: post.caption || "",
        location: post.location || "",
        tags: post.tags ? (Array.isArray(post.tags) ? post.tags.join(",") : (post.tags || "")) : "",
        is_private: post.is_private || false,
      };
      setFormData(newFormData);
    }
  }, [post, action]);

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
  const handlePrivacyToggle = (isPrivate) => {
    setFormData(prev => ({
      ...prev,
      is_private: isPrivate
    }));
  };

  // Simple validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.caption.trim()) {
      newErrors.caption = "Caption is required";
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
      // ACTION = UPDATE
      if (post && action === "Update") {
        const updatedPost = await updatePost({
          ...formData,
          postId: post.id,
          imageId: post.imageId,
          imageUrl: post.imageUrl,
          file: selectedFiles, // Pass selected files
        });

        if (updatedPost) {
          navigate(`/posts/${post.id}`);
        } else {
          alert(`${action} post failed. Please try again.`);
        }
        return;
      }

      // ACTION = CREATE
      const newPost = await createPost({
        ...formData,
        userId: user.id,
        file: selectedFiles, // Pass selected files
      });

      if (newPost) {
        navigate("/home");
      } else {
        alert(`${action} post failed. Please try again.`);
      }
    } catch (error) {
      console.error('Post submission error:', error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Early return if no user context
  if (!user) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-light-1">Loading user data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 w-full">
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-light-1 mb-2">
              Caption
            </label>
          <textarea
            id="caption"
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            className="w-full min-h-[100px] px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500 custom-scrollbar resize-none"
            placeholder="Write a caption..."
          />
          {errors.caption && (
            <p className="text-sm text-red-500 mt-1">{errors.caption}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-light-1 mb-2">
            Add Photos
          </label>
          <FileUploader
            fieldChange={setSelectedFiles} // Pass files to form state
            mediaUrl={post?.imageUrl || ""}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-light-1 mb-2">
            Add Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full h-12 px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Add location"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-light-1 mb-2">
            Add Tags (separated by comma " , ")
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full h-12 px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Art, Expression, Learn"
          />
        </div>

        <div className="bg-dark-4 p-4 rounded-lg">
          <PrivacyToggle
            isPrivate={formData.is_private}
            onToggle={handlePrivacyToggle}
            type="post"
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
            disabled={isLoadingCreate || isLoadingUpdate || isSubmitting}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
          >
            {isLoadingCreate || isLoadingUpdate ? "Loading..." : `${action} Post`}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
