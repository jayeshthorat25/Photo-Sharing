import { useState } from "react";

const PrivacyToggle = ({ 
  isPrivate, 
  onToggle, 
  disabled = false, 
  label = "Private Profile",
  description = "When enabled, other users cannot see your posts unless you share them directly."
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onToggle(!isPrivate);
    } catch (error) {
      console.error('Error toggling privacy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-light-1">
            {label}
          </label>
          <p className="text-xs text-light-3">
            {description}
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
        <p className="text-xs text-light-3">Updating privacy settings...</p>
      )}
    </div>
  );
};

export default PrivacyToggle;
