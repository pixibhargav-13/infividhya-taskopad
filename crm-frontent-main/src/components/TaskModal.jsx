import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import "./TaskModal.css";

export default function TaskModal({ onClose, onSave, taskToEdit, users, currentUser }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setAssignedToId(taskToEdit.assignedTo?._id || "");
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setDueDate(taskToEdit.dueDate || "");
    } else if (users.length > 0) {
      setAssignedToId(users[0]._id);
    }
  }, [taskToEdit, users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return setErr("Task title is required");

    onSave({
      ...taskToEdit,
      _id: taskToEdit?._id || `t_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      assignedTo: assignedToId,
      priority,
      status,
      dueDate,
      createdBy: taskToEdit?.createdBy || currentUser
    });
  };

  return (
    <div className="modal-backdrop-layer" onClick={onClose}>
      <div className="modal-sheet-card" onClick={(e) => e.stopPropagation()}>
        <div className="m-header">
          <h2>{taskToEdit ? "Edit Task" : "Create New Task"}</h2>
          <button className="btn-close-x" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="m-form">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="m-label">TASK TITLE</label>
            <input type="text" className="m-input" value={title} onChange={(e) => { setTitle(e.target.value); setErr(""); }} placeholder="Title" />
            {err && <div style={{ color: "var(--accent-red)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={14} />{err}</div>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="m-label">DESCRIPTION</label>
            <textarea className="m-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details..." style={{ resize: "none" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="m-label">ASSIGN TO</label>
            <select className="m-input" value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)}>
              {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="m-label">PRIORITY</label>
            <div className="seg-bar">
              {["Low", "Medium", "High"].map(p => (
                <button key={p} type="button" className={`seg-btn ${priority === p ? "active" : ""}`} onClick={() => setPriority(p)}>{p}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="m-label">STATUS</label>
            <div className="seg-bar">
              {[
                { l: "Pending", v: "Pending" },
                { l: "In Review", v: "In Progress" },
                { l: "Completed", v: "Completed" }
              ].map(i => (
                <button key={i.v} type="button" className={`seg-btn ${status === i.v ? "active" : ""}`} onClick={() => setStatus(i.v)}>{i.l}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="m-label">DUE DATE</label>
            <input type="date" className="m-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="m-footer">
            <button type="button" style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "10px" }} onClick={onClose}>Cancel</button>
            <button type="submit" style={{ background: "var(--accent-blue)", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}