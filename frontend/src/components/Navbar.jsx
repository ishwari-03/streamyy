import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { Aperture, BellIcon, HomeIcon, LogOutIcon, MenuIcon, UsersIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import useFriendRequests from "../hooks/useFriendRequests";
import { useChatNotificationsStore } from "../store/useChatNotificationsStore";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();
  const { incomingCount } = useFriendRequests();
  const { unreadCount } = useChatNotificationsStore();
  const totalNotifications = incomingCount + unreadCount;

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between w-full">
          
          {/* LOGO - Visible on Chat Page OR Mobile */}
          <div className={`${isChatPage ? "block" : "lg:hidden block"}`}>
            <Link to="/" className="flex items-center gap-2.5">
              <Aperture className="size-8 text-primary" />
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Streamyy
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            
            {/* Desktop Menu - Visible only on large screens when sidebar is present */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeSelector />
              
              <Link to={"/notifications"} className="btn btn-ghost btn-circle relative">
                  <BellIcon className="h-5 w-5 text-base-content opacity-70" />
                  {totalNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 size-4 bg-primary text-primary-content text-[10px] font-bold rounded-full flex items-center justify-center border border-base-200">
                      {totalNotifications}
                    </span>
                  )}
              </Link>
              
              <div className="avatar px-2">
                <div className="w-8 rounded-full overflow-hidden">
                  <img src={authUser?.profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser?.fullName || "user"}`} alt="User Avatar" />
                </div>
              </div>

              <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                <LogOutIcon className="h-5 w-5 text-base-content opacity-70" />
              </button>
            </div>

            {/* Mobile Menu & Globals - Visible whenever the sidebar is hidden */}
            <div className="lg:hidden flex items-center gap-1">
              <ThemeSelector />

              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                  <div className="relative">
                    <MenuIcon className="h-6 w-6" />
                    {totalNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 size-3 bg-primary rounded-full"></span>
                    )}
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-md dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-56 flex gap-1 border border-base-300">
                  
                  <li className="menu-title px-4 py-2 flex flex-row items-center gap-3 border-b border-base-200 mb-2">
                    <div className="avatar">
                      <div className="w-8 rounded-full overflow-hidden">
                        <img src={authUser?.profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser?.fullName || "user"}`} alt="User Avatar" />
                      </div>
                    </div>
                    <span className="font-semibold text-base-content truncate">{authUser?.fullName}</span>
                  </li>

                  <li><Link to="/"><HomeIcon className="size-5"/> Home</Link></li>
                  <li><Link to="/friends"><UsersIcon className="size-5"/> Friends</Link></li>
                  <li>
                    <Link to="/notifications" className="justify-between">
                      <div className="flex items-center gap-2">
                        <BellIcon className="size-5"/> Notifications
                      </div>
                      {totalNotifications > 0 && <span className="badge badge-primary badge-sm">{totalNotifications}</span>}
                    </Link>
                  </li>
                  
                  <div className="divider my-0"></div>
                  <li><button onClick={logoutMutation} className="text-error"><LogOutIcon className="size-5"/> Logout</button></li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;