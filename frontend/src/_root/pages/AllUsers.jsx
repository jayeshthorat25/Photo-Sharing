import { useToast } from "@/components/SimpleToast";
import Loader from "@/components/Loader";
import UserCard from "@/components/UserCard";
import { useGetUsers } from "@/hooks/useQueries";

/**
 * All Users Page Component - People Discovery
 * 
 * This page displays all users in the system for discovery and networking.
 * Features:
 * - Shows all users without pagination limits
 * - User cards with profile information
 * - Follow/unfollow functionality
 * - Error handling with toast notifications
 */
const AllUsers = () => {
  const { toast } = useToast();

  // Fetch all users from the API (no limit = shows all users)
  const { data: creators, isLoading, error: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">Other Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator) => (
              <li key={creator?.id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
