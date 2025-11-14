import React from "react";
import "./profile.css";

const Profile = ({ profile, trips }) => {
  const today = new Date();

  // Separate trips into upcoming and past
  const pastTrips = trips.filter(
    (trip) => new Date(trip.ENDDATE) < today
  );
  const upcomingTrips = trips.filter(
    (trip) => new Date(trip.STARTDATE) >= today
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>{profile.NAME}</h2>
        <p>@{profile.USERNAME}</p>
        <div className="profile-details">
          <p><strong>Country:</strong> {profile.COUNTRY || "—"}</p>
          <p><strong>Age:</strong> {profile.AGE || "—"}</p>
          <p><strong>Email:</strong> {profile.EMAIL}</p>
          <p><strong>Mobile:</strong> {profile.MOB}</p>
          <p><strong>Joined On:</strong> {profile.JOININGDATE}</p>
        </div>
      </div>

      <div className="trips-section">
        <h3>Upcoming Trips</h3>
        {upcomingTrips.length > 0 ? (
          <div className="trip-list">
            {upcomingTrips.map((trip) => (
              <div key={trip.ID} className="trip-card upcoming">
                <div className="trip-info">
                  <h4>{trip.STARTLOC} → {trip.ENDLOC}</h4>
                  <p>
                    {trip.STARTDATE} — {trip.ENDDATE}
                  </p>
                  <p><strong>Rooms:</strong> {trip.ROOMSCOUNT}</p>
                  <p><strong>Travellers:</strong> {trip.TRAVELLERSCOUNT}</p>
                  <p><strong>Cost:</strong> ₹{trip.COST}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-trips">No upcoming trips</p>
        )}

        <h3>Past Trips</h3>
        {pastTrips.length > 0 ? (
          <div className="trip-list">
            {pastTrips.map((trip) => (
              <div key={trip.ID} className="trip-card past">
                <div className="trip-info">
                  <h4>{trip.STARTLOC} → {trip.ENDLOC}</h4>
                  <p>{trip.STARTDATE} — {trip.ENDDATE}</p>
                  <p><strong>Rooms:</strong> {trip.ROOMSCOUNT}</p>
                  <p><strong>Travellers:</strong> {trip.TRAVELLERSCOUNT}</p>
                  <p><strong>Cost:</strong> ₹{trip.COST}</p>
                </div>
                {trip.RATING && (
                  <div className="trip-rating">
                    <span>⭐ {trip.RATING}/5</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-trips">No past trips</p>
        )}
      </div>
    </div>
  );
};

export default Profile;