import { useState } from "react";

const PostPrivacyToggle = ({ 
  isPrivate, 
  onToggle, 
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onToggle(!isPrivate);
    } catch (error) {
      console.error('Error toggling post privacy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-light-1">
            Private Post
          </label>
          <p className="text-xs text-light-3">
            When enabled, only you can see this post. Others can only see it if you share it directly.
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled || isLoading}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${isPrivate ? 'bg-primary-500' : 'bg-gray-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isLoading ? 'opacity-75' : ''}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${isPrivate ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
      {isLoading && (
        <p className="text-xs text-light-3">Updating post privacy...</p>
      )}
    </div>
  );
};

export default PostPrivacyToggle;
