import { useState, useEffect, useCallback } from "react";
import Loader from "@/components/Loader";
import PostCard from "@/components/PostCard";
import { getInfinitePosts } from "@/lib/api";

/**
 * Home Page Component - Main Feed
 * 
 * This is the main social media feed where users see posts from other users.
 * Features:
 * - Displays posts in chronological order (newest first)
 * - Load More button for pagination (10 posts per page)
 * - Real-time post updates when posts are deleted
 * - Error handling with retry functionality
 */
const Home = () => {
  // State management for posts and loading states
  const [posts, setPosts] = useState([]);           // Array of post objects
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Load more button state
  const [hasMore, setHasMore] = useState(true);     // Whether more posts are available
  const [nextPage, setNextPage] = useState(1);      // Next page number for pagination
  const [error, setError] = useState(null);         // Error state for failed requests

  /**
   * Fetches posts from the API with pagination support
   * @param {number} page - Page number to fetch (default: 1)
   * @param {boolean} isLoadMore - Whether this is loading more posts (append vs replace)
   */
  const fetchPosts = useCallback(async (page = 1, isLoadMore = false) => {
    try {
      // Set appropriate loading state based on whether we're loading more or initial load
      if (isLoadMore) {
        setIsLoadingMore(true);  // Show loading on "Load More" button
      } else {
        setIsLoading(true);      // Show main loading spinner
      }
      setError(null);
      
      // Call API to get posts for the specified page
      const response = await getInfinitePosts({ pageParam: page });
      const newPosts = response.documents || [];
      
      // Update posts array - either append (load more) or replace (initial load)
      if (isLoadMore) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]); // Append new posts
      } else {
        setPosts(newPosts); // Replace all posts (initial load)
      }
      
      // Update pagination state
      setHasMore(response.hasMore);                    // Whether more posts are available
      setNextPage(response.nextPage || page + 1);     // Next page number
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err);
    } finally {
      // Always reset loading states
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Load initial posts when component mounts
  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  /**
   * Loads more posts when "Load More" button is clicked
   * Only triggers if not already loading and more posts are available
   */
  const loadMorePosts = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchPosts(nextPage, true); // Load next page and append to existing posts
    }
  }, [fetchPosts, nextPage, isLoadingMore, hasMore]);

  /**
   * Handles post deletion by refreshing the entire feed
   * Called when a post is deleted to ensure UI stays in sync
   */
  const handlePostDeleted = useCallback(() => {
    fetchPosts(1, false); // Reload from page 1 to get updated post list
  }, [fetchPosts]);

  if (error) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
          <button 
            onClick={() => fetchPosts(1, false)}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <ul className="flex flex-col flex-1 gap-9 w-full">
                {posts.map((post) => (
                  <li key={post.id} className="flex justify-center w-full">
                    <PostCard post={post} onPostDeleted={handlePostDeleted} />
                  </li>
                ))}
              </ul>
              
              {hasMore && (
                <div className="flex justify-center py-8">
                  <button 
                    onClick={loadMorePosts}
                    disabled={isLoadingMore}
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? "Loading..." : "Load More Posts"}
                  </button>
                </div>
              )}
              
              {!hasMore && posts.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-light-3 body-medium">You've reached the end of the feed!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
