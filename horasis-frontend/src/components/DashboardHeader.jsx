import { useContext } from "react";
import { AuthContext } from "../utils/AuthProvider";
import Logo from "./Common/Logo";
import ChatList from "./Chat/ChatList";
import AlertList from "./Alert/AlertList";
import { useNavigate } from "react-router-dom";

const logoText = {
  fontSize: "1.7rem",
  fontWeight: "700",
  margin: 0,
  marginLeft: "10px",
};
const headerWrapper = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0px",
};
const branding = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const postJobButton = { fontWeight: 600, border: "2px solid " };
const completeProfileButton = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontWeight: 600,
  fontSize: "16px",
};

const DashboardHeader = () => {

  const { logout, currentUserData, scrollToTop } = useContext(AuthContext)
  const navigate = useNavigate()
  const OnClickItem = (path) => {
    scrollToTop()
    navigate(path)
  }
  return (
    <div className="bg-system-secondary-bg py-3 px-5 lg:px-10 shadow border-b border-system-file-border">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl font-bold text-brand-violet">
          <Logo />
        </h1>
        <div className="px-5 hidden lg:flex flex-row flex-wrap gap-3 flex-1">
          <a className="cursor-pointer text-system-primary-text" onClick={() => OnClickItem("/Activities")}>Activities</a>
          {/* <a className="cursor-pointer text-system-primary-text" onClick={() => OnClickItem("/Events")}>Events</a> */}
          {/* <a className="cursor-pointer text-system-primary-text" onClick={() => OnClickItem("/Discussions")}>Discussions</a> */}
          <a className="cursor-pointer text-system-primary-text" onClick={() => OnClickItem("/Connections")}>Connections</a>
          {/* <a className="cursor-pointer text-system-primary-text" onClick={() => OnClickItem("/Analytics")}>Analytics</a> */}

        </div>
        <div className="flex flex-row flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim"
            onClick={() => OnClickItem("/universal/search")}
          >
            Search
          </button>
          <ChatList />
          <AlertList />
          <button
            type="button"
            className="inline-flex justify-center rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-red"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
