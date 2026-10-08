import React from "react";
import "./SkeletonLoader.css";

export default function SkeletonLoader({ count = 6, type = "cards" }) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === "table") {
    return (
      <div className="skeleton-table-wrapper">
        <div className="skeleton-table-header shimmer-bg" />
        {items.map((idx) => (
          <div key={idx} className="skeleton-table-row">
            <div className="skeleton-pill shimmer-bg" />
            <div className="skeleton-line shimmer-bg" style={{ width: "35%" }} />
            <div className="skeleton-line shimmer-bg" style={{ width: "25%" }} />
            <div className="skeleton-line shimmer-bg" style={{ width: "15%" }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-grid">
      {items.map((idx) => (
        <div key={idx} className="skeleton-card">
          {/* YouTube-style main thumbnail placeholder */}
          <div className="skeleton-thumbnail shimmer-bg" />
          
          {/* Bottom details with avatar circle and text lines */}
          <div className="skeleton-details">
            <div className="skeleton-avatar shimmer-bg" />
            <div className="skeleton-meta">
              <div className="skeleton-line shimmer-bg" style={{ width: "85%" }} />
              <div className="skeleton-line shimmer-bg" style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

