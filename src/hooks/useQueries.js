import { useState, useCallback } from 'react';
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

  const callApi = useCallback(async (...args) => {
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
  }, [apiFunction]);

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
export const useSearchPosts = (searchTerm) => {
  const apiFunction = useCallback(() => searchPosts(searchTerm), [searchTerm]);
  return useApiCall(apiFunction);
};
export const useGetRecentPosts = () => useApiCall(getRecentPosts);
export const useCreatePost = () => useApiCall(createPost);
export const useGetPostById = (postId) => {
  const apiFunction = useCallback(() => getPostById(postId), [postId]);
  return useApiCall(apiFunction);
};
export const useGetUserPosts = (userId) => {
  const apiFunction = useCallback(() => getUserPosts(userId), [userId]);
  return useApiCall(apiFunction);
};
export const useUpdatePost = () => useApiCall(updatePost);
export const useDeletePost = () => {
  const apiFunction = useCallback(({ postId, imageId }) => deletePost(postId, imageId), []);
  return useApiCall(apiFunction);
};
export const useLikePost = () => {
  const apiFunction = useCallback(({ postId, likesArray }) => likePost(postId, likesArray), []);
  return useApiCall(apiFunction);
};
export const useSavePost = () => {
  const apiFunction = useCallback(({ userId, postId }) => savePost(userId, postId), []);
  return useApiCall(apiFunction);
};
export const useDeleteSavedPost = () => useApiCall(deleteSavedPost);
export const useGetSavedPosts = () => useApiCall(getSavedPosts);

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => useApiCall(getCurrentUser);
export const useGetUsers = (limit) => {
  const apiFunction = useCallback(() => getUsers(limit), [limit]);
  return useApiCall(apiFunction);
};
export const useGetUserById = (userId) => {
  const apiFunction = useCallback(() => getUserById(userId), [userId]);
  return useApiCall(apiFunction);
};
export const useUpdateUser = () => useApiCall(updateUser);

// ============================================================
// COMMENT QUERIES
// ============================================================

export const useGetComments = (postId) => {
  const apiFunction = useCallback(() => getComments(postId), [postId]);
  return useApiCall(apiFunction);
};
export const useCreateComment = () => {
  const apiFunction = useCallback(({ postId, content }) => createComment(postId, content), []);
  return useApiCall(apiFunction);
};
export const useUpdateComment = () => {
  const apiFunction = useCallback(({ commentId, content }) => updateComment(commentId, content), []);
  return useApiCall(apiFunction);
};
export const useDeleteComment = () => useApiCall(deleteComment);
