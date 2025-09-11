import { api, setAuthToken } from '../api';

// ============================================================
// AUTH SERVICES
// ============================================================

export const createUserAccount = async (user) => {
  try {
    const response = await api.post('/api/auth/signup/', user);
    return response.data;
  } catch (error) {
    console.error('Error creating user account:', error);
    throw error;
  }
};

export const signInAccount = async (user) => {
  try {
    const response = await api.post('/api/auth/login/', {
      username: user.email,
      password: user.password,
    });
    
    const { access } = response.data;
    setAuthToken(access);
    
    return response.data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOutAccount = async () => {
  try {
    setAuthToken();
    return { status: 'success' };
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me/');
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

export const getUsers = async (limit) => {
  try {
    const params = limit ? { limit } : {};
    const response = await api.get('/api/auth/users/', { params });
    return { documents: response.data };
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/auth/users/${userId}/`);
    return response.data;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('bio', user.bio);
    
    if (user.file && user.file.length > 0) {
      formData.append('image', user.file[0]);
    }

    const response = await api.patch('/api/auth/me/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// ============================================================
// POST SERVICES
// ============================================================

export const createPost = async (post) => {
  try {
    const formData = new FormData();
    formData.append('caption', post.caption);
    
    if (post.file && post.file.length > 0) {
      formData.append('image', post.file[0]);
    }
    
    if (post.location) {
      formData.append('location', post.location);
    }
    
    if (post.tags) {
      formData.append('tags', post.tags);
    }

    const response = await api.post('/api/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getRecentPosts = async () => {
  try {
    const response = await api.get('/api/posts/recent/');
    return { documents: response.data };
  } catch (error) {
    console.error('Error getting recent posts:', error);
    throw error;
  }
};

export const getInfinitePosts = async ({ pageParam = 0 }) => {
  try {
    const response = await api.get('/api/posts/', {
      params: { offset: pageParam }
    });
    return { documents: response.data };
  } catch (error) {
    console.error('Error getting infinite posts:', error);
    throw error;
  }
};

export const searchPosts = async (searchTerm) => {
  try {
    const response = await api.get('/api/posts/search/', {
      params: { q: searchTerm }
    });
    return { documents: response.data };
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    if (!postId) throw new Error('Post ID is required');
    const response = await api.get(`/api/posts/${postId}/`);
    return response.data;
  } catch (error) {
    console.error('Error getting post by ID:', error);
    throw error;
  }
};

export const updatePost = async (post) => {
  try {
    const formData = new FormData();
    formData.append('caption', post.caption);
    
    if (post.file && post.file.length > 0) {
      formData.append('image', post.file[0]);
    }
    
    if (post.location) {
      formData.append('location', post.location);
    }
    
    if (post.tags) {
      formData.append('tags', post.tags);
    }

    const response = await api.patch(`/api/posts/${post.postId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId, _imageId) => {
  try {
    if (!postId) throw new Error('Post ID is required');
    const response = await api.delete(`/api/posts/${postId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const likePost = async (postId, likesArray) => {
  try {
    const response = await api.post(`/api/posts/${postId}/like/`, {
      likes: likesArray
    });
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    const response = await api.get(`/api/users/${userId}/posts/`);
    return { documents: response.data };
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error;
  }
};

// ============================================================
// SAVE SERVICES
// ============================================================

export const savePost = async (userId, postId) => {
  try {
    const response = await api.post('/api/saves/', {
      post: postId
    });
    return response.data;
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
};

export const deleteSavedPost = async (savedRecordId) => {
  try {
    const response = await api.delete(`/api/saves/${savedRecordId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting saved post:', error);
    throw error;
  }
};

// ============================================================
// COMMENT SERVICES
// ============================================================

export const getComments = async (postId) => {
  try {
    const response = await api.get(`/api/posts/${postId}/comments/`);
    return response.data;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

export const createComment = async (postId, content) => {
  try {
    const response = await api.post(`/api/posts/${postId}/comments/`, {
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const updateComment = async (commentId, content) => {
  try {
    const response = await api.patch(`/api/comments/${commentId}/`, {
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/api/comments/${commentId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
