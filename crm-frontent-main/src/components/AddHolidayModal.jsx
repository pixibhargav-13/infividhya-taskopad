import React, { useState , useEffect} from "react";
import { 
  X, 
  Calendar, 
  Sun, 
  PartyPopper, 
  Building2, 
  Layers, 
  Sparkles, 
  AlertCircle 
} from "lucide-react";
import "../styles/Holidays.css";

/**
 * AddHolidayModal Component
 * 
 * Directly matches the Backend Holiday Model schema:
 * - Name: String (required)
 * - Date: Date (required)
 * - Day: String (e.g. "Monday", "Tuesday")
 * - Type: enum ["public", "religious", "company", "optional", "special"] (required)
 */
export default function AddHolidayModal({ onClose, onSubmit , holidayToEdit }) {
  const [Name, setName] = useState("");
  const [DateVal, setDateVal] = useState("");
  const [Day, setDay] = useState("");
  const [Type, setType] = useState("public");
  const [error, setError] = useState("");

  const HOLIDAY_TYPES = [
    { id: "public", label: "Public", icon: Sun },
    { id: "religious", label: "Religious", icon: PartyPopper },
    { id: "company", label: "Company", icon: Building2 },
    { id: "optional", label: "Optional", icon: Layers },
    { id: "special", label: "Special", icon: Sparkles },
  ];

  // Helper to calculate weekday name from Date string
  const handleDateChange = (val) => {
    setDateVal(val);
    setError("");
    if (val) {
      try {
        const [year, month, day] = val.split("-").map(Number);
        const d = new Date(year, month - 1, day);
        const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
        setDay(dayName);
      } catch {
        setDay("");
      }
    } else {
      setDay("");
    }
  };
  
useEffect(() => {
  if (holidayToEdit) {
    setName(holidayToEdit.Name);
    setDateVal(holidayToEdit.Date?.split("T")[0]);
    setDay(holidayToEdit.Day);
    setType(holidayToEdit.Type);
  } else {
    setName("");
    setDateVal("");
    setDay("");
    setType("");
  }
}, [holidayToEdit]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!Name.trim()) {
      setError("Please enter the holiday name.");
      return;
    }
    if (!DateVal) {
      setError("Please select a valid date for the holiday.");
      return;
    }
    if (!Type) {
      setError("Please select a holiday type.");
      return;
    }

    const payload = {
      Name: Name.trim(),
      Date: DateVal,
      Day: Day,
      Type: Type
    };

    onSubmit(payload);
  };

  return (
    <div className="holiday-modal-backdrop" onClick={onClose}>
      <div className="holiday-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="holiday-modal-header">
          <h2>Add New Holiday</h2>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="holiday-error-alert">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="holiday-modal-form">
          {/* Holiday Name */}
          <div className="holiday-form-group">
            <label className="holiday-form-label">HOLIDAY NAME</label>
            <input
              type="text"
              className="holiday-input-field"
              placeholder="e.g. Republic Day, Independence Day, Diwali"
              value={Name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          {/* Date & Auto Day */}
          <div className="holiday-dates-row">
            <div className="holiday-form-group">
              <label className="holiday-form-label">HOLIDAY DATE</label>
              <input
                type="date"
                className="holiday-input-field"
                value={DateVal}
                onChange={(e) => handleDateChange(e.target.value)}
                required
              />
            </div>

            <div className="holiday-form-group">
              <label className="holiday-form-label">DAY OF WEEK</label>
              <input
                type="text"
                className="holiday-input-field readonly"
                placeholder="Auto-calculated"
                value={Day}
                readOnly
              />
            </div>
          </div>

          {/* Holiday Type Selector */}
          <div className="holiday-form-group">
            <label className="holiday-form-label">HOLIDAY TYPE</label>
            <div className="holiday-types-grid">
              {HOLIDAY_TYPES.map((t) => {
                const IconComponent = t.icon;
                const isSelected = Type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`holiday-type-choice-btn ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setType(t.id);
                      setError("");
                    }}
                  >
                    <IconComponent size={16} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="holiday-modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-submit">
  {holidayToEdit ? "Update Holiday" : "Create Holiday"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
