import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sliders, 
  ArrowLeft, 
  Bell, 
  ShieldCheck, 
  User, 
  Palette, 
  Clock,
  Sparkles
} from "lucide-react";
import "../styles/Settings.css";

export default function Settings() {
  const navigate = useNavigate();

  const PLANNED_MODULES = [
    {
      icon: User,
      title: "Profile & Identity",
      description: "Manage personal details, avatar, and role permissions.",
    },
    {
      icon: Bell,
      title: "Notification Preferences",
      description: "Customize real-time task alerts, leave updates, and daily digests.",
    },
    {
      icon: ShieldCheck,
      title: "Security & Access",
      description: "Update passwords, manage two-factor authentication, and active sessions.",
    },
    {
      icon: Palette,
      title: "Themes & Appearance",
      description: "Dark mode support, custom accent colors, and display density.",
    },
  ];

  return (
    <div className="settings-coming-soon-wrapper">
      <div className="settings-coming-soon-card">
        
        {/* Status Chip */}
        <div className="coming-soon-status-chip">
          <span className="status-live-dot" />
          <span>In Active Development</span>
        </div>

        {/* Modern Icon Box */}
        <div className="coming-soon-icon-box">
          <Sliders size={28} />
        </div>

        {/* Clean, Solid Typography (No Gradient) */}
        <div className="coming-soon-text-group">
          <h1 className="coming-soon-headline">Settings is Coming Soon</h1>
          <p className="coming-soon-subhead">
            We are building a centralized configuration hub for <strong>TaskFlow</strong>. 
            You'll soon be able to manage your workspace settings, notifications, security, and team preferences in one seamless dashboard.
          </p>
        </div>

        {/* Feature Preview Cards Grid */}
        <div className="coming-soon-modules-section">
          <span className="coming-soon-section-title">What to Expect in the Next Update</span>
          <div className="coming-soon-modules-grid">
            {PLANNED_MODULES.map((module, idx) => {
              const Icon = module.icon;
              return (
                <div key={idx} className="coming-soon-module-item">
                  <div className="module-item-icon">
                    <Icon size={16} />
                  </div>
                  <div className="module-item-info">
                    <h4 className="module-item-title">{module.title}</h4>
                    <p className="module-item-desc">{module.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Row */}
        <div className="coming-soon-footer">
          <button 
            type="button" 
            className="btn-back-tasks"
            onClick={() => navigate("/tasks")}
          >
            <ArrowLeft size={16} />
            <span>Back to Tasks</span>
          </button>

          <div className="coming-soon-meta-tag">
            <Clock size={14} />
            <span>Target Release: Q4 2026</span>
          </div>
        </div>

      </div>
    </div>
  );
}