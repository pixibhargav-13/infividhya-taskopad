import React from "react";
import Column from "./Column";
import SkeletonLoader from "./SkeletonLoader";
import FetchErrorState from "./FetchErrorState";
import "./Board.css";
import API from "../api/api";

export default function Board({ 
  tasks, 
  setTasks, 
  searchQuery, 
  onAddTask, 
  onEditTask,
  isLoading,
  error,
  onRetry
}) {
  const columnSchemas = [
    { id: "Pending", title: "Pending", color: "#FF3B30" },
    { id: "In Progress", title: "In Review", color: "#FF9F0A" },
    { id: "Completed", title: "Completed", color: "#34C759" }
  ];

  const countTasks = (status) => tasks.filter(t => t.status === status).length;

  const handleDragUpdate = async (taskId, targetStatus) => {
    // setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: targetStatus } : t));
    try {
        const response = await API.put(`/task/${taskId}`, { status: targetStatus });
        setTasks(prev =>
      prev.map(t =>
        t._id === taskId
          ? { ...t, status: targetStatus }
          : t
      )
    );
    }catch (error) {  
      console.error("Error updating task status:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await API.delete(`/task/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="board-container">
      <div className="board-heading-block">
        <h1 className="board-title-h1">Task Management</h1>
        <div className="board-subtitle-summary">
          {countTasks("Pending")} tasks pending · {countTasks("In Progress")} in review · {countTasks("Completed")} completed
        </div>
      </div>

      {error ? (
        <FetchErrorState 
          title={error}
          message="Could not fetch tasks from server. The request timed out (15s limit) or the server is starting up."
          onRetry={onRetry}
          isRetrying={isLoading}
        />
      ) : isLoading && tasks.length === 0 ? (
        <SkeletonLoader count={6} />
      ) : (
        <div className="columns-layout-flex">
          {columnSchemas.map(col => (
            <Column 
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              tasks={filteredTasks.filter(t => t.status === col.id)}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              onDeleteTask={handleDelete}
              onDragUpdate={handleDragUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}