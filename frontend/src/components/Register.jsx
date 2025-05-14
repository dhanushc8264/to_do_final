import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Register.css';

const base_url = import.meta.env.VITE_BASE_URL;

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    
    // Check password strength when password field changes
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength("");
      return;
    }
    
    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axios.post(`${base_url}/api/auth/register`, formData);
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="logo">
        <span className="logo-icon">✓</span> TaskVault
      </div>
      <h2>Create Account</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Full Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          autoComplete="name"
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          autoComplete="email"
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Create Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          autoComplete="new-password"
        />
        {passwordStrength && (
          <div className="password-strength">
            <div className={`password-strength-bar strength-${passwordStrength}`}></div>
          </div>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Register;