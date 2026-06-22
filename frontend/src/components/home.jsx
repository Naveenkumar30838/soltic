import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import axios from "axios";

export default function Home() {
const navigate = useNavigate();
const BASE_URL = import.meta.env.VITE_BASE_URL;

const checkAuth = async () => {
  try {

    const res = await axios.get(
      `${BASE_URL}/auth`,
      {
        withCredentials: true
      }
    );

    return res.data;

  } catch (err) {

    return {
      authenticated: false
    };

  }
};

const startPlanning = async () => {

  try {

    const auth = await checkAuth();

    if (!auth.authenticated) {
      return navigate("/login");
    }

    const res = await axios.post(
      `${BASE_URL}/chat/create`,
      {},
      {
        withCredentials: true
      }
    );

    navigate(`/chat/${res.data.chatId}`);

  } catch (err) {

    console.log(err);

  }
};

const openProfile = async () => {

  try {

    const auth = await checkAuth();

    if (!auth.authenticated) {
      return navigate("/login");
    }

    navigate(`/profile/${auth.username}`);

  } catch (err) {

    console.log(err);

  }
};
return ( <div className="home">

<nav className="navbar">

  <div
    className="navbar-logo"
    onClick={() => navigate("/")}
  >
    SOLTIC
  </div>

  <div className="navbar-right">

    <button
      className="navbar-start-btn"
      onClick={startPlanning}
    >
      Start Planning
    </button>

    <button
      className="profile-btn"
      onClick={openProfile}
    >
      Profile
    </button>

  </div>

</nav>
  <section className="hero">
    <div className="hero-content">
      <h1>
        Plan Smarter. Travel Better.
      </h1>

      <p>
        Soltic is your AI-powered travel companion that helps you
        plan trips, generate personalized travel roadmaps,
        manage itineraries, and guide you throughout your journey.
      </p>

      
    </div>

    <div className="hero-image">
      <div className="hero-card">
        ✈️ Delhi → Kashmir
        <span>AI Guided Journey</span>
      </div>
    </div>
  </section>

  <section className="features">
    <h2>What Soltic Can Do</h2>

    <div className="feature-grid">

      <div className="feature-card">
        <h3>🗺 Smart Trip Planning</h3>
        <p>
          Create complete travel plans tailored to your
          budget, duration, and travel preferences.
        </p>
      </div>

      <div className="feature-card">
        <h3>🤖 AI Travel Assistant</h3>
        <p>
          Chat naturally with Soltic and get destination,
          accommodation, and activity recommendations.
        </p>
      </div>

      <div className="feature-card">
        <h3>📋 Dynamic Roadmaps</h3>
        <p>
          Generate structured travel roadmaps that can be
          edited and customized before your trip begins.
        </p>
      </div>

      <div className="feature-card">
        <h3>🚆 Live Trip Guidance</h3>
        <p>
          Receive step-by-step assistance from departure
          to arrival during your trip.
        </p>
      </div>

    </div>
  </section>

  <section className="workflow">
    <h2>How It Works</h2>

    <div className="steps">

      <div className="step">
        <span>1</span>
        <h3>Create a Trip</h3>
        <p>Add destination, dates, budget, and travel details.</p>
      </div>

      <div className="step">
        <span>2</span>
        <h3>Generate Roadmap</h3>
        <p>Let Soltic build a personalized travel plan.</p>
      </div>

      <div className="step">
        <span>3</span>
        <h3>Customize</h3>
        <p>Edit and refine your itinerary before departure.</p>
      </div>

      <div className="step">
        <span>4</span>
        <h3>Start Trip</h3>
        <p>Get real-time guidance and recommendations.</p>
      </div>

    </div>
  </section>

  <section className="cta">
    <h2>Ready For Your Next Adventure?</h2>

    <p>
      Plan, organize, and experience your trips with AI assistance.
    </p>

    <button
      className="primary-btn"
      onClick={startPlanning}
    >
      Get Started
    </button>
  </section>

  <footer className="footer">
    <h3>Soltic</h3>
    <p>Your Intelligent Travel Companion</p>
  </footer>

</div>


);
}
