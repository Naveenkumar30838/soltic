import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", formData, {
        withCredentials: true, // Important for session cookies
      });

      if (response.data.status === "success") {
        navigate("/chat");
      } else if (response.data.status === "already_logged_in") {
        setError("User already logged in from another session.");
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p>Please log in to your account</p>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="signup-link">
          Don’t have an account?{" "}
          <span
            className="signup-link-text"
            onClick={() => navigate("/signup")}
            style={{ color: "#007bff", cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
