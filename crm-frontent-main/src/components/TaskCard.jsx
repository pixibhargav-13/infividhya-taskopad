import React from "react";
import { Calendar, Trash2 } from "lucide-react";
import "./TaskCard.css";

export default function TaskCard({ task, onEdit, onDelete }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", task._id);
    e.currentTarget.style.opacity = "0.5";
  };

  const getPriorityTokens = (prio) => {
    if (prio === "High" || prio === "Urgent") return { bg: "#FFF0EE", text: "#FF3B30" };
    if (prio === "Medium") return { bg: "#FFF8EC", text: "#FF9F0A" };
    return { bg: "#F0FFF4", text: "#34C759" };
  };

  const tokens = getPriorityTokens(task.priority);
  const userInitials = task.assignedTo ? `${task.assignedTo.firstName[0]}${task.assignedTo.lastName[0]}` : "?";

  return (
    <div 
      className={`card-wrapper ${task.status === "Completed" ? "completed-bg-tint" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={(e) => { e.currentTarget.style.opacity = "1"; }}
      onClick={() => onEdit(task)}
    >
      <div className="card-header-line">
        <span className="badge-priority" style={{ backgroundColor: tokens.bg, color: tokens.text }}>{task.priority}</span>
        <button className="btn-delete-card" onClick={(e) => { e.stopPropagation(); if(confirm("Delete task?")) onDelete(task._id); }}>
          <Trash2 size={13} />
        </button>
      </div>

      <h3 className="card-title-txt">{task.title}</h3>
      <p className="card-desc-txt">{task.description}</p>

      <div className="card-footer-line">
        <div className="date-box">
          <Calendar size={12} />
          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : "No Date"}</span>
        </div>
        <div className="user-box">
          <div className="avatar-dot">{userInitials}</div>
          <span>{task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName[0]}.` : "Unassigned"}</span>
        </div>
      </div>
    </div>
  );
}