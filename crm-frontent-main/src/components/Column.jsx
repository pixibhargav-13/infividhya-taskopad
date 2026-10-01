import React, { useState } from "react";
import { Plus, Clock, Eye, CheckCircle2 } from "lucide-react";
import TaskCard from "./TaskCard";
import "./Column.css";

export default function Column({ id, title, color, tasks, onAddTask, onEditTask, onDeleteTask, onDragUpdate }) {
  const [isOver, setIsOver] = useState(false);

  const getIcon = () => {
    if (id === "Pending") return <Clock size={15} style={{ color }} />;
    if (id === "In Progress") return <Eye size={15} style={{ color }} />;
    return <CheckCircle2 size={15} style={{ color }} />;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) onDragUpdate(taskId, id);
    setIsOver(false);
  };

  return (
    <div 
      className={`column-wrapper ${isOver ? "drag-highlight" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <div className="column-header-row">
        <div className="header-left-indicators">
          <div className="header-accent-line" style={{ backgroundColor: color }} />
          {getIcon()}
          <span className="header-title-text">{title}</span>
          <span className="header-count-pill" style={{ backgroundColor: `${color}15`, color }}>{tasks.length}</span>
        </div>
        <button className="btn-header-add" onClick={onAddTask}><Plus size={14} /></button>
      </div>

      <div className="scrollable-cards-area">
        {tasks.length > 0 ? (
          tasks.map(t => (
            <TaskCard key={t._id} task={t} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))
        ) : (
          <div className="empty-placeholder-box">
            <CheckCircle2 size={24} style={{ strokeWidth: 1.5 }} />
            <span style={{ fontSize: "13px" }}>No tasks here</span>
          </div>
        )}
      </div>
    </div>
  );
}