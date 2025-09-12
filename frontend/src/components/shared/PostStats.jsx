import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
} from "@/hooks/useQueries";
import { useSavedPosts } from "@/context/SavedPostsContext";

const PostStats = ({ post, userId }) => {
  const location = useLocation();
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
      console.log('Liking post:', post.id, 'Current like count:', likeCount); // Debug log
      const result = await likePost({ postId: post.id, likesArray: [] });
      console.log('Like result:', result); // Debug log
      
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
      
      console.log('Updated like count:', newLikeCount || (isLiked ? likeCount + 1 : Math.max(0, likeCount - 1))); // Debug log
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

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
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

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
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
