import { createContext, useContext, useEffect, useState } from 'react';
import { useGetSavedPosts } from '@/hooks/useQueries';

const SavedPostsContext = createContext();

export const SavedPostsProvider = ({ children }) => {
  const { data: savedPosts, callApi: fetchSavedPosts } = useGetSavedPosts();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch saved posts once when the provider mounts
  useEffect(() => {
    const loadSavedPosts = async () => {
      setIsLoading(true);
      try {
        await fetchSavedPosts();
      } catch (error) {
        console.error('Error loading saved posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPosts();
  }, []); // Empty dependency array - only run once

  const refreshSavedPosts = async () => {
    try {
      await fetchSavedPosts();
    } catch (error) {
      console.error('Error refreshing saved posts:', error);
    }
  };

  const value = {
    savedPosts,
    isLoading,
    refreshSavedPosts,
  };

  return (
    <SavedPostsContext.Provider value={value}>
      {children}
    </SavedPostsContext.Provider>
  );
};

export const useSavedPosts = () => {
  const context = useContext(SavedPostsContext);
  if (!context) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
};
