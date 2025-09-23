import { Outlet } from "react-router-dom";

import Topbar from "@/components/Topbar";
import Bottombar from "@/components/Bottombar";
import LeftSidebar from "@/components/LeftSidebar";

const RootLayout = () => {
  return (
    <main className="flex h-screen">
      <div className="w-full md:flex">
        <Topbar />
        <LeftSidebar />

        <section className="flex flex-1 h-full">
          <Outlet />
        </section>

        <Bottombar />
      </div>
    </main>
  );
};

export default RootLayout;
