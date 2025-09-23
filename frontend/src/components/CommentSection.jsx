import { useState } from 'react';
import { useUserContext } from '@/context/AuthContext';
import { useGetComments, useCreateComment } from '@/hooks/useQueries';
import Comment from './Comment';
import SimpleButton from '@/components/SimpleButton';
import Loader from '@/components/Loader';

const CommentSection = ({ postId, post }) => {
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
              className="w-full min-h-[80px] px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg text-light-1 placeholder-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500 custom-scrollbar resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="bg-dark-2 rounded-lg border border-dark-4 overflow-visible">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              post={post}
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
