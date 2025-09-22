import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import SimpleButton from "@/components/ui/SimpleButton";
import { Loader, PrivacyMessage } from "@/components/shared";
import { GridPostList, PostStats, CommentSection } from "@/components/shared";
import PostOptionsMenu from "@/components/ui/PostOptionsMenu";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

import {
  useGetPostById,
  useGetUserPosts,
  useDeletePost,
} from "@/hooks/useQueries";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/api";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: post, isLoading, error } = useGetPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.user?.id
  );

  const { callApi: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.id !== id
  );

  const handleDeletePost = async () => {
    // Double-check ownership before allowing deletion
    if (String(user?.id) !== String(post?.user?.id)) {
      alert('You can only delete your own posts.');
      return;
    }

    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost({ postId: id, imageId: post?.imageId });
      navigate(-1);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <SimpleButton
          onClick={() => navigate(-1)}
          variant="ghost"
          className="custom-button-ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </SimpleButton>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="flex-center w-full h-full">
          <div className="text-center">
            <p className="text-light-1 mb-4">Error loading post: {error.message}</p>
            <SimpleButton onClick={() => navigate(-1)}>
              Go Back
            </SimpleButton>
          </div>
        </div>
      ) : !post ? (
        <div className="flex-center w-full h-full">
          <div className="text-center">
            <p className="text-light-1 mb-4">Post not found</p>
            <SimpleButton onClick={() => navigate(-1)}>
              Go Back
            </SimpleButton>
          </div>
        </div>
      ) : post.is_private && String(user?.id) !== String(post?.user?.id) ? (
        <PrivacyMessage 
          type="post" 
          isOwner={false}
        />
      ) : (
        <div className="post_details-card">
          <img
            src={getImageUrl(post?.imageUrl) || "/assets/icons/profile-placeholder.svg"}
            alt="creator"
            className="post_details-img"
            style={{ height: 'auto' }}
          />

          <div className="post_details-info">
            <div className="flex-between w-full items-start">
              <Link
                to={`/profile/${post?.user?.id}`}
                className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={
                    getImageUrl(post?.user?.imageUrl) ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full flex-shrink-0"
                />
                <div className="flex gap-1 flex-col min-w-0 flex-1">
                  <p className="base-medium lg:body-bold text-light-1 truncate">
                    {post?.user?.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3 flex-wrap">
                    <p className="subtle-semibold lg:small-regular whitespace-nowrap">
                      {multiFormatDateString(post?.created_at)}
                    </p>
                    <span className="text-light-3">•</span>
                    <p className="subtle-semibold lg:small-regular truncate">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4 flex-shrink-0 ml-4">
                <PostOptionsMenu
                  isOwner={String(user.id) === String(post?.user?.id)}
                  postId={post?.id}
                  onDelete={handleDeletePost}
                />
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>
                {post?.caption}
                {post?.is_edited && <span className="tiny-medium text-light-4 italic ml-2">(edited)</span>}
              </p>
              <ul className="flex gap-1 mt-2">
                {post?.tags && (
                  <li className="text-light-3 small-regular">
                    #{post.tags}
                  </li>
                )}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {post && (
        <CommentSection postId={post.id} post={post} />
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          Other posts by {post?.user?.name}
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : relatedPosts.length > 0 ? (
          <div className="grid-container">
            {relatedPosts.slice(0, 3).map((relatedPost) => (
              <div key={relatedPost.id} className="relative min-w-80 aspect-square">
                <Link 
                  to={`/posts/${relatedPost.id}`} 
                  className="grid-post_link"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <img
                    src={getImageUrl(relatedPost.imageUrl)}
                    alt="post"
                    className="h-full w-full object-cover object-center"
                  />
                </Link>
                <div className="grid-post_user">
                  <div className="flex items-center justify-start gap-2 flex-1">
                    <img
                      src={
                        getImageUrl(relatedPost.user.imageUrl) ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt="creator"
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="line-clamp-1">{relatedPost.user.name}</p>
                  </div>
                  <PostStats post={relatedPost} userId={user.id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-light-3 text-center py-8">No other posts by this user.</p>
        )}
      </div>

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

export default PostDetails;
