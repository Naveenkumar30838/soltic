import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";
import "./trip.css";
export default function Trip (){
    const navigate = useNavigate();
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const {tripId : tripId}= useParams();
   
    const [trip, setTrip] = useState(null);
    const [plan, setplan]= useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editPrompt, setEditPrompt] = useState("");
    const [updatingPlan, setUpdatingPlan] = useState(false);

    useEffect(() => {
        const fetchTripData = async () => {
            try {
                setLoading(true);
                 const res = await axios.get(`${BASE_URL}/trip/${tripId}`)
                console.log("Trip Details Fetched Successfully From Backend. Details : " , res);
                // Set the state with the data object you provided
                setTrip(res.data.tripDetails); 
                setplan(res.data.plan);
            } catch (err) {
                setError("Failed to fetch trip details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTripData();
    }, []); 

    // format dates
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div>Loading Trip Details...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!trip) return <div>No trip found.</div>;
    const handleEditPlan = async () => {

  try {

    setUpdatingPlan(true);

    const res = await axios.put(
      `${BASE_URL}/trip/${tripId}/edit-plan`,
      {
        editPrompt
      },
      {
        withCredentials: true
      }
    );

    if (res.data.status === "success") {

      setplan(res.data.plan);

      setShowEditModal(false);

      setEditPrompt("");

    } else {

      alert(res.data.message);

    }

  } catch (err) {

    console.log(err);
    alert("Failed to update plan");

  } finally {

    setUpdatingPlan(false);

  }
};
// Simple internal styling
const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '20px auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #eee',
        marginBottom: '20px',
        paddingBottom: '10px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px'
    },
    item: {
        fontSize: '16px',
        lineHeight: '1.5'
    },
    badge: {
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#1976d2'
    }};
    
    return (

  <div className="trip-page">

{/*  NAVBAR  */}
<nav className="trip-navbar">
  <div
    className="trip-logo"
    onClick={() => navigate("/")}
  >
    SOLTIC
  </div>

  <div className="trip-nav-links">
    <button onClick={() => navigate("/")}>
      Home
    </button>

    <button
      onClick={() => navigate(`/profile/${trip.USERNAME}`)}
    >
      Profile
    </button>
  </div>
</nav>

{/*  HERO HEADER  */}
<div className="trip-header">

  <div className="trip-header-content">
    <span className="trip-header-label">
      AI Travel Roadmap
    </span>

    <h1>
      {trip.STARTLOC} → {trip.ENDLOC}
    </h1>

    <p>
      {formatDate(trip.STARTDATE)}
      {" • "}
      {formatDate(trip.ENDDATE)}
    </p>
  </div>

  <span className={`trip-status ${trip.STATUS}`}>
    {trip.STATUS}
  </span>

</div>

{/*  QUICK STATS  */}
<div className="trip-stats">

  <div className="stat-card">
    <h4>Budget</h4>
    <p>₹{trip.BUDGET?.toLocaleString() || "N/A"}</p>
  </div>

  <div className="stat-card">
    <h4>Travellers</h4>
    <p>{trip.TRAVELLERSCOUNT}</p>
  </div>

  <div className="stat-card">
    <h4>Rooms</h4>
    <p>{trip.ROOMSCOUNT}</p>
  </div>

  <div className="stat-card">
    <h4>Mode</h4>
    <p>{trip.MODE || "N/A"}</p>
  </div>

</div>

{/*  TRIP INFORMATION  */}

<div className="trip-details-card">

  <div className="trip-details-header">
    <h3>Trip Details</h3>
  </div>

  <div className="trip-grid">

    <div>
      <strong>Trip ID</strong>
      <p>{trip.ID}</p>
    </div>

    <div>
      <strong>Username</strong>
      <p>{trip.USERNAME}</p>
    </div>

    <div>
      <strong>Cost</strong>
      <p>₹{trip.COST?.toLocaleString() || "N/A"}</p>
    </div>

    <div>
      <strong>Rating</strong>
      <p>{trip.RATING || "Pending"}</p>
    </div>

    <div>
      <strong>Created On</strong>
      <p>{formatDate(trip.CREATED_AT)}</p>
    </div>

    <div>
      <strong>Status</strong>
      <p>{trip.STATUS}</p>
    </div>

  </div>

</div>

{/*  ROADMAP  */}
<div className="roadmap-section">

  <div className="roadmap-header">

    <div>
      <h2>Trip Plan</h2>
      <p>
        Review and customize your itinerary before starting the trip.
      </p>
    </div>

    <div className="roadmap-actions">
      <button
        className="primary-btn"
        onClick={() => setShowEditModal(true)}
        >
        Edit Plan
        </button>
    </div>

  </div>

  <div className="timeline">

    {plan?.map((step, index) => (
      <div
        className="timeline-item"
        key={index}
      >

        <div className="timeline-dot"></div>

        <div className="timeline-content">

          <div className="timeline-type">
            {step.type}
          </div>

          <h3>{index + 1}. {step.title}</h3>

          <p>{step.description}</p>

          <div className="timeline-meta">

            <span>
              📍 {step.meta?.location || "Not Specified"}
            </span>

            <span>
              🚆 {step.meta?.mode || "Not Specified"}
            </span>

            <span>
              ⏱ {step.meta?.estTime || "Not Specified"}
            </span>

          </div>

          {step.meta?.bookingLink && (
            <a
              className="timeline-link"
              href={step.meta.bookingLink}
              target="_blank"
              rel="noreferrer"
            >
              View Details
            </a>
          )}


        </div>

      </div>
    ))}

  </div>

  <div className="trip-footer">

    <button className="start-trip-btn">
      Start Trip
    </button>

  </div>

</div>

{
  showEditModal && (
    <div className="modal-overlay">

      <div className="edit-plan-modal">

        <h2>Edit Travel Plan</h2>

        <p>
          Describe the modifications you'd like Soltic to make.
        </p>

        <textarea
          value={editPrompt}
          onChange={(e) => setEditPrompt(e.target.value)}
          placeholder={`Examples:

• Add Gulmarg on Day 2

• Increase budget to ₹60,000

• Add one extra day

• Stay near Dal Lake

• Focus on family activities

• Add local food experiences

• Remove expensive attractions`}
        />

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>

          <button
            className="update-btn"
            onClick={handleEditPlan}
            disabled={updatingPlan}
          >
            {updatingPlan
              ? "Updating..."
              : "Update Plan"}
          </button>

        </div>

      </div>

    </div>
  )
}
  </div>


);


    
};
