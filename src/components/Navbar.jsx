import { useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let role = "";
  let name = "User";

  if (token) {
    try {
      const payload = token.split(".")[1];
      if (payload) {
        const decoded = JSON.parse(atob(payload));
        role = decoded?.role || "";
        name = decoded?.name || "User";
      }
    } catch {
      role = "";
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 shadow-sm border-b">
      
      {/* 🔍 Search Bar */}
      <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-1/2">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search orders, customers, SKUs..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* 🔔 Actions */}
      <div className="flex items-center gap-5">
        
        {/* Notification Icon */}
        <Bell className="text-gray-600 cursor-pointer" size={20} />

        {/* Role Badge */}
        {role && (
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
            {role.toUpperCase()}
          </span>
        )}

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-gray-500">Store Manager</p>
          </div>

          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}