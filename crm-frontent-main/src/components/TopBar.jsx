import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, LogOut, Menu, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import "./TopBar.css";
import API from "../api/api";

export default function TopBar({
  searchQuery,
  setSearchQuery,
  currentUser,
  onLogout,
  onToggleSidebar
}) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    if (showNotif) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotif]);

  // Fetch notifications when TopBar loads
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get("/notification");

        console.log(
          "Notifications from backend:",
          response.data?.data || response.data
        );

        if (response.data && Array.isArray(response.data.data)) {
          setNotifications(response.data.data);
        } else if (Array.isArray(response.data)) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error(
          "Error fetching notifications:",
          error.response?.data || error.message
        );
      }
    };

    fetchNotifications();

    // Poll every 30s to receive new notifications automatically
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Only count UNREAD notifications for the badge
  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  // Toggle dropdown and mark all notifications as read when opening
  const handleToggleNotif = async () => {
    const willOpen = !showNotif;
    setShowNotif(willOpen);

    if (willOpen && unreadCount > 0) {
      // 1. Immediately clear badge in UI
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );

      // 2. Persist in database
      try {
        await API.put("/notification/read-all");
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      }
    }
  };

  // Mark single notification as read if clicked
  const handleMarkOneAsRead = async (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notifId ? { ...n, read: true } : n))
    );
    try {
      await API.put(`/notification/${notifId}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const initials = currentUser
    ? `${currentUser.firstName?.[0] || ""}${currentUser.lastName?.[0] || ""}`
    : "";

  return (
    <header className="topbar-container">

      <div className="topbar-left">

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

        {/* Notification Bell Section with Anchor */}
        <div className="notif-wrapper-anchor" ref={notifRef}>
          <button
            type="button"
            className={`bell-icon-wrapper ${showNotif ? "active" : ""}`}
            onClick={handleToggleNotif}
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell size={20} />

            {/* Badge shows ONLY when there are unread notifications */}
            {unreadCount > 0 && (
              <span className="bell-badge">
                {displayCount}
              </span>
            )}
          </button>

          {/* Enhanced Notification Dropdown Menu */}
          {showNotif && (
            <div className="notif-menu">

              <div className="notif-header">
                <div className="notif-header-title">
                  <span>Notifications</span>
                  {unreadCount > 0 ? (
                    <span className="notif-count-chip">{unreadCount} New</span>
                  ) : notifications.length > 0 ? (
                    <span className="notif-count-chip" style={{ background: "rgba(0,0,0,0.05)", color: "var(--text-secondary)" }}>
                      {notifications.length} Total
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="notif-list-container">
                {notifications.length === 0 ? (
                  <div className="notif-empty-state">
                    <div className="notif-empty-icon">
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="notif-empty-title">All caught up!</span>
                    <span className="notif-empty-desc">No notifications at this time.</span>
                  </div>
                ) : (
                  notifications.map((notification, idx) => (
                    <div
                      className={`notif-item ${notification.read ? "read" : "unread"}`}
                      key={notification._id || idx}
                      onClick={() => !notification.read && handleMarkOneAsRead(notification._id)}
                    >
                      <div className="notif-item-icon">
                        <MessageSquare size={14} />
                      </div>
                      <div className="notif-item-content">
                        <p className="notif-item-text">
                          {notification.message || notification.text || JSON.stringify(notification)}
                        </p>
                        <span className="notif-item-time">
                          <Clock size={11} />
                          <span>
                            {notification.createdAt
                              ? new Date(notification.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "Recent alert"}
                          </span>
                        </span>
                      </div>
                      {!notification.read && (
                        <span className="notif-unread-dot" title="Unread" />
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

        {/* User */}
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

        {/* Logout */}
        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}
          title="Log out"
        >
          <LogOut size={16} />
          <span className="logout-btn-text">
            Logout
          </span>
        </button>

      </div>

    </header>
  );
}