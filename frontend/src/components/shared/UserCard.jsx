import { Link } from "react-router-dom";

import SimpleButton from "../ui/SimpleButton";
import { getImageUrl } from "@/lib/api";

const UserCard = ({ user }) => {
  return (
    <Link to={`/profile/${user.id}`} className="user-card">
      <img
        src={getImageUrl(user.imageUrl) || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <SimpleButton type="button" size="sm" className="px-5">
        Follow
      </SimpleButton>
    </Link>
  );
};

export default UserCard;
