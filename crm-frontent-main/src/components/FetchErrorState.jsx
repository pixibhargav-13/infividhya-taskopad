import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import "./FetchErrorState.css";

export default function FetchErrorState({ title, message, onRetry, isRetrying }) {
  return (
    <div className="fetch-error-box">
      <div className="fetch-error-icon-circle">
        <AlertCircle size={28} />
      </div>
      <h3 className="fetch-error-heading">{title}</h3>
      <p className="fetch-error-subtext">
        {message || "The server is taking too long to respond (15s limit) or could not be reached. Click below to try again."}
      </p>
      {onRetry && (
        <button 
          type="button"
          className="btn-refresh-fetch"
          onClick={onRetry}
          disabled={isRetrying}
        >
          <RefreshCw size={15} className={isRetrying ? "spin-icon" : ""} />
          <span>{isRetrying ? "Refreshing..." : "Try to refresh"}</span>
        </button>
      )}
    </div>
  );
}
