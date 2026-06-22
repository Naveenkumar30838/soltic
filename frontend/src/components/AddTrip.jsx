import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddTrip.css";

const AddTrip = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [formData, setFormData] = useState({
    startdate: "",
    startloc: "",
    enddate: "",
    endloc: "",
    roomscount: "",
    cost: "",
    travellerscount: ""
  });

  // VERIFY SESSION

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/`, {
          withCredentials: true,
        });

        if (!res.data.authenticated) return navigate("/login");
      } catch (err) {
        return navigate("/login");
      }
    };

    verify();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.enddate) < new Date(formData.startdate)) {
      alert("End date must be after start date");
      return;
    }

    if (formData.travellerscount < 1) {
      alert("Travellers count must be at least 1");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/trips`, formData, {
        withCredentials: true,
      });

      if (res.data.status === "success") {
        navigate(`/profile/${res.data.username}`);
      } else {
        alert("Failed to add trip.");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="add-trip-container">
      <h2 className="add-trip-title">Add New Trip</h2>

      <form className="trip-form" onSubmit={handleSubmit}>
        <label>Start Date</label>
        <input
          type="date"
          name="startdate"
          value={formData.startdate}
          min={today}
          onChange={handleChange}
          required
        />

        <label>Start Location</label>
        <input
          type="text"
          name="startloc"
          value={formData.startloc}
          onChange={handleChange}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          name="enddate"
          value={formData.enddate}
          min={formData.startdate || today}
          onChange={handleChange}
          required
        />

        <label>End Location</label>
        <input
          type="text"
          name="endloc"
          value={formData.endloc}
          onChange={handleChange}
          required
        />

        <label>Rooms Count</label>
        <input
          type="number"
          name="roomscount"
          value={formData.roomscount}
          onChange={handleChange}
          min={1}
          required
        />

        <label>Cost</label>
        <input
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          min={0}
          step={10}
          required
        />

        <label>Travellers Count</label>
        <input
          type="number"
          name="travellerscount"
          value={formData.travellerscount}
          min={1}
          onChange={handleChange}
          required
        />

        <button type="submit" className="add-trip-btn">Save Trip</button>
      </form>
    </div>
  );
};

export default AddTrip;
