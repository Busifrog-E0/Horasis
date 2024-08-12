import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthProvider";
import activity from '../assets/icons/activity.svg'
import event from '../assets/icons/event.svg'
import discussion from '../assets/icons/discussion.svg'
import connections from '../assets/icons/connections.svg'
import analytics from '../assets/icons/analytics.svg'


const DashboardBottomNavbar = () => {

  const { currentUserData, scrollToTop } = useContext(AuthContext)

  const navigate = useNavigate()

  const OnClickMenu = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    scrollToTop()
    navigate(path)
  }


  return (
    <div className="bg-system-secondary-bg block lg:hidden border-t border-system-file-border">
      <div className="grid grid-cols-5 gap-3">

        {/* <button onClick={() => {
          OnClickMenu("/Activities")
        }} type="button" className="py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium bg-brand-gray-dim">
          <svg className="w-5 h-5 mb-2 text-brand-secondary " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          <span className="text-xs -mb-1 text-brand-secondary ">Activities</span>
        </button> */}
        <button onClick={() => {
          OnClickMenu("/Activities")
        }} type="button" className="py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium">
          <img src={activity} alt=""  className="h-8 cursor-pointer" />
          {/* <svg className="w-5 h-5 mb-2 text-system-primary-text " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg> */}
          <span className="text-xs -mb-1 text-system-primary-accent ">Activities</span>
        </button>
        <button onClick={() => {
          OnClickMenu("/Events")
        }} type="button" className="py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium">
          <img src={event} alt=""  className="h-8 cursor-pointer" />

          {/* <svg className="w-5 h-5 mb-2 text-system-primary-text " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z" />
            <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z" />
          </svg> */}
          <span className="text-xs -mb-1 text-system-primary-accent ">Events</span>
        </button>
        <button onClick={() => {
          OnClickMenu("/Discussions")
        }} type="button" className="py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium">
          <img src={discussion} alt=""  className="h-8 cursor-pointer" />

          {/* <svg className="w-5 h-5 mb-2 text-system-primary-text " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
          </svg> */}
          <span className="text-xs -mb-1 text-system-primary-accent ">Discussions</span>
        </button>
        <button onClick={() => {
          OnClickMenu("/Connections")
        }} type="button" className="py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium">
          <img src={connections} alt=""  className="h-8 cursor-pointer" />

          {/* <svg className="w-5 h-5 mb-2 text-system-primary-text " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg> */}
          <span className="text-xs -mb-1 text-system-primary-accent ">Connections</span>
        </button>
        <button onClick={() => {
          OnClickMenu("/Analytics")
        }} type="button" className="py-2 inline-flex flex-col items-center justify-center px-5 gap-2 font-medium">
          <img src={analytics} alt=""  className="h-8 cursor-pointer" />

          {/* <svg className="w-5 h-5 mb-2 text-system-primary-text " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
          </svg> */}
          <span className="text-xs -mb-1 text-system-primary-accent ">Analytics</span>
        </button>
      </div>

    </div>
  );
};

export default DashboardBottomNavbar;


{/* <a className="text-system-primary-text" >Activities</a>
          <a className="text-system-primary-text" href="/Events">Events</a>
          <a className="text-system-primary-text" href="/Discussions">Discussions</a>
          <a className="text-system-primary-text" href="/Connections">Connections</a>
          <a className="text-system-primary-text" href="/Analytics">Analytics</a> */}
{/* <div className="p-3 text-center">
          <a href="/Activities" className="text-xs -mb-1 bg-red-100 block">•</a>
        </div>
        <div className="p-3 text-center">
          <a href="/Events" className="text-xs -mb-1 bg-red-100 block">•</a>
        </div>
        <div className="p-3 text-center">
          <a href="/Discussions" className="text-xs -mb-1 bg-red-100 block">•</a>
        </div>
        <div className="p-3 text-center">
          <a href="/Connections" className="text-xs -mb-1 bg-red-100 block">•</a>
        </div>
        <div className="p-3 text-center">
          <a href="/Analytics" className="text-xs -mb-1 bg-red-100 block">•</a>
        </div> */}