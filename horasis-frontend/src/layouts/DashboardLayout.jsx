// rrd
import { Outlet } from "react-router-dom";

// components
import DashboardHeader from "../components/DashboardHeader";
import DashboardBottomNavbar from "../components/DashboardBottomNavbar";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthProvider";
import ChatPopup from "../components/Chat/ChatPopup";

function DashboardLayout() {
  const { scrollRef } = useContext(AuthContext)
  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "100svh" }}>
      <DashboardHeader />
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <div ref={scrollRef}></div>
        <div className="">
          <Outlet />
        </div>
      </div>
      <ChatPopup userId={'669a235e525967c06f6bfc06'} />
      <DashboardBottomNavbar />
    </div>
  );
}
export default DashboardLayout;
