import { Link } from "react-router-dom";

import SimpleButton from "../ui/SimpleButton";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/hooks/useQueries";

const Topbar = () => {
  const { user } = useUserContext();
  const { callApi: signOut } = useSignOutAccount();

  // Note: Sign out will be handled by the auth context

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/home" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <SimpleButton
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </SimpleButton>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
