import { useState } from 'react';
import { Link } from 'react-router-dom';
import { multiFormatDateString } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';
import { useDeleteComment, useUpdateComment, usePinComment } from '@/hooks/useQueries';
import SimpleButton from '@/components/ui/SimpleButton';
import CommentOptionsMenu from '@/components/ui/CommentOptionsMenu';

const Comment = ({ comment, post, onCommentUpdated }) => {
  const { user } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { callApi: updateComment } = useUpdateComment();
  const { callApi: deleteComment } = useDeleteComment();
  const { callApi: pinComment } = usePinComment();

  // Safety check for user object
  if (!user || !user.id) {
    return null;
  }

  const isOwner = String(user.id) === String(comment.user.id);
  const isPostOwner = String(user.id) === String(post?.user?.id);

  const handleUpdateComment = async () => {
    if (editContent.trim() && editContent !== comment.content) {
      setIsUpdating(true);
      try {
        await updateComment({ commentId: comment.id, content: editContent.trim() });
        setIsEditing(false);
        onCommentUpdated?.();
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
    setIsDeleting(true);
    try {
      await deleteComment(comment.id);
      onCommentUpdated?.();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handlePinComment = async () => {
    try {
      await pinComment(comment.id);
      onCommentUpdated?.();
    } catch (error) {
      console.error('Error pinning comment:', error);
      alert('Failed to pin/unpin comment. Please try again.');
    }
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
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${comment.user.id}`}>
              <p className={`base-semibold ${isOwner ? 'text-primary-500' : 'text-light-1'}`}>
                {comment.user.name}
              </p>
            </Link>
            <p className="small-medium text-light-3">
              {multiFormatDateString(comment.created_at)}
            </p>
            {comment.pinned && (
              <span className="small-medium text-primary-500 font-semibold">
                📌 Pinned
              </span>
            )}
            {comment.is_edited && (
              <span className="small-medium text-light-4 italic">
                (edited)
              </span>
            )}
          </div>
          
          <CommentOptionsMenu
            isOwner={isOwner}
            isPostOwner={isPostOwner}
            isPinned={comment.pinned}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDeleteComment}
            onPin={handlePinComment}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[80px] px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500 custom-scrollbar resize-none base-regular"
              placeholder="Edit your comment..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateComment}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed base-medium transition-colors"
                disabled={isUpdating || !editContent.trim()}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed base-medium transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="base-regular text-light-1">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default Comment;
