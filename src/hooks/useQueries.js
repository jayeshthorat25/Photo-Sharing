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

// Simple axios-based hook for API calls
const useAxiosCall = (apiFunction) => {
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

export const useCreateUserAccount = () => useAxiosCall(createUserAccount);
export const useSignInAccount = () => useAxiosCall(signInAccount);
export const useSignOutAccount = () => useAxiosCall(signOutAccount);

// ============================================================
// POST QUERIES
// ============================================================

export const useGetPosts = () => useAxiosCall(getInfinitePosts);
export const useSearchPosts = (searchTerm) => useAxiosCall(() => searchPosts(searchTerm));
export const useGetRecentPosts = () => useAxiosCall(getRecentPosts);
export const useCreatePost = () => useAxiosCall(createPost);
export const useGetPostById = (postId) => useAxiosCall(() => getPostById(postId));
export const useGetUserPosts = (userId) => useAxiosCall(() => getUserPosts(userId));
export const useUpdatePost = () => useAxiosCall(updatePost);
export const useDeletePost = () => useAxiosCall(({ postId, imageId }) => deletePost(postId, imageId));
export const useLikePost = () => useAxiosCall(({ postId, likesArray }) => likePost(postId, likesArray));
export const useSavePost = () => useAxiosCall(({ userId, postId }) => savePost(userId, postId));
export const useDeleteSavedPost = () => useAxiosCall(deleteSavedPost);
export const useGetSavedPosts = () => useAxiosCall(getSavedPosts);

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => useAxiosCall(getCurrentUser);
export const useGetUsers = (limit) => useAxiosCall(() => getUsers(limit));
export const useGetUserById = (userId) => useAxiosCall(() => getUserById(userId));
export const useUpdateUser = () => useAxiosCall(updateUser);

// ============================================================
// COMMENT QUERIES
// ============================================================

export const useGetComments = (postId) => useAxiosCall(() => getComments(postId));
export const useCreateComment = () => useAxiosCall(({ postId, content }) => createComment(postId, content));
export const useUpdateComment = () => useAxiosCall(({ commentId, content }) => updateComment(commentId, content));
export const useDeleteComment = () => useAxiosCall(deleteComment);
