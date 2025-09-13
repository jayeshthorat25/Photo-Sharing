import { useState, useRef, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';

const CommentOptionsMenu = ({ 
  isOwner, 
  isPostOwner, 
  isPinned, 
  isEditing,
  onEdit, 
  onDelete, 
  onPin, 
  onCancelEdit 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
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

  const handlePinClick = () => {
    if (!isPinned) {
      setShowPinModal(true);
    } else {
      onPin();
    }
    setIsOpen(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setIsOpen(false);
  };

  const handleConfirmPin = () => {
    onPin();
  };

  const handleConfirmDelete = () => {
    onDelete();
  };

  const handleEditClick = () => {
    onEdit();
    setIsOpen(false);
  };

  const handleCancelEditClick = () => {
    onCancelEdit();
    setIsOpen(false);
  };

  // Don't show menu if no options are available
  if (!isOwner && !isPostOwner) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-dark-4 rounded-md transition-colors bg-dark-3/30"
        title="Comment options"
      >
        <span className="text-light-1 text-xl font-bold">⋯</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 bg-dark-2 border border-dark-4 rounded-lg shadow-lg z-[9999] min-w-[180px] lg:min-w-[200px] xl:min-w-[220px]">
          <div className="py-1">
            {isPostOwner && (
              <button
                onClick={handlePinClick}
                className="w-full px-4 py-2 text-left text-sm lg:text-base text-light-1 hover:bg-dark-3 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-sm">📌</span>
                {isPinned ? 'Unpin comment' : 'Pin comment'}
              </button>
            )}
            
            {isOwner && !isEditing && (
              <>
                <button
                  onClick={handleEditClick}
                  className="w-full px-4 py-2 text-left text-sm lg:text-base text-light-1 hover:bg-dark-3 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <img src="/assets/icons/edit.svg" alt="edit" width={14} height={14} className="opacity-70 flex-shrink-0" />
                  Edit comment
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-2 text-left text-sm lg:text-base text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <img src="/assets/icons/delete.svg" alt="delete" width={14} height={14} className="opacity-70 flex-shrink-0" />
                  Delete comment
                </button>
              </>
            )}
            
            {isOwner && isEditing && (
              <button
                onClick={handleCancelEditClick}
                className="w-full px-4 py-2 text-left text-sm lg:text-base text-light-1 hover:bg-dark-3 transition-colors whitespace-nowrap"
              >
                Cancel edit
              </button>
            )}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onConfirm={handleConfirmPin}
        title="Pin Comment"
        message="Are you sure you want to pin this comment? This will unpin any other currently pinned comment on this post."
        confirmText="Pin Comment"
        cancelText="Cancel"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default CommentOptionsMenu;
