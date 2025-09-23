import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { sidebarLinks } from "@/constants";
import Loader from "@/components/Loader";
import SimpleButton from "@/components/SimpleButton";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useSignOutAccount } from "@/hooks/useQueries";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { callApi: signOut } = useSignOutAccount();

  const handleSignOut = async (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/");
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/home" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        {isLoading || !user.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-sidebar-3"
                }`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center px-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`w-5 h-5 group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <SimpleButton
        variant="ghost"
        className="custom-button-ghost w-full h-12 justify-start gap-4 px-4"
        onClick={(e) => handleSignOut(e)}>
        <img src="/assets/icons/logout.svg" alt="logout" className="w-5 h-5" />
        <p className="small-medium lg:base-medium">Logout</p>
      </SimpleButton>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
      />
    </nav>
  );
};

export default LeftSidebar;
