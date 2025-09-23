import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

const PostOptionsMenu = ({ 
  isOwner, 
  postId,
  onDelete 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setIsOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete();
  };

  const handleEditClick = () => {
    setIsOpen(false);
  };

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/shared/${postId}`;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post on SnapGram',
        url: shareUrl,
      }).catch((error) => {
        console.log('Error sharing:', error);
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback to clipboard
      copyToClipboard(shareUrl);
    }
    
    setIsOpen(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Share link copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Share link copied to clipboard!');
    }
  };

  // Show menu if user is owner OR if we want to show share option for all users
  // For now, we'll show share option for all users

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-dark-4 rounded-md transition-colors bg-dark-3/30"
        title="Post options"
      >
        <span className="text-light-1 text-xl font-bold">⋯</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 bg-dark-2 border border-dark-4 rounded-lg shadow-lg z-[9999] min-w-[180px] lg:min-w-[200px] xl:min-w-[220px]">
          <div className="py-1">
            {/* Share option - available for all users */}
            <button
              onClick={handleShareClick}
              className="w-full px-4 py-2 text-left text-sm lg:text-base text-light-1 hover:bg-dark-3 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <img src="/assets/icons/share.svg" alt="share" width={14} height={14} className="opacity-70 flex-shrink-0" />
              Share post
            </button>
            
            {/* Owner-only options */}
            {isOwner && (
              <>
                <Link
                  to={`/update-post/${postId}`}
                  onClick={handleEditClick}
                  className="w-full px-4 py-2 text-left text-sm lg:text-base text-light-1 hover:bg-dark-3 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <img src="/assets/icons/edit.svg" alt="edit" width={14} height={14} className="opacity-70 flex-shrink-0" />
                  Edit post
                </Link>
                
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-2 text-left text-sm lg:text-base text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <img src="/assets/icons/delete.svg" alt="delete" width={14} height={14} className="opacity-70 flex-shrink-0" />
                  Delete post
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default PostOptionsMenu;
