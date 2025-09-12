import { useState } from 'react';
import {
  createUserAccount,
  signInAccount,
  getCurrentUser,
  signOutAccount,
  getUsers,
  createPost,
  getPostById,
  updatePost,
  getUserPosts,
  deletePost,
  likePost,
  getUserById,
  updateUser,
  getRecentPosts,
  getInfinitePosts,
  searchPosts,
  savePost,
  deleteSavedPost,
  getSavedPosts,
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '@/lib/services/api';

// Simple hook for making API calls
const useApiCall = (apiFunction) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, callApi };
};

// ============================================================
// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => useApiCall(createUserAccount);
export const useSignInAccount = () => useApiCall(signInAccount);
export const useSignOutAccount = () => useApiCall(signOutAccount);

// ============================================================
// POST QUERIES
// ============================================================

export const useGetPosts = () => useApiCall(getInfinitePosts);
export const useSearchPosts = (searchTerm) => useApiCall(() => searchPosts(searchTerm));
export const useGetRecentPosts = () => useApiCall(getRecentPosts);
export const useCreatePost = () => useApiCall(createPost);
export const useGetPostById = (postId) => useApiCall(() => getPostById(postId));
export const useGetUserPosts = (userId) => useApiCall(() => getUserPosts(userId));
export const useUpdatePost = () => useApiCall(updatePost);
export const useDeletePost = () => useApiCall(({ postId, imageId }) => deletePost(postId, imageId));
export const useLikePost = () => useApiCall(({ postId, likesArray }) => likePost(postId, likesArray));
export const useSavePost = () => useApiCall(({ userId, postId }) => savePost(userId, postId));
export const useDeleteSavedPost = () => useApiCall(deleteSavedPost);
export const useGetSavedPosts = () => useApiCall(getSavedPosts);

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => useApiCall(getCurrentUser);
export const useGetUsers = (limit) => useApiCall(() => getUsers(limit));
export const useGetUserById = (userId) => useApiCall(() => getUserById(userId));
export const useUpdateUser = () => useApiCall(updateUser);

// ============================================================
// COMMENT QUERIES
// ============================================================

export const useGetComments = (postId) => useApiCall(() => getComments(postId));
export const useCreateComment = () => useApiCall(({ postId, content }) => createComment(postId, content));
export const useUpdateComment = () => useApiCall(({ commentId, content }) => updateComment(commentId, content));
export const useDeleteComment = () => useApiCall(deleteComment);
