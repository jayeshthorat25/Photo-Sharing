import { useState, useCallback, useEffect } from 'react';
import {
  createUserAccount,
  signInAccount,
  getCurrentUser,
  signOutAccount,
  getUsers,
  createPost,
  getPostById,
  getPublicPostById,
  updatePost,
  getUserPosts,
  getPublicUserPosts,
  deletePost,
  likePost,
  getUserById,
  updateUser,
  toggleUserPrivacy,
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
  pinComment,
  forgotPassword,
  resetPassword,
} from '@/lib/services/api';

// Simple hook for making API calls
const useApiCall = (apiFunction, autoFetch = false) => {
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

  // Auto-fetch data when component mounts if autoFetch is true
  useEffect(() => {
    if (autoFetch && apiFunction) {
      callApi();
    }
  }, [autoFetch, callApi]);

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
export const useGetRecentPosts = () => useApiCall(getRecentPosts, true); // Auto-fetch
export const useCreatePost = () => useApiCall(createPost);
export const useGetPostById = (postId) => {
  const apiFunction = useCallback(() => {
    return getPostById(postId);
  }, [postId]);
  return useApiCall(apiFunction, !!postId); // Auto-fetch if postId exists
};

export const useGetPublicPostById = (postId) => {
  const apiFunction = useCallback(() => {
    return getPublicPostById(postId);
  }, [postId]);
  return useApiCall(apiFunction, !!postId); // Auto-fetch if postId exists
};
export const useGetUserPosts = (userId) => {
  const apiFunction = useCallback(() => getUserPosts(userId), [userId]);
  return useApiCall(apiFunction, !!userId); // Auto-fetch if userId exists
};

export const useGetPublicUserPosts = (userId) => {
  const apiFunction = useCallback(() => getPublicUserPosts(userId), [userId]);
  return useApiCall(apiFunction, !!userId); // Auto-fetch if userId exists
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
  return useApiCall(apiFunction, true); // Auto-fetch
};
export const useGetUserById = (userId) => {
  const apiFunction = useCallback(() => getUserById(userId), [userId]);
  return useApiCall(apiFunction, !!userId); // Auto-fetch if userId exists
};
export const useUpdateUser = () => useApiCall(updateUser);
export const useToggleUserPrivacy = () => useApiCall(toggleUserPrivacy);

// ============================================================
// COMMENT QUERIES
// ============================================================

export const useGetComments = (postId) => {
  const apiFunction = useCallback(() => getComments(postId), [postId]);
  return useApiCall(apiFunction, !!postId); // Auto-fetch if postId exists
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
export const usePinComment = () => useApiCall(pinComment);

// Password reset hooks
export const useForgotPassword = () => useApiCall(forgotPassword);
export const useResetPassword = () => useApiCall(resetPassword);
