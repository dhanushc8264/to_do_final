import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';
const base_url = import.meta.env.VITE_BASE_URL;
function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const response = await axios.post(`${base_url}/api/auth/login`, formData);
      
      localStorage.setItem("token", response.data.token); // ✅ Store JWT token
      
      window.location.href = "/"; // ✅ Reload page after login to fetch new tasks
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="logo">
        <span className="logo-icon">✓</span> TaskVault
      </div>
      <h2>Welcome Back</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          autoComplete="email"
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          autoComplete="current-password"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>Don't have an account? <a href="/register">Create Account</a></p>
    </div>
  );
}

export default Login;