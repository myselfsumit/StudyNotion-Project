import { useState } from "react";
import { VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import SidebarLink from "./SidebarLink";

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout(navigate));
    setIsModalOpen(false);
  };

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r bg-richblack-800">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[260px] flex-col border-r border-richblack-700 bg-gradient-to-b from-richblack-900 via-richblack-800 to-richblack-900 py-8">
        {/* Header */}
        <div className="px-6 text-center text-xl font-bold text-yellow-300 mb-6">
          Dashboard
        </div>

        {/* Links */}
        <div className="flex flex-col px-6 space-y-4">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink
                key={link.id}
                link={link}
                iconName={link.icon}
                className="hover:bg-richblack-700 hover:text-yellow-300 px-4 py-2 rounded-lg transition"
              />
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-auto mt-8 mb-6 h-[1px] w-10/12 bg-richblack-25" />

        {/* Settings and Logout */}
        <div className="px-6 space-y-4">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
            className="hover:bg-richblack-700 hover:text-yellow-300 px-4 py-2 rounded-lg transition"
          />

          {/* Logout Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition"
          >
            <VscSignOut className="text-lg" />
            Logout
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setIsModalOpen(false)} // Close modal on backdrop click
        >
          {/* Modal Content */}
          <div
            className="relative w-[90%] max-w-lg p-8 bg-richblack-800 rounded-lg text-richblack-5 shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()} // Prevent background click closing
          >
            {/* Modal Header */}
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4 text-center">
              Confirm Logout
            </h2>
            <p className="text-sm text-richblack-300 mb-6 text-center">
              Are you sure you want to logout? This will end your current session.
            </p>

            {/* Modal Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
