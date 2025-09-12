import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';
import { useGetComments, useCreateComment } from '@/hooks/useQueries';
import Comment from './Comment';
import SimpleButton from '@/components/ui/SimpleButton';
// Removed SimpleTextarea import - using simple HTML textarea instead
import { Loader } from './index';

const CommentSection = ({ postId }) => {
  const { user } = useUserContext();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: comments, isLoading, callApi: fetchComments } = useGetComments(postId);
  const { callApi: createComment } = useCreateComment();

  // Comments will be auto-fetched by the useGetComments hook

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createComment({ postId, content: newComment.trim() });
      setNewComment('');
      // Refresh comments
      await fetchComments();
      console.log('Comment created successfully'); // Debug log
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to create comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentUpdated = async () => {
    // Refresh comments when a comment is updated or deleted
    await fetchComments();
  };

  console.log('CommentSection - postId:', postId, 'comments:', comments, 'isLoading:', isLoading); // Debug log
  console.log('CommentSection - comments type:', typeof comments, 'isArray:', Array.isArray(comments)); // Debug log
  console.log('CommentSection - comments length:', comments?.length); // Debug log

  if (isLoading) {
    return (
      <div className="flex-center py-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <hr className="border w-full border-dark-4/80 mb-6" />
      
      <h3 className="body-bold md:h3-bold mb-6">
        Comments ({comments?.length || 0})
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6 bg-dark-2 rounded-lg border border-dark-4 p-4">
        <div className="flex gap-3">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full min-h-[60px] px-3 py-2 bg-dark-4 border border-dark-4 rounded-md text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex justify-end mt-2">
              <SimpleButton
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
                className="px-4"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </SimpleButton>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="bg-dark-2 rounded-lg border border-dark-4 overflow-hidden">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onCommentUpdated={handleCommentUpdated}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-light-3">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
