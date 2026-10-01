import React, { useState, useMemo , useEffect } from "react";
import { 
  CalendarDays, 
  Search, 
  Sparkles, 
  Sun, 
  Clock, 
  PartyPopper, 
  Building2, 
  Layers, 
  LayoutGrid, 
  List, 
  Plus, 
  Trash2
} from "lucide-react";
import AddHolidayModal from "../components/AddHolidayModal";
import "../styles/Holidays.css";
import API from "../api/api"; // Import the API instance for making requests

/**
 * =========================================================================
 * HOLIDAYS VIEW (FRONTEND ONLY)
 * 
 * Ready for your backend implementation!
 * You can implement and connect the endpoints whenever you are ready:
 * 
 * 1. Fetch holidays on mount:
 *    GET http://localhost:8000/holiday
 * 
 * 2. Add a new holiday:
 *    POST http://localhost:8000/holiday
 *    Body: { Name, Date, Day, Type }
 * 
 * 3. Delete a holiday:
 *    DELETE http://localhost:8000/holiday/:id
 * =========================================================================
 */

export default function Holidays() {
  // Pure frontend state - starts empty
  const [holidays, setHolidays] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [holidayToEdit, setHolidayToEdit] = useState(null);


const user = JSON.parse(localStorage.getItem("user"));
  //getholidays
  const fetchHolidays = async () => {
  try {
    const response = await API.get("/holiday");

    console.log("Holidays are:", response.data.data);

    setHolidays(response.data.data);
  } catch (error) {
    console.error("Error fetching holidays:", error);
  }
};


  // Handle Add Holiday (Frontend State)
const handleAddHoliday = async (newHolidayData) => {
  try {
    const response = await API.post("/holiday", newHolidayData);

    console.log("Holiday created:", response.data);

    setHolidays((prev) => [response.data.data, ...prev]);

    setShowAddModal(false);
  } catch (error) {
    console.error("Error creating holiday:", error);
  }
};

  // Handle Delete Holiday (Frontend State)
const handleDeleteHoliday = async (holidayId) => {
  try {
    const response = await API.delete(`/holiday/${holidayId}`);

    console.log("Holiday deleted:", response.data);

    setHolidays((prev) =>
      prev.filter((holiday) => holiday._id !== holidayId)
    );
  } catch (error) {
    console.error("Error deleting holiday:", error);
  }
};
//update holiday
const handleUpdateHoliday = async (holidayId, updatedData) => {
  try {
    const response = await API.put(
      `/holiday/${holidayId}`,
      updatedData
    );

    console.log("Holiday updated:", response.data);

    setHolidays((prev) =>
      prev.map((holiday) =>
        holiday._id === holidayId
          ? response.data.data
          : holiday
      )
    );

    setHolidayToEdit(null);
    setShowAddModal(false);

  } catch (error) {
    console.error("Error updating holiday:", error);
  }
};

  useEffect(() => {
  fetchHolidays();
}, []);

  // Helper: Parses Date into Month, Day, and Year
  const parseDateParts = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { month: "---", day: "--", year: "----" };
      const month = d.toLocaleDateString("en-US", { month: "short" });
      const day = d.getDate();
      const year = d.getFullYear().toString();
      return { month, day, year };
    } catch {
      return { month: "---", day: "--", year: "----" };
    }
  };

  // Helper: Get status (Upcoming, Today, Passed)
  const getHolidayStatus = (dateStr) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const hDate = new Date(dateStr);
      if (isNaN(hDate.getTime())) return { label: "Scheduled", type: "upcoming" };
      hDate.setHours(0, 0, 0, 0);

      const diffTime = hDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return { label: "Today", type: "today" };
      if (diffDays > 0) return { label: `In ${diffDays} days`, type: "upcoming" };
      return { label: "Passed", type: "passed" };
    } catch {
      return { label: "Scheduled", type: "upcoming" };
    }
  };

  // Format date readable (e.g. Oct 12, 2026)
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Extract all available years dynamically from state
  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    holidays.forEach((item) => {
      const { year } = parseDateParts(item.Date);
      if (year && year !== "----") {
        yearsSet.add(year);
      }
    });
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [holidays]);

  // Filtered Holidays list
  const filteredHolidays = useMemo(() => {
    return holidays.filter((item) => {
      const name = (item.Name || "").toLowerCase();
      const day = (item.Day || "").toLowerCase();
      const type = (item.Type || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || day.includes(query) || type.includes(query);
      
      const { year } = parseDateParts(item.Date);
      const matchesYear = selectedYear === "All" || year === selectedYear;
      const matchesType = typeFilter === "All" || item.Type === typeFilter;

      return matchesSearch && matchesYear && matchesType;
    });
  }, [holidays, searchQuery, selectedYear, typeFilter]);

  // Dynamic Statistics
  const totalCount = holidays.length;
  const publicCount = holidays.filter((h) => h.Type === "public").length;
  const religiousCount = holidays.filter((h) => h.Type === "religious").length;
  const companyCount = holidays.filter((h) => h.Type === "company").length;
  const specialCount = holidays.filter((h) => h.Type === "special" || h.Type === "optional").length;

  // Render Type Badge matching enum ["public", "religious", "company", "optional", "special"]
  const renderTypeBadge = (type) => {
    const normalizedType = (type || "public").toLowerCase();
    switch (normalizedType) {
      case "religious":
        return (
          <span className="holiday-type-pill festival">
            <PartyPopper size={11} />
            <span>Religious</span>
          </span>
        );
      case "company":
        return (
          <span className="holiday-type-pill national">
            <Building2 size={11} />
            <span>Company</span>
          </span>
        );
      case "optional":
        return (
          <span className="holiday-type-pill restricted">
            <Layers size={11} />
            <span>Optional</span>
          </span>
        );
      case "special":
        return (
          <span className="holiday-type-pill festival">
            <Sparkles size={11} />
            <span>Special</span>
          </span>
        );
      case "public":
      default:
        return (
          <span className="holiday-type-pill public">
            <Sun size={11} />
            <span>Public Holiday</span>
          </span>
        );
    }
  };

  return (
    <div className="holidays-page">
      
      {/* Header Section */}
      <div className="holidays-header-row">
        <div className="holidays-header-title">
          <h1>Company Holidays</h1>
          <p>Official holiday schedule, corporate observances, and scheduled days off.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
         { user?.role === "admin" && (
            <button 
              type="button"
              className="btn-add-holiday-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
            <span>Add Holiday</span>
          </button>)}
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="holidays-stats-grid">
        <div className="holiday-stat-card">
          <div className="holiday-stat-header">
            <span className="holiday-stat-label">Total Holidays</span>
            <div className="holiday-stat-icon-box blue">
              <CalendarDays size={18} />
            </div>
          </div>
          <div className="holiday-stat-value">{totalCount}</div>
          <span className="holiday-stat-sub">Configured in calendar</span>
        </div>

        <div className="holiday-stat-card">
          <div className="holiday-stat-header">
            <span className="holiday-stat-label">Public Holidays</span>
            <div className="holiday-stat-icon-box green">
              <Sun size={18} />
            </div>
          </div>
          <div className="holiday-stat-value">{publicCount}</div>
          <span className="holiday-stat-sub">Official public observances</span>
        </div>

        <div className="holiday-stat-card">
          <div className="holiday-stat-header">
            <span className="holiday-stat-label">Religious / Festivals</span>
            <div className="holiday-stat-icon-box amber">
              <PartyPopper size={18} />
            </div>
          </div>
          <div className="holiday-stat-value">{religiousCount}</div>
          <span className="holiday-stat-sub">Cultural & religious breaks</span>
        </div>

        <div className="holiday-stat-card">
          <div className="holiday-stat-header">
            <span className="holiday-stat-label">Company & Special</span>
            <div className="holiday-stat-icon-box purple">
              <Building2 size={18} />
            </div>
          </div>
          <div className="holiday-stat-value">{companyCount + specialCount}</div>
          <span className="holiday-stat-sub">Internal company off days</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="holidays-controls-card">
        <div className="holidays-controls-left">
          
          {/* Search Box */}
          <div className="holidays-search-box">
            <Search className="holidays-search-icon" />
            <input
              type="text"
              placeholder="Search by holiday name, day or type..."
              className="holidays-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Year Filter */}
          <select
            className="holidays-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">All Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>Year {yr}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            className="holidays-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="public">Public</option>
            <option value="religious">Religious</option>
            <option value="company">Company</option>
            <option value="optional">Optional</option>
            <option value="special">Special</option>
          </select>

        </div>

        {/* View Mode Toggle */}
        <div className="holidays-controls-right">
          <div className="view-toggle-group">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Card Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Card Grid View or Table View */}
      {viewMode === "grid" ? (
        <div className="holidays-cards-grid">
          {filteredHolidays.length === 0 ? (
            <div className="empty-holidays-box">
              <div className="empty-holidays-icon">
                <CalendarDays size={24} />
              </div>
              <div className="empty-holidays-title">No Holidays Added Yet</div>
              <div className="empty-holidays-sub">
                Click "Add Holiday" above to schedule a new holiday for your team.
              </div>
                          {user?.role === "admin" && (
                    <button
                      type="button"
                      className="btn-add-holiday-primary"
                      style={{ marginTop: "12px" }}
                      onClick={() => setShowAddModal(true)}
                    >
                      <Plus size={15} />
                      <span>Add First Holiday</span>
                    </button>
                  )}
            </div>
          ) : (
            filteredHolidays.map((item) => {
              const { month, day, year } = parseDateParts(item.Date);
              const status = getHolidayStatus(item.Date);

              return (
                                        <div
                          key={item._id}
                          className="holiday-card"
                          onClick={() => {
                            if (user?.role === "admin") {
                              setHolidayToEdit(item);
                              setShowAddModal(true);
                            } 
                          }}
                        >
                  
                  <div className="holiday-card-top">
                    {/* Date Block */}
                    <div className={`holiday-date-badge ${status.type === "upcoming" ? "upcoming" : ""}`}>
                      <span className="holiday-date-month">{month}</span>
                      <span className="holiday-date-day">{day}</span>
                      <span className="holiday-date-year">{year}</span>
                    </div>

                    {/* Content */}
                    <div className="holiday-card-main">
                      <div className="holiday-card-title-row">
                        <div className="holiday-day-tag">
                          <span>{item.Day || "Holiday"}</span>
                          <span className="dot" />
                          <span>{formatDate(item.Date)}</span>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          className="btn-holiday-delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteHoliday(item._id);
                                  }}
                          title="Delete Holiday"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <h3 className="holiday-name">{item.Name}</h3>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="holiday-card-footer">
                    {renderTypeBadge(item.Type)}
                    
                    <span className={`holiday-status-pill ${status.type}`}>
                      <Clock size={12} />
                      <span>{status.label}</span>
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Table View */
        <div className="holidays-table-wrapper">
          {filteredHolidays.length === 0 ? (
            <div className="empty-holidays-box">
              <div className="empty-holidays-icon">
                <CalendarDays size={24} />
              </div>
              <div className="empty-holidays-title">No Holidays Found</div>
              <div className="empty-holidays-sub">
                No holiday records found matching your filters.
              </div>
            </div>
          ) : (
            <table className="holidays-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Holiday Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHolidays.map((item) => {
                  const status = getHolidayStatus(item.Date);
                  return (
                    <tr key={item._id}>
                      <td style={{ fontWeight: 600 }}>
                        {formatDate(item.Date)}
                      </td>
                      <td>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                          {item.Day || "—"}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {item.Name}
                      </td>
                      <td>
                        {renderTypeBadge(item.Type)}
                      </td>
                      <td>
                        <span className={`holiday-status-pill ${status.type}`}>
                          <Clock size={12} />
                          <span>{status.label}</span>
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                      {user?.role === "admin" && (
                            <button
                              type="button"
                              className="btn-add-holiday-primary"
                              style={{ marginTop: "12px" }}
                              onClick={() => setShowAddModal(true)}
                            >
                              <Plus size={15} />
                              <span>Add First Holiday</span>
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Holiday Modal */}
          {showAddModal && (
        <AddHolidayModal
          holidayToEdit={holidayToEdit}
          onClose={() => {
            setShowAddModal(false);
            setHolidayToEdit(null);
          }}
          onSubmit={(data) => {
            if (holidayToEdit) {
              handleUpdateHoliday(holidayToEdit._id, data);
            } else {
              handleAddHoliday(data);
            }
          }}
        />
      )}

    </div>
  );
}
