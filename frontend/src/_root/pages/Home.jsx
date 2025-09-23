import Loader from "@/components/Loader";
import PostCard from "@/components/PostCard";
import { useGetRecentPosts } from "@/hooks/useQueries";

const Home = () => {

  const {
    data: posts,
    isLoading: isPostLoading,
    error: isErrorPosts,
    callApi: fetchPosts,
  } = useGetRecentPosts();

  // Posts will be auto-fetched by the hook

  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents && Array.isArray(posts.documents) && posts.documents.map((post) => (
                <li key={post.id} className="flex justify-center w-full">
                  <PostCard post={post} onPostDeleted={fetchPosts} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
