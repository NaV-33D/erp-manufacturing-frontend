import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Download,
  ClipboardList,
  Boxes,
  Upload,
  Package,
  Truck,
  Menu,
  X,
  ReceiptText,
  Database,
  BarChart3,
  PackageCheck,
  HandGrab,
  Settings,
} from "lucide-react";
import Header from "./Header";
import { useAuth } from "../utils/AuthProvider";
import { canSeeMenuPath } from "../utils/sidebarAccess";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Inbound", icon: Download, path: "/inbound" },
  { name: "Putaway", icon: ClipboardList, path: "/putaway" },
  { name: "Inventory", icon: Boxes, path: "/inventory" },
  { name: "Outbound", icon: Upload, path: "/outbound" },
  { name: "Picking", icon: HandGrab, path: "/picking" },
  { name: "Packing", icon: PackageCheck, path: "/packing" },
  { name: "Shipping", icon: Truck, path: "/shipping" },
  { name: "Billing", icon: ReceiptText, path: "/billing" },
  { name: "Masters", icon: Database, path: "/masters" },
  { name: "Reports", icon: BarChart3, path: "/reports" },
  { name: "Setting", icon: Settings, path: "/setting" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { perms, loadingPerms } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const visibleMenuItems = loadingPerms
    ? []
    : menuItems.filter((item) => canSeeMenuPath(perms, item.path));
  return (
    <div className="flex h-screen bg-[#F6F8FA] overflow-hidden">
      {" "}
      {/* Mobile Toggle */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 sm:hidden"
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed sm:sticky sm:top-0 top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        {/* Wrapper */}
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">
              Orbit <span className="text-primary">WMS</span>
            </h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {visibleMenuItems.map(({ name, icon: Icon, path }) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition ${isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`
                }
              >
                <Icon className="w-5 h-5" />
                {name}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="mt-auto border-t p-3">
            {" "}
            <button
              onClick={() => {
                sessionStorage.clear();
                localStorage.clear();
                logout();
                navigate("/login", { replace: true });
              }}
              className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V4"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>
      {/* Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
