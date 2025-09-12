import { useState } from 'react';
import { Link } from 'react-router-dom';
import { multiFormatDateString } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';
import { useDeleteComment, useUpdateComment } from '@/hooks/useQueries';
import SimpleButton from '@/components/ui/SimpleButton';
// Removed SimpleTextarea import - using simple HTML textarea instead

const Comment = ({ comment, onCommentUpdated }) => {
  const { user } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { callApi: updateComment } = useUpdateComment();
  const { callApi: deleteComment } = useDeleteComment();

  const isOwner = user.id === comment.user.id;

  const handleUpdateComment = async () => {
    if (editContent.trim() && editContent !== comment.content) {
      setIsUpdating(true);
      try {
        await updateComment({ commentId: comment.id, content: editContent.trim() });
        setIsEditing(false);
        onCommentUpdated?.();
        console.log('Comment updated successfully'); // Debug log
      } catch (error) {
        console.error('Error updating comment:', error);
        alert('Failed to update comment. Please try again.');
      } finally {
        setIsUpdating(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleDeleteComment = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true);
      try {
        await deleteComment(comment.id);
        onCommentUpdated?.();
        console.log('Comment deleted successfully'); // Debug log
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-3 p-4 border-b border-dark-4 last:border-b-0 hover:bg-dark-3/50 transition-colors">
      <Link to={`/profile/${comment.user.id}`}>
        <img
          src={comment.user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt={comment.user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      </Link>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Link to={`/profile/${comment.user.id}`}>
            <p className="small-semibold text-light-1">{comment.user.name}</p>
          </Link>
          <p className="tiny-medium text-light-3">
            {multiFormatDateString(comment.created_at)}
          </p>
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[60px] px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Edit your comment..."
            />
            <div className="flex gap-2">
              <SimpleButton
                onClick={handleUpdateComment}
                size="sm"
                className="px-3 py-1"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </SimpleButton>
              <SimpleButton
                onClick={handleCancelEdit}
                variant="outline"
                size="sm"
                className="px-3 py-1"
                disabled={isUpdating}
              >
                Cancel
              </SimpleButton>
            </div>
          </div>
        ) : (
          <div>
            <p className="small-regular text-light-1 mb-2">{comment.content}</p>
            
            {isOwner && (
              <div className="flex gap-3">
                <SimpleButton
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-light-3 hover:text-light-1"
                  disabled={isDeleting}
                >
                  Edit
                </SimpleButton>
                <SimpleButton
                  onClick={handleDeleteComment}
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-red hover:text-red/80"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </SimpleButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
