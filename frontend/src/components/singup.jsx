import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    country: "",
    age: "",
    email: "",
    mob: "",
    joiningDate: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Send signup request to backend
      const response = await axios.post("http://localhost:5000/signup", formData, {
        withCredentials: true, // for session cookies
      });

      // ✅ Check backend response
      if (response.data?.status === "signup_success") {
        navigate("/chat");
      } else {
        setErrorMsg(response.data?.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMsg("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Fill in your details to join Soltic</p>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Enter your country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="mob">Mobile Number</label>
          <input
            type="tel"
            id="mob"
            name="mob"
            placeholder="Enter your mobile number"
            value={formData.mob}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit mobile number"
          />
        </div>

        <div className="input-group">
          <label htmlFor="joiningDate">Joining Date</label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <span
            className="login-link-text"
            onClick={() => navigate("/login")}
            style={{ color: "#007bff", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
