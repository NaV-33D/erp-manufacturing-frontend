import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  HelpCircle,
} from "lucide-react";

const navLinks = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Products",
    path: "/products",
    icon: <Package size={20} />,
    badge: 12,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: <ShoppingCart size={20} />,
    badge: 5,
  },
  {
    name: "Analytics",
    path: "/reports",
    icon: <BarChart3 size={20} />,
    badge: "New",
  },
  {
    name: "Customers",
    path: "/customers",
    icon: <User size={20} />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Settings size={20} />,
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
        setCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter nav links based on search
  const filteredLinks = navLinks.filter((link) =>
    link.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 h-screen bg-white border-r border-gray-200 shadow-lg
          transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "w-20" : "w-64"}
          ${isMobile ? "w-72" : ""}`}
      >
        {/* Logo Section */}
        <div
          className={`flex items-center justify-between h-16 px-4 border-b ${collapsed ? "px-3" : "px-4"}`}
        >
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ERP Dashboard
              </h1>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
          )}

          {!isMobile && !collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Search Bar (only when not collapsed) */}
        {/* {!collapsed && (
          <div className="px-4 py-3 border-b">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )} */}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <div className="space-y-1">
            {filteredLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    if (isMobile) setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-l-4 border-blue-600 pl-2.5"
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    }
                    ${collapsed ? "justify-center px-2" : ""}`}
                >
                  <div
                    className={`${isActive ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {link.icon}
                  </div>

                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{link.name}</span>
                      {link.badge && (
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full
                          ${
                            typeof link.badge === "number"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </>
                  )}

                  {collapsed && link.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          {!collapsed && (
            <div className="px-4 py-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Quick Actions
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </button>
            </div>
          )}
        </nav>

        {/* User Profile Section */}
        <div className={`border-t p-4 ${collapsed ? "px-2" : "px-4"}`}>
          <div
            className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">AJ</span>
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                  Admin User
                </div>
                <div className="text-xs text-gray-500 truncate">
                  admin@erp.com
                </div>
              </div>
            )}

            {!collapsed && (
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut size={18} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Collapse Toggle for Mobile */}
        {collapsed && !isMobile && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute -right-3 top-20 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {!isMobile && collapsed && (
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setCollapsed(false)}
                >
                  <ChevronRight size={20} />
                </button>
              )}

              <div>
                <h1 className="font-bold text-lg text-gray-900">
                  Dashboard Overview
                </h1>
                <p className="text-sm text-gray-500">Welcome back, Admin</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="w-px h-6 bg-gray-300"></div>

              <button className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">AJ</span>
                </div>
                <div className="hidden md:block">
                  <div className="font-medium text-sm text-gray-900">
                    Admin User
                  </div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 bg-gray-50">
          <div className=" mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
