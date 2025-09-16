import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/api";
import { useDeletePost } from "@/hooks/useQueries";
import PostOptionsMenu from "@/components/ui/PostOptionsMenu";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const PostCard = ({ post, onPostDeleted }) => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { callApi: deletePost } = useDeletePost();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!post.user) return;

  const handleDeletePost = async (e) => {
    // Prevent navigation to post details if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Double-check ownership before allowing deletion
    if (String(user?.id) !== String(post?.user?.id)) {
      alert('You can only delete your own posts.');
      return;
    }
    
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost({ postId: post.id, imageId: post?.imageId });
      // Refresh the posts list if callback is provided
      if (onPostDeleted) {
        onPostDeleted();
      } else {
        // Fallback to page reload if no callback provided
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.user.id}`}>
            <img
              src={
                getImageUrl(post.user?.imageUrl) ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="base-medium lg:body-bold text-light-1">
                {post.user.name}
              </p>
              {post.is_private && (
                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                  Private
                </span>
              )}
            </div>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.created_at)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <PostOptionsMenu
          isOwner={String(user.id) === String(post.user.id)}
          postId={post.id}
          onDelete={handleDeletePost}
        />
      </div>

      <Link to={`/posts/${post.id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>
            {post.caption}
            {post.is_edited && <span className="tiny-medium text-light-4 italic ml-2">(edited)</span>}
          </p>
          <ul className="flex gap-1 mt-2">
            {post.tags && (
              <li className="text-light-3 small-regular">
                {post.tags}
              </li>
            )}
          </ul>
        </div>

        <img
          src={getImageUrl(post.imageUrl) || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} userId={user.id} />

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

export default PostCard;
