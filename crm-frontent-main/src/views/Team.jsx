import React from "react";

export default function Team({ users }) {
  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Team Members</h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Active developer registries assigned to project boards.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginTop: "24px" }}>
        {users.map(u => (
          <div key={u._id} style={{ background: "white", padding: "20px", borderRadius: "14px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(0,113,227,0.08)", color: "var(--accent-blue)", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
              {u.firstName[0]}{u.lastName[0]}
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: 600 }}>{u.firstName} {u.lastName}</h3>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{u.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}