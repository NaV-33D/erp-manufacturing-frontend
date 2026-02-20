import { Bell, Search } from "lucide-react";
import { useAuth } from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { userSession } = useAuth();
  const navigate = useNavigate();

  if (!userSession) {
    return <></>;
  }

  // Function to get user avatar initials
  const getUserInitials = () => {
    if (!userSession) return "U";
    const firstName = userSession.first_name || "";
    const lastName = userSession.last_name || "";
    const initials =
      `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    return initials || userSession.username?.charAt(0).toUpperCase() || "U";
  };

  // Function to get username (from login response)
  const getUsername = () => {
    if (!userSession) return "User";
    return userSession.username || "User";
  };

  // Function to get user's primary role
  const getUserRole = () => {
    return userSession.roles[0].role_name || "";
  };

  // Check if profile image exists (for future backend implementation)
  const getProfileImage = () => {
    if (!userSession) return null;
    return (
      userSession.profile_image ||
      userSession.avatar_url ||
      userSession.profile_picture ||
      null
    );
  };

  return (
    <header className="w-full bg-white border-b px-4 py-3 flex items-center justify-between">
      {/* LEFT SECTION - Dashboard Title */}
      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <div className="font-semibold text-gray-900">Dashboard</div>
          <div className="text-xs text-gray-500">
            Welcome back, {getUsername()}
          </div>
        </div>

        <div className="md:hidden">
          <div className="font-semibold text-gray-900">Dashboard</div>
        </div>
      </div>

      {/* CENTER - Search Bar */}
      <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search SKU, Order, GRN, Pallet..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* RIGHT SECTION - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* Profile Image (beside bell icon) */}
        <div className="flex items-center gap-2">
          {/* Dynamic Profile Image/Avatar */}
          <div onClick={() => navigate("/setting")} className="relative">
            {getProfileImage() ? (
              <img
                src={getProfileImage()}
                alt={getUsername()}
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm cursor-pointer">
                {getUserInitials()}
              </div>
            )}
            {/* Online status indicator */}
          </div>

          {/* User Info (hidden on mobile) */}
          <div className="hidden md:block text-right">
            <div className="font-medium text-gray-900">{getUsername()}</div>
            <div className="text-xs text-gray-500">{getUserRole()}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
