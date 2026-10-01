import React from "react";
import { 
  Sliders, 
  Sparkles, 
  Palette, 
  Bell, 
  ShieldCheck, 
  Webhook, 
  User 
} from "lucide-react";
import "../styles/Settings.css";

export default function Settings() {
  const UPCOMING_FEATURES = [
    { icon: Palette, label: "Theme & Dark Mode Customization" },
    { icon: Bell, label: "Email & Push Notification Controls" },
    { icon: User, label: "Profile & Role Permission Manager" },
    { icon: ShieldCheck, label: "Security & Two-Factor Authentication" },
    { icon: Webhook, label: "API Webhooks & Integrations" },
  ];

  return (
    <div className="settings-coming-soon-page">
      <div className="settings-card">
        
        {/* Glowing Icon Wrapper */}
        <div className="settings-icon-wrapper">
          <Sliders size={40} />
        </div>

        {/* Badge */}
        <div className="settings-badge">
          <Sparkles size={14} />
          <span>Under Development</span>
        </div>

        {/* Big Coming Soon Headline */}
        <div>
          <h1 className="settings-big-title">Coming Soon</h1>
        </div>

        {/* Subtitle Description */}
        <p className="settings-subtext">
          We are crafting an all-in-one configuration center for <strong>Infividhya TaskFlow</strong>. Soon you'll be able to manage your workspace settings, notification preferences, themes, and integrations.
        </p>

        {/* Planned Features Preview */}
        <div className="settings-features-container">
          <span className="settings-features-label">Planned Capabilities in Next Release</span>
          <div className="settings-chips-grid">
            {UPCOMING_FEATURES.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="settings-chip">
                  <IconComponent size={14} style={{ color: "var(--accent-blue)" }} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}