import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Users, CalendarDays, CalendarCheck, Settings, Plus, X } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ onOpenNewTask, isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`sidebar-mobile-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar-container ${isOpen ? "open" : ""}`}>
        <div>
          <div className="logo-section">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="logo-icon"><CheckSquare size={16} /></div>
              <span className="logo-text">Infividhya TaskFlow</span>
            </div>

            {/* Mobile Close Button */}
            <button 
              type="button" 
              className="btn-sidebar-mobile-close"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav>
            <ul className="nav-menu">
              <li><NavLink to="/" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><LayoutDashboard size={18} />Dashboard</NavLink></li>
              <li><NavLink to="/tasks" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><CheckSquare size={18} />My Tasks</NavLink></li>
              <li><NavLink to="/leaves" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><CalendarCheck size={18} />Leaves</NavLink></li>
              <li><NavLink to="/team" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><Users size={18} />Team</NavLink></li>
              <li><NavLink to="/holidays" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><CalendarDays size={18} />Holidays</NavLink></li>
              <li><NavLink to="/settings" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><Settings size={18} />Settings</NavLink></li>
            </ul>
          </nav>
        </div>

        <button 
          className="btn-sidebar-action" 
          onClick={() => {
            if (onClose) onClose();
            onOpenNewTask();
          }}
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </aside>
    </>
  );
}