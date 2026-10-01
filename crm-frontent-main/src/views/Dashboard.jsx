import React from "react";
import { Link } from "react-router-dom";
import { 
  CheckSquare, 
  CalendarCheck, 
  CalendarDays, 
  Users, 
  ArrowRight, 
  Sparkles,
  Layers,
  Clock
} from "lucide-react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  // Retrieve logged in user info
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser).user || JSON.parse(storedUser) : null;
  const firstName = user?.firstName || "User";

  const NAV_CARDS = [
    {
      to: "/tasks",
      icon: CheckSquare,
      color: "blue",
      badge: "Sprint & Kanban",
      title: "Go to Tasks",
      description: "Organize project workflows, assign tasks to team members, update statuses, and monitor deadlines on the board."
    },
    {
      to: "/leaves",
      icon: CalendarCheck,
      color: "amber",
      badge: "Time-off Hub",
      title: "Go to Leaves",
      description: "Submit leave requests for casual, sick, or vacation periods, track your approval statuses, and manage remaining days."
    },
    {
      to: "/holidays",
      icon: CalendarDays,
      color: "green",
      badge: "Holiday Schedule",
      title: "Go to Holidays",
      description: "Explore the annual company calendar for official national holidays, festive observances, and scheduled company breaks."
    },
    {
      to: "/team",
      icon: Users,
      color: "purple",
      badge: "Staff Directory",
      title: "Go to Team",
      description: "View department colleagues, check assigned roles, access contact details, and collaborate across teams effortlessly."
    }
  ];

  return (
    <div className="dashboard-container">
      
      {/* Welcome Hero Banner */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-badge">
            <Sparkles size={14} />
            <span>Workspace Overview</span>
          </div>
          <h1 className="dashboard-hero-title">
            Welcome to Infividhya TaskFlow, {firstName}!
          </h1>
          <p className="dashboard-hero-subtitle">
            Your centralized workspace to track agile sprint tasks, coordinate team time-offs, view holiday calendars, and manage team members.
          </p>
        </div>
      </div>

      {/* Navigation Quick Action Section */}
      <div>
        <div className="dashboard-section-header">
          <h2>Quick Navigation & Modules</h2>
          <p>Jump directly to any key workspace module below</p>
        </div>

        <div className="dashboard-nav-grid" style={{ marginTop: "16px" }}>
          {NAV_CARDS.map((card) => {
            const IconComponent = card.icon;
            return (
              <Link 
                key={card.to} 
                to={card.to} 
                className={`dashboard-nav-card ${card.color}`}
              >
                <div>
                  <div className="dashboard-nav-card-top">
                    <div className={`dashboard-nav-icon-box ${card.color}`}>
                      <IconComponent size={24} />
                    </div>
                    <span className="dashboard-nav-badge">{card.badge}</span>
                  </div>

                  <div className="dashboard-nav-body" style={{ marginTop: "16px" }}>
                    <h3 className="dashboard-nav-title">{card.title}</h3>
                    <p className="dashboard-nav-desc">{card.description}</p>
                  </div>
                </div>

                <div className="dashboard-nav-action">
                  <span>Open {card.title.replace("Go to ", "")}</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}