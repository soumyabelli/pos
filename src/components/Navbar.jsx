import { useState } from "react";
import { Search, Bell, Settings } from "lucide-react";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="navbar">
      <div className="navbar-content">
        {/* Search Bar */}
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search employees, roles, or stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Right side actions */}
        <div className="navbar-actions">
          {/* Notification Bell */}
          <button className="nav-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>

          {/* Settings */}
          <button className="nav-btn">
            <Settings size={20} />
          </button>

          {/* User Profile */}
          <div className="user-profile">
            <div className="user-avatar">
              <img
                src="https://i.pravatar.cc/40"
                alt="Alex Rivera"
                className="avatar-img"
              />
            </div>
            <div className="user-info">
              <p className="user-name">Alex Rivera</p>
              <p className="user-role">Store Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}