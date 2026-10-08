import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import "../styles/Auth.css";
import API from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegisterSubmit = async (e) => {

    try
    {
      e.preventDefault();
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        setError("All form data fields are required");
        return;
      }
      if (password.length < 6) {
        setError("Password length must be at least 6 characters");
        return;
      }
        const response = await API.post("/auth/register", {
            firstName,
            lastName,
            email,
            password
        });
        console.log("Registration successful:", response.data);

      navigate("/login");
    }
    catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred during registration. Please try again.");
    }

    console.log("Submitting Register Payload to authController:", { firstName, lastName, email, password });
    
    // Simulate successful registration creation route hook
   
  };

  return (
    <div className="auth-page-container">
      <div className="auth-window-card">
        
        {/* LEFT DECORATIVE GRAPHIC PANEL */}
        <div className="auth-hero-side">
          <div className="hero-header-nav">
            <span className="hero-brand-logo">CRM INFIVIDHYA</span>
            {/* UPDATED: Redirects straight back to the login page */}
            <button className="btn-hero-back" onClick={() => navigate("/login")}>
              <LogIn size={14} />
              <span>Back to login</span>
            </button>
          </div>
          
          <div className="hero-caption-block">
            <h2 className="hero-caption-title">Capturing Moments,<br />Creating Memories</h2>
            <div className="hero-carousel-indicators">
              <div className="carousel-dot" />
              <div className="carousel-dot" />
              <div className="carousel-dot active" />
            </div>
          </div>
        </div>

        {/* RIGHT REGISTRATION SCHEMAS PANEL */}
        <div className="auth-form-side">
          <div className="auth-form-header">
            <h1>Create an account</h1>
            <p className="auth-form-subtext">
              Already have an account? 
              <Link to="/login" className="auth-link">Log in</Link>
            </p>
          </div>

          <form className="main-auth-form" onSubmit={handleRegisterSubmit}>
            {error && (
              <div className="auth-error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-form-row-grid">
              <input 
                type="text" 
                placeholder="First name" 
                className="auth-form-field"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setError(""); }}
              />
              <input 
                type="text" 
                placeholder="Last name" 
                className="auth-form-field"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setError(""); }}
              />
            </div>

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

            <div className="auth-checkbox-row">
              <input type="checkbox" id="termsBox" className="auth-checkbox-native" defaultChecked />
              <label htmlFor="termsBox" className="auth-checkbox-label">I agree to the Terms & Conditions</label>
            </div>

            <button type="submit" className="btn-auth-primary-submit">Create account</button>
          </form>

          {/* <div className="auth-oauth-divider">Or register with</div>

          <div className="oauth-button-container">
            <button type="button" className="btn-oauth-apple">
              <span style={{ fontSize: "16px", lineHeight: 1 }}></span>
              <span>Apple Workspace</span>
            </button>
          </div> */}
        </div>

      </div>
    </div>
  );
}