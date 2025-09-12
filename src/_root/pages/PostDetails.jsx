import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import SimpleButton from "@/components/ui/SimpleButton";
import { Loader } from "@/components/shared";
import { GridPostList, PostStats, CommentSection } from "@/components/shared";

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

  console.log('PostDetails - postId:', id); // Debug log

  const { data: post, isLoading, error } = useGetPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.user?.id
  );

  console.log('PostDetails - user ID:', post?.user?.id, 'userPosts:', userPosts); // Debug log
  const { callApi: deletePost } = useDeletePost();

  console.log('PostDetails - post:', post, 'isLoading:', isLoading, 'error:', error); // Debug log
  console.log('PostDetails - post structure:', post ? Object.keys(post) : 'No post data'); // Debug log
  console.log('PostDetails - post.user:', post?.user); // Debug log
  console.log('PostDetails - post.imageUrl:', post?.imageUrl); // Debug log
  console.log('PostDetails - post.tags:', post?.tags, 'type:', typeof post?.tags); // Debug log

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.id !== id
  );

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <SimpleButton
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
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
      ) : (
        <div className="post_details-card">
          <img
            src={getImageUrl(post?.imageUrl) || "/assets/icons/profile-placeholder.svg"}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.user?.id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    getImageUrl(post?.user?.imageUrl) ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.user?.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.created_at)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.id}`}
                  className={`${user.id !== post?.user?.id && "hidden"}`}>
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <SimpleButton
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`post_details-delete_btn ${
                    user.id !== post?.user?.id && "hidden"
                  }`}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </SimpleButton>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags && Array.isArray(post.tags) && post.tags.map((tag, index) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
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
        <CommentSection postId={post.id} />
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
