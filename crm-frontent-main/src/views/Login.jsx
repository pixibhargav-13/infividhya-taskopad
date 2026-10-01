import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import "../styles/Auth.css";
import API from "../api/api";

export default function Login({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
        setError("Please enter email and password");
        return;
    }

    try {
        const response = await API.post("/auth/login", {
            email,
            password
        });

        console.log("Login successful:", response.data);

        localStorage.setItem("token", response.data.accesstoken);
        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );

        onAuthSuccess();
        navigate("/tasks");

    } catch (error) {
        console.log("Error during login:", error);

        setError(
            error.response?.data?.message ||
            "Invalid email or password"
        );
    }
};

  return (
    <div className="auth-page-container">
      <div className="auth-window-card">
        
        {/* LEFT DECORATIVE GRAPHIC PANEL */}
        <div className="auth-hero-side">
          <div className="hero-header-nav">
            <span className="hero-brand-logo">CRM INFIVIDHYA</span>
            <button className="btn-hero-back" onClick={() => navigate("/tasks")}>
              <span>Back to application</span>
              <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="hero-caption-block">
            <h2 className="hero-caption-title">Welcome Back to<br />Infividhy CRM</h2>
            <div className="hero-carousel-indicators">
              <div className="carousel-dot active" />
              <div className="carousel-dot" />
              <div className="carousel-dot" />
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN FORM PANEL */}
        <div className="auth-form-side">
          <div className="auth-form-header">
            <h1>Log In</h1>
            <p className="auth-form-subtext">
              Don't have an account?
              <Link to="/register" className="auth-link">Create account</Link>
            </p>
          </div>

          <form className="main-auth-form" onSubmit={handleLoginSubmit}>
            {error && (
              <div className="auth-error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <input 
              type="email" 
              placeholder="Email address" 
              className="auth-form-field"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
            />

            <div className="auth-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                className="auth-form-field"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                style={{ paddingRight: "44px" }}
              />
              <button 
                type="button" 
                className="auth-field-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className="btn-auth-primary-submit">Log In</button>
          </form>
{/* 
          <div className="auth-oauth-divider">Or authenticate with</div>

          <div className="oauth-button-container">
            <button type="button" className="btn-oauth-apple">
              <span style={{ fontSize: "16px", lineHeight: 1 }}></span>
              <span>Google Account</span>
            </button>
          </div> */}
        </div>

      </div>
    </div>
  );
}