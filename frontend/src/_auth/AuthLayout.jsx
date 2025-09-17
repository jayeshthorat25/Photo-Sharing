import { Outlet, Navigate, useLocation } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useUserContext();
  const location = useLocation();

  // Allow access to reset password page even if authenticated
  const isResetPasswordPage = location.pathname.startsWith('/reset-password/');

  return (
    <>
      {isAuthenticated && !isResetPasswordPage ? (
        <Navigate to="/saved" />
      ) : (
        <main className="flex h-screen">
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/side-img.svg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </main>
      )}
    </>
  );
}
