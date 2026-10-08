import React, { useState , useEffect } from "react";
import { 
  CalendarCheck, 
  Plus, 
  Search, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar as CalIcon,
  Sun,
  Coffee,
  Activity,
  AlertTriangle,
  MoreHorizontal,
  ChevronDown
} from "lucide-react";
import ApplyLeaveModal from "../components/ApplyLeaveModal";
import SkeletonLoader from "../components/SkeletonLoader";
import FetchErrorState from "../components/FetchErrorState";
import "../styles/Leaves.css";
import API from "../api/api"; // Import the API instance for making requests

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser).user || JSON.parse(rawUser) : null;
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // get user leave data from backend
  const fetchLeave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (isAdmin) {
        response = await API.get("/leave/all", { timeout: 15000 });
        console.log("ADMIN LEAVES:", response.data.allLeave);
        setLeaves(response.data.allLeave || []);
      } else {
        response = await API.get("/leave/", { timeout: 15000 });
        console.log("USER LEAVES:", response.data.userLeave);
        setLeaves(response.data.userLeave || []);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching leave:", error);
      setError("Can't fetch Leaves");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeave();
  }, []);

  // Add new leave application
  const handleApplySubmit = async (newLeaveData) => {
    // Local state update for immediate preview
   try{ 
      
    
       const response = await API.post("/leave/", {
      Reason: newLeaveData.Reason,
      Leavetype: newLeaveData.Leavetype,
      startDate: newLeaveData.startDate,
      endDate: newLeaveData.endDate,
      status: "Pending"
    });

    console.log("Leave created:", response.data);

    setLeaves((prev) => [response.data.data, ...prev]);
    setShowApplyModal(false);
  }
    catch(error){
      console.error("Error adding leave:", error);
    }
  };

  // Delete leave application
  const handleDeleteLeave = async (leaveId) => {
    try{
      const response = await API.delete(`/leave/${leaveId}`);
      console.log("Leave deleted:", response.data);
      setLeaves((prev) => prev.filter((l) => l._id !== leaveId));
    }
    catch(error){
      console.error("Error deleting leave:", error);
    }
  };

  //update leave status (admin only)
  const handleUpdateStatus = async (leaveId, targetStatus) => {
  try {
    const response = await API.put(
      `/leave/${leaveId}/status`,
      {
        status: targetStatus
      }
    );

    console.log("Status updated:", response.data);

    setLeaves((prev) =>
      prev.map((leave) =>
        leave._id === leaveId
          ? { ...leave, status: targetStatus }
          : leave
      )
    );
  } catch (error) {
    console.error("Error updating leave status:", error);
  }
};

  // Helper to calculate days between dates
  const getDaysCount = (startStr, endStr) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    if (isNaN(s) || isNaN(e) || e < s) return 1;
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Format date readable (e.g. Oct 12, 2026)
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Calculate annual quota usages
  const QUOTAS = { casual: 12, sick: 10, vacation: 15 };
  
  const getUsedDays = (type) => {
    return leaves
      .filter((l) => l.Leavetype === type && l.status === "Approved")
      .reduce((acc, curr) => acc + getDaysCount(curr.startDate, curr.endDate), 0);
  };

  const casualUsed = getUsedDays("casual");
  const sickUsed = getUsedDays("sick");
  const vacationUsed = getUsedDays("vacation");
  const pendingCount = leaves.filter((l) => l.status === "Pending").length;

  // Filter leaves based on search & filter controls
  const filteredLeaves = leaves.filter((l) => {
    const matchesSearch = 
      l.Reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.Leavetype.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    const matchesType = typeFilter === "All" || l.Leavetype === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusCount = (status) => {
    if (status === "All") return leaves.length;
    return leaves.filter((l) => l.status === status).length;
  };

  // Map leave type to corresponding icon and label
  const renderLeaveTypeBadge = (type) => {
    switch (type) {
      case "sick":
        return (
          <span className="leave-type-pill sick">
            <Activity size={12} />
            <span>Sick Leave</span>
          </span>
        );
      case "vacation":
        return (
          <span className="leave-type-pill vacation">
            <Sun size={12} />
            <span>Vacation</span>
          </span>
        );
      case "emergency":
        return (
          <span className="leave-type-pill emergency">
            <AlertTriangle size={12} />
            <span>Emergency</span>
          </span>
        );
      case "other":
        return (
          <span className="leave-type-pill other">
            <MoreHorizontal size={12} />
            <span>Other</span>
          </span>
        );
      case "casual":
      default:
        return (
          <span className="leave-type-pill casual">
            <Coffee size={12} />
            <span>Casual Leave</span>
          </span>
        );
    }
  };

  return (
    <div className="leaves-page">
      
      {/* Header Section */}
      <div className="leaves-header-row">
        <div className="leaves-header-title">
          <h1>Leave Management</h1>
          <p>Submit leave applications, view remaining balances, and track approvals.</p>
        </div>

        <button 
          className="btn-apply-leave-primary"
          onClick={() => setShowApplyModal(true)}
        >
          <Plus size={16} />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* Quota / Balance Stats Cards Grid */}
      <div className="leaves-stats-grid">
        {/* Casual Leave Balance */}
        <div className="leave-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Casual Leaves</span>
            <div className="stat-card-icon-box blue">
              <Coffee size={18} />
            </div>
          </div>
          <div className="stat-card-value-row">
            <span className="stat-card-main-num">{Math.max(0, QUOTAS.casual - casualUsed)}</span>
            <span className="stat-card-sub-num">/ {QUOTAS.casual} days left</span>
          </div>
          <div className="stat-progress-bar-bg">
            <div 
              className="stat-progress-bar-fill" 
              style={{ 
                width: `${Math.min(100, (casualUsed / QUOTAS.casual) * 100)}%`,
                background: "var(--accent-blue)" 
              }} 
            />
          </div>
        </div>

        {/* Sick Leave Balance */}
        <div className="leave-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Sick Leaves</span>
            <div className="stat-card-icon-box amber">
              <Activity size={18} />
            </div>
          </div>
          <div className="stat-card-value-row">
            <span className="stat-card-main-num">{Math.max(0, QUOTAS.sick - sickUsed)}</span>
            <span className="stat-card-sub-num">/ {QUOTAS.sick} days left</span>
          </div>
          <div className="stat-progress-bar-bg">
            <div 
              className="stat-progress-bar-fill" 
              style={{ 
                width: `${Math.min(100, (sickUsed / QUOTAS.sick) * 100)}%`,
                background: "var(--accent-amber)" 
              }} 
            />
          </div>
        </div>

        {/* Vacation Balance */}
        <div className="leave-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Vacation Balance</span>
            <div className="stat-card-icon-box green">
              <Sun size={18} />
            </div>
          </div>
          <div className="stat-card-value-row">
            <span className="stat-card-main-num">{Math.max(0, QUOTAS.vacation - vacationUsed)}</span>
            <span className="stat-card-sub-num">/ {QUOTAS.vacation} days left</span>
          </div>
          <div className="stat-progress-bar-bg">
            <div 
              className="stat-progress-bar-fill" 
              style={{ 
                width: `${Math.min(100, (vacationUsed / QUOTAS.vacation) * 100)}%`,
                background: "var(--accent-green)" 
              }} 
            />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="leave-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Awaiting Approval</span>
            <div className="stat-card-icon-box purple">
              <Clock size={18} />
            </div>
          </div>
          <div className="stat-card-value-row">
            <span className="stat-card-main-num">{pendingCount}</span>
            <span className="stat-card-sub-num">{pendingCount === 1 ? "request" : "requests"} pending</span>
          </div>
          <div className="stat-progress-bar-bg">
            <div 
              className="stat-progress-bar-fill" 
              style={{ 
                width: pendingCount > 0 ? "100%" : "0%",
                background: "#AF52DE" 
              }} 
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="leaves-controls-card">
        <div className="controls-left-group">
          {/* Search Input */}
          <div className="leaves-search-box">
            <Search className="leaves-search-icon" />
            <input
              type="text"
              placeholder="Search by reason or type..."
              className="leaves-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Filter Dropdown */}
          <select 
            className="leaves-type-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Leave Types</option>
            <option value="casual">Casual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="vacation">Vacation Leave</option>
            <option value="emergency">Emergency Leave</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Status Segmented Tabs */}
        <div className="status-seg-bar">
          {["All", "Pending", "Approved", "Rejected"].map((st) => (
            <button
              key={st}
              type="button"
              className={`status-seg-btn ${statusFilter === st ? "active" : ""}`}
              onClick={() => setStatusFilter(st)}
            >
              <span>{st}</span>
              <span className="status-seg-count">{getStatusCount(st)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Leave Applications Table */}
      {error ? (
        <FetchErrorState 
          title={error}
          message="Could not fetch leave records from server. The request timed out (15s limit) or the server is starting up."
          onRetry={fetchLeave}
          isRetrying={isLoading}
        />
      ) : isLoading && leaves.length === 0 ? (
        <SkeletonLoader count={4} type="table" />
      ) : (
        <div className="leaves-table-wrapper">
          {filteredLeaves.length === 0 ? (
            <div className="empty-leaves-box">
              <div className="empty-leaves-icon">
                <CalIcon size={24} />
              </div>
              <div className="empty-leaves-title">No Leave Applications Found</div>
              <div className="empty-leaves-sub">
                No leave records match your current search or status filter. Click "Apply Leave" to submit a new request.
              </div>
            </div>
          ) : (
            <table className="leaves-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Dates & Duration</th>
                  <th>Reason</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((item) => {
                  const days = getDaysCount(item.startDate, item.endDate);
                  return (
                    <tr key={item._id}>
                      <td>
                        {renderLeaveTypeBadge(item.Leavetype)}
                      </td>
                      <td>
                        <div className="date-cell-wrapper">
                          <span className="date-range-text">
                            {formatDate(item.startDate)} → {formatDate(item.endDate)}
                          </span>
                          <span className="date-duration-tag">
                            {days} {days === 1 ? "day" : "days"} duration
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="reason-cell-text" title={item.Reason}>
                          {item.Reason}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                          {formatDate(item.updatedAt || item.startDate)}
                        </span>
                      </td>
                      <td>
                        {isAdmin ? (
                          <div className="leave-status-select-wrapper">
                            <select
                              className={`leave-status-select ${item.status}`}
                              value={item.status}
                              onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                            >
                              <option value="Pending">● Pending</option>
                              <option value="Approved">● Approved</option>
                              <option value="Rejected">● Rejected</option>
                            </select>
                            <ChevronDown size={14} className="leave-status-select-icon" />
                          </div>
                        ) : (
                          <span className={`leave-status-badge ${item.status}`}>
                            <div className={`status-dot ${item.status}`} />
                            <span>{item.status}</span>
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn-action-delete"
                          onClick={() => handleDeleteLeave(item._id)}
                          title="Delete / Cancel Leave Request"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <ApplyLeaveModal
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleApplySubmit}
        />
      )}

    </div>
  );
}
