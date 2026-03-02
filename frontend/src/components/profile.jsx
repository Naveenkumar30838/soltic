import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./profile.css";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { username } = useParams();

  // STATES
  const [profile, setProfile] = useState(null);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // AUTH CHECK 
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/`, {
          withCredentials: true,
        });
        console.log("We are Here in Profile.jsx/verifySession")
        console.log('And response is : ' , res.data);
        if (!res.data || res.data.authenticated !== true) {
          return navigate("/login");
        }
      } catch (err) {
        consol.log("Error in Verify Session")
        return navigate("/login");
      }
    };

    verifySession();
  }, []);

useEffect(() => {
  const loadProfileData = async () => {
    try {

      const p = await axios.get(`${BASE_URL}/profile/${username}`);
      const t = await axios.get(`${BASE_URL}/profile/${username}/trips`);
      const c = await axios.get(`${BASE_URL}/chats/${username}`);
      if (
        p.data?.status === "not_logged_in" ||
        t.data?.status === "not_logged_in" ||
        c.data?.status === "not_logged_in"
      ) {
        return navigate("/login");
      }

      setProfile(p.data.data);
      setUpcomingTrips(t.data.upcoming || []);
      setPastTrips(t.data.past || []);
      setChats(c.data.chats || []);

      setLoading(false);
    } catch (error) {

      console.error("Error loading profile:", error);
      setLoading(false);
    }
  };

  loadProfileData();
}, [username]);

const handleDeleteChat = async (chatId) => {
  if (!window.confirm("Are you sure you want to delete this chat?")) return;

  try {
    await axios.delete(`${BASE_URL}/c/${chatId}`, { withCredentials: true });
    // Remove deleted chat from UI instantly
    setChats((prev) => prev.filter((ch) => ch.id !== chatId));
  } catch (err) {
    console.error("Chat delete error:", err);
    alert("Failed to delete chat.");
  }
};

 const handleNewChat = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/chat/create`, { withCredentials:true });
      if (res.data) {
        navigate(`/chat/${res.data.chatId}`);
      }
    } catch (err) {
      console.error("Error creating new chat:", err);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete this Profile?")) return;
    const res = await axios.delete(`${BASE_URL}/profile/${username}`);
    if(!res.status =="success"){
      window.alert("Profile Delete Failed");
      return;
    }
    navigate(`/signup`);
  };
  const handleViewTrip = async (tripId)=>{
    navigate(`/trip/${tripId}`)
  }

  const handleDeleteTrip = async (tripId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${BASE_URL}/trips/${tripId}`, {
        withCredentials: true,
      });

      if (res.data.status === "success") {
        // Remove the deleted trip from both lists
        setUpcomingTrips((prev) => prev.filter((t) => t.ID !== tripId));
        setPastTrips((prev) => prev.filter((t) => t.ID !== tripId));
        alert("Trip deleted successfully!");
      } else {
        alert("Failed to delete trip.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("An error occurred while deleting the trip.");
    }
  };

  const handleLogout = async () => {
    const res = await axios.post(`${BASE_URL}/logout`)
    navigate("/login");
  };


  if (loading) return <div className="loading">Loading Profile...</div>;

  return (
    <div className="profile-container">

      <div className="profile-header">
        <h2 className="profile-title">{username}</h2>

        <div className="profile-header-buttons">
          <button className="btn btn-new-chat" onClick={handleNewChat}>
            New Chat
          </button>
          <button className="btn btn-add-trip" onClick={() => navigate("/addTrip")}>
            Add Trip
          </button>

          <button className="btn btn-delete" onClick={handleDeleteProfile}>
            Delete Profile
          </button>

          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      {/* USER PROFILE BOX */}
      <div className="profile-box">
        <h2>Profile Information</h2>

        {profile ? (
          <div className="profile-details-grid">
        <p><b>Name:</b> {profile.NAME}</p>
        <p><b>Username:</b> {profile.USERNAME}</p>
        <p><b>Country:</b> {profile.COUNTRY}</p>
        <p><b>Age:</b> {profile.AGE}</p>
        <p><b>Email:</b> {profile.EMAIL}</p>
        <p><b>Mobile:</b> {profile.MOB}</p>
        <p><b>Profession:</b> {profile.PROFESSIONN}</p>
        <p><b>Bio:</b> {profile.BIO}</p>
      </div>
      ) : (
        <p>No profile found.</p>
        )}
      </div>

      {/* UPCOMING TRIPS */}
      <div className="trip-section">
        <h2>Upcoming Trips</h2>

        {upcomingTrips.length === 0 ? (
          <p>No upcoming trips.</p>
        ) : (
          upcomingTrips.map((trip) => (
            <div key={trip.ID} className="trip-card">
              <p><b>From:</b> {trip.STARTLOC}</p>
              <p><b>To:</b> {trip.ENDLOC}</p>
              <p><b>Start:</b> {trip.STARTDATE}</p>
              <p><b>End:</b> {trip.ENDDATE}</p>
              <p><b>Cost:</b> {trip.COST}</p>
              <p><b>No of Person :</b>{trip.TRAVELLERSCOUNT}</p>
              <div className="tripButtons">
                <button onClick={() => handleViewTrip(trip.ID)}
                      className="btn view-trip"
                >
                      View Trip
                </button><button onClick={() => handleDeleteTrip(trip.ID)}
                      className="btn trip-delete"
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#c0392b")}
                >
                      Delete Trip
                </button>
              </div>
              
            </div>
          ))
        )}
      </div>

      {/* PAST TRIPS */}
      <div className="trip-section">
        <h2>Past Trips</h2>

        {pastTrips.length === 0 ? (
          <p>No past trips.</p>
        ) : (
          pastTrips.map((trip) => (
            <div key={trip.ID} className="trip-card">
              <p><b>From:</b> {trip.STARTLOC}</p>
              <p><b>To:</b> {trip.ENDLOC}</p>
              <p><b>Start:</b> {trip.STARTDATE}</p>
              <p><b>End:</b> {trip.ENDDATE}</p>
              <p><b>Rating:</b> {trip.RATING}</p>
              <div className="tripButtons">
                <button onClick={()=>{handleViewTrip(trip.ID)}}
                      className="btn view-trip"
                >
                      View Trip
                </button>
                <button onClick={() => handleDeleteTrip(trip.ID)}
                      className="btn trip-delete"
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#c0392b")}
                >
                      Delete Trip
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-section">
        <h2>Chat History</h2>

        {chats.length === 0 ? (
          <p>No chats found.</p>
        ) : (
          <div className="chat-list-scroll">
            {chats.map((ch) => (
              <div key={ch.id} className="chat-card chat-item">

                <Link to={`/chat/${ch.id}`} className="chat-link">
                  {ch.id}
                </Link>
                <p> {ch.updatedAt}</p>
                <button
                  className="delete-chat-btn"
                  onClick={() => handleDeleteChat(ch.id)}
                >
                  Delete
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
