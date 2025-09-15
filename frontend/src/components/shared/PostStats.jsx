import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
} from "@/hooks/useQueries";
import { useSavedPosts } from "@/context/SavedPostsContext";

const PostStats = ({ post, userId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Initialize likes based on is_liked status and likes_count
  const initialLikes = post.is_liked ? [userId] : [];
  const [likes, setLikes] = useState(initialLikes);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [isSaved, setIsSaved] = useState(false);

  const { callApi: likePost } = useLikePost();
  const { callApi: savePost } = useSavePost();
  const { callApi: deleteSavePost } = useDeleteSavedPost();
  const { savedPosts, refreshSavedPosts } = useSavedPosts();

  // Find if this post is saved
  const savedPostRecord = savedPosts?.documents?.find(
    (record) => record.post?.id === post.id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [savedPostRecord]);

  const handleLikePost = async (e) => {
    e.stopPropagation();

    try {
      const result = await likePost({ postId: post.id, likesArray: [] });
      
      // Update local state based on the response
      // The API might return different field names, let's check for common ones
      const isLiked = result.liked || result.is_liked || result.like_status;
      const newLikeCount = result.likes_count || result.like_count || result.count;
      
      if (isLiked) {
        setLikes(prevLikes => [...prevLikes, userId]);
        setLikeCount(prevCount => newLikeCount || prevCount + 1);
      } else {
        setLikes(prevLikes => prevLikes.filter((id) => id !== userId));
        setLikeCount(prevCount => newLikeCount || Math.max(0, prevCount - 1));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSavePost = async (e) => {
    e.stopPropagation();

    try {
      if (savedPostRecord) {
        await deleteSavePost(savedPostRecord.id);
        setIsSaved(false);
      } else {
        await savePost({ userId: userId, postId: post.id });
        setIsSaved(true);
      }
      // Refresh saved posts list
      refreshSavedPosts();
    } catch (error) {
      console.error('Error saving/deleting post:', error);
    }
  };

  const handleCommentsClick = (e) => {
    e.stopPropagation();
    navigate(`/posts/${post.id}#comments`);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      {/* Like Button */}
      <div className="flex gap-2">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likeCount}</p>
      </div>

      {/* Comments Button - Centered */}
      <div className="flex gap-2">
        <img
          src="/assets/icons/chat.svg"
          alt="comments"
          width={20}
          height={20}
          onClick={(e) => handleCommentsClick(e)}
          className="cursor-pointer invert-white"
        />
        <p className="small-medium lg:base-medium">{post.comments_count || 0}</p>
      </div>

      {/* Save Button */}
      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="save"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
};

export default PostStats;
