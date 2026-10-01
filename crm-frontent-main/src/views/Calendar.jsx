import React from "react";
import { Calendar as CalIcon } from "lucide-react";

export default function Calendar() {
  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Calendar</h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Temporal task sequencing schedules and target release dates.</p>
      <div style={{ marginTop: "24px", padding: "40px", background: "white", borderRadius: "14px", border: "1px solid var(--border)", textAlign: "center" }}>
        <CalIcon size={48} style={{ color: "var(--text-tertiary)", marginBottom: "12px" }} />
        <h3 style={{ fontSize: "16px", fontWeight: 600 }}>No Scheduled Deliverables</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>Milestone intervals sync dynamically with project metadata blocks.</p>
      </div>
    </div>
  );
}