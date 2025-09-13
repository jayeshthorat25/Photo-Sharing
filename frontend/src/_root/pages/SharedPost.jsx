import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import SimpleButton from "@/components/ui/SimpleButton";
import { Loader } from "@/components/shared";
import { GridPostList, PostStats, CommentSection, LeftSidebar } from "@/components/shared";
import PostOptionsMenu from "@/components/ui/PostOptionsMenu";
import LoginModal from "@/components/ui/LoginModal";

import {
  useGetPublicPostById,
  useGetPublicUserPosts,
} from "@/hooks/useQueries";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/api";

const SharedPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useUserContext();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data: post, isLoading, error } = useGetPublicPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetPublicUserPosts(
    post?.user?.id
  );

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.id !== id
  );

  const handleLoginRedirect = () => {
    navigate("/sign-in");
  };

  const handleSignupRedirect = () => {
    navigate("/sign-up");
  };

  const handleActionRequiringAuth = (action) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    action();
  };

  if (isAuthenticated) {
    // For authenticated users, use the same layout as other pages
    return (
      <main className="flex h-screen">
        <div className="w-full md:flex">
          <LeftSidebar />
          
          <section className="flex flex-1 h-full">
            <div className="post_details-container w-full">
              <div className="hidden md:flex max-w-5xl w-full">
                <SimpleButton
                  onClick={() => navigate("/")}
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
                    <SimpleButton onClick={() => navigate("/")}>
                      Go to Home
                    </SimpleButton>
                  </div>
                </div>
              ) : !post ? (
                <div className="flex-center w-full h-full">
                  <div className="text-center">
                    <h2 className="h2-bold text-light-1 mb-4">Post Not Found</h2>
                    <p className="text-light-3 mb-6">The post you're looking for doesn't exist or has been removed.</p>
                    <SimpleButton onClick={() => navigate("/")}>
                      Go to Home
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
                          isOwner={String(user?.id) === String(post?.user?.id)}
                          postId={post?.id}
                          onDelete={() => {}}
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
                      <PostStats post={post} userId={user?.id} />
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              {post && (
                <CommentSection postId={post.id} post={post} />
              )}

              {/* Related Posts */}
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
          </section>
        </div>
      </main>
    );
  }

  // For guest users, use simple layout
  return (
    <div className="post_details-container">
      {/* Mobile header for guest users */}
      <div className="md:hidden flex justify-center items-center py-4 border-b border-dark-4">
        <SimpleButton
          onClick={() => navigate("/")}
          variant="ghost"
          className="custom-button-ghost">
          <img
            src={"/assets/images/logo.svg"}
            alt="SnapGram"
            width={100}
            height={32}
            className="object-contain"
          />
        </SimpleButton>
      </div>
      
      <div className="hidden md:flex max-w-5xl w-full">
        <SimpleButton
          onClick={() => navigate("/")}
          variant="ghost"
          className="custom-button-ghost">
          <img
            src={"/assets/images/logo.svg"}
            alt="SnapGram"
            width={120}
            height={40}
            className="object-contain"
          />
        </SimpleButton>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="flex-center w-full h-full">
          <div className="text-center">
            <p className="text-light-1 mb-4">Error loading post: {error.message}</p>
            <SimpleButton onClick={() => navigate("/")}>
              Go to Home
            </SimpleButton>
          </div>
        </div>
      ) : !post ? (
        <div className="flex-center w-full h-full">
          <div className="text-center">
            <h2 className="h2-bold text-light-1 mb-4">Post Not Found</h2>
            <p className="text-light-3 mb-6">The post you're looking for doesn't exist or has been removed.</p>
            <SimpleButton onClick={() => navigate("/")}>
              Go to Home
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
            <div className="flex-between w-full items-start">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLoginModal(true);
                }}
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
                  isOwner={false}
                  postId={post?.id}
                  onDelete={() => {}}
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
              <div className="flex justify-between items-center z-20">
                <div className="flex gap-2 mr-5">
                  <img
                    src="/assets/icons/like.svg"
                    alt="like"
                    width={20}
                    height={20}
                    onClick={() => setShowLoginModal(true)}
                    className="cursor-pointer opacity-50"
                  />
                  <p className="small-medium lg:base-medium">{post?.likes_count || 0}</p>
                </div>
                <div className="flex gap-2">
                  <img
                    src="/assets/icons/save.svg"
                    alt="save"
                    width={20}
                    height={20}
                    className="cursor-pointer opacity-50"
                    onClick={() => setShowLoginModal(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {post && (
        <div className="w-full max-w-5xl">
          <hr className="border w-full border-dark-4/80 mb-6" />
          
          <h3 className="body-bold md:h3-bold mb-6">
            Comments ({post?.comments_count || 0})
          </h3>

          <div className="bg-dark-2 rounded-lg border border-dark-4 p-8 text-center">
            <p className="text-light-3 mb-4">
              You need to be logged in to view and add comments.
            </p>
            <div className="flex gap-3 justify-center">
              <SimpleButton
                onClick={handleLoginRedirect}
                className="px-6 py-2"
              >
                Sign In
              </SimpleButton>
              <SimpleButton
                onClick={handleSignupRedirect}
                variant="outline"
                className="px-6 py-2"
              >
                Sign Up
              </SimpleButton>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        message="You need to be logged in to interact with posts, view profiles, and add comments. Sign in to your account or create a new one to continue."
      />
    </div>
  );
};

export default SharedPost;
