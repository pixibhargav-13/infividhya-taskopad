import React, { useState } from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  Activity, 
  Coffee, 
  Sun, 
  AlertTriangle, 
  MoreHorizontal, 
  AlertCircle 
} from "lucide-react";
import "../styles/Leaves.css";

/**
 * ApplyLeaveModal Component
 * 
 * Form matches the backend Leave Model schema:
 * - Leavetype: enum ["sick", "casual", "vacation", "emergency", "other"]
 * - startDate: Date
 * - endDate: Date
 * - Reason: String (required)
 * - status: "Pending" (default)
 * 
 * NOTE FOR BACKEND INTEGRATION:
 * When ready, pass this payload to:
 * POST http://localhost:8000/leave
 * Headers: { Authorization: `Bearer ${token}` }
 * Body: { Reason, Leavetype, startDate, endDate, status }
 */
export default function ApplyLeaveModal({ onClose, onSubmit }) {
  const [Leavetype, setLeavetype] = useState("casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [Reason, setReason] = useState("");
  const [error, setError] = useState("");

  const LEAVE_TYPES = [
    { id: "casual", label: "Casual", icon: Coffee },
    { id: "sick", label: "Sick", icon: Activity },
    { id: "vacation", label: "Vacation", icon: Sun },
    { id: "emergency", label: "Emergency", icon: AlertTriangle },
    { id: "other", label: "Other", icon: MoreHorizontal },
  ];

  // Calculate day difference
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || end < start) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  };

  const calculatedDays = calculateDays();

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    if (!startDate) {
      setError("Please select a start date.");
      return;
    }
    if (!endDate) {
      setError("Please select an end date.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("End date cannot be prior to start date.");
      return;
    }
    if (!Reason.trim()) {
      setError("Please provide a reason for the leave application.");
      return;
    }

    // Prepare payload matching backend schema
    const newLeavePayload = {
      _id: `leave_${Date.now()}`,
      Leavetype,
      startDate,
      endDate,
      Reason: Reason.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(newLeavePayload);
  };

  return (
    <div className="leave-modal-backdrop" onClick={onClose}>
      <div className="leave-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="leave-modal-header">
          <h2>Apply for Leave</h2>
          <button type="button" className="btn-close-x" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="leave-error-alert" style={{ marginBottom: "16px" }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="leave-modal-form">
          {/* Leave Type Selector */}
          <div className="leave-form-group">
            <label className="leave-form-label">LEAVE TYPE</label>
            <div className="leave-types-grid">
              {LEAVE_TYPES.map((type) => {
                const IconComponent = type.icon;
                const isSelected = Leavetype === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    className={`leave-type-choice-btn ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setLeavetype(type.id);
                      setError("");
                    }}
                  >
                    <IconComponent size={18} />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates Selection */}
          <div className="leave-dates-row">
            <div className="leave-form-group">
              <label className="leave-form-label">START DATE</label>
              <input
                type="date"
                className="leave-input-field"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <div className="leave-form-group">
              <label className="leave-form-label">END DATE</label>
              <input
                type="date"
                className="leave-input-field"
                value={endDate}
                min={startDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
          </div>

          {/* Duration Indicator */}
          {calculatedDays > 0 && (
            <div className="duration-summary-pill">
              <Clock size={14} />
              <span>Requested Duration: {calculatedDays} {calculatedDays === 1 ? "Day" : "Days"}</span>
            </div>
          )}

          {/* Reason Field */}
          <div className="leave-form-group">
            <label className="leave-form-label">REASON FOR LEAVE</label>
            <textarea
              className="leave-input-field leave-textarea"
              placeholder="Please provide details regarding your leave request..."
              rows={3}
              value={Reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="leave-modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-submit">
              Submit Application
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
