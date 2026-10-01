import React, { useState } from "react";
import { Search, Bell, LogOut, Menu } from "lucide-react";
import "./TopBar.css";

export default function TopBar({
  searchQuery,
  setSearchQuery,
  currentUser,
  onLogout,
  onToggleSidebar
}) {
  const [showNotif, setShowNotif] = useState(false);

  const initials = currentUser
    ? `${currentUser.firstName?.[0] || ""}${currentUser.lastName?.[0] || ""}`
    : "";

  return (
    <header className="topbar-container">
      
      <div className="topbar-left">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button 
          type="button" 
          className="btn-mobile-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Open sidebar navigation"
        >
          <Menu size={22} />
        </button>

        <div className="search-box">
          <Search className="search-box-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="search-box-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="topbar-right">
        <div
          className="bell-icon-wrapper"
          onClick={() => setShowNotif(!showNotif)}
        >
          <Bell size={20} />
          <div className="bell-badge" />
        </div>

        {/* USER */}
        <div className="user-info">
          <div className="avatar">
            {initials}
          </div>

          <div className="user-name">
            {currentUser
              ? `${currentUser.firstName} ${currentUser.lastName}`
              : "User"}
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}
          title="Log out"
        >
          <LogOut size={16} />
          <span className="logout-btn-text">Logout</span>
        </button>

        {showNotif && (
          <div className="notif-menu">
            <div className="notif-title">NOTIFICATIONS</div>
            <div className="notif-desc">
              Jordan Lee updated task board logs.
            </div>
          </div>
        )}
      </div>

    </header>
  );
}