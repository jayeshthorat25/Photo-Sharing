import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetSavedPosts,
} from "@/hooks/useQueries";

const PostStats = ({ post, userId }) => {
  const location = useLocation();
  // Initialize likes based on is_liked status and likes_count
  const initialLikes = post.is_liked ? [userId] : [];
  const [likes, setLikes] = useState(initialLikes);
  const [isSaved, setIsSaved] = useState(false);

  const { callApi: likePost } = useLikePost();
  const { callApi: savePost } = useSavePost();
  const { callApi: deleteSavePost } = useDeleteSavedPost();
  const { data: savedPosts, callApi: fetchSavedPosts } = useGetSavedPosts();

  const savedPostRecord = savedPosts?.documents?.find(
    (record) => record.post?.id === post.id
  );

  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [savedPostRecord]);

  const handleLikePost = async (e) => {
    e.stopPropagation();

    try {
      const result = await likePost({ postId: post.id, likesArray: [] });
      // Update local state based on the response
      if (result.liked) {
        setLikes([...likes, userId]);
      } else {
        setLikes(likes.filter((id) => id !== userId));
      }
      // Update the post's likes_count in the parent component
      // This would require a callback from the parent, but for now we'll just update local state
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
      fetchSavedPosts();
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
        <p className="small-medium lg:base-medium">{post.likes_count || likes.length}</p>
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
