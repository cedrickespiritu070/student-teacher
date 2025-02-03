import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen max-w-[100vw]">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 p-5 bg-gray-100 w-[80%] max-h-[100vh] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
