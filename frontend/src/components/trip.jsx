import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";

export default function Trip (){
    const navigate = useNavigate();
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const {tripId : tripId}= useParams();
   
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTripData = async () => {
            try {
                setLoading(true);
                 const res = await axios.get(`${BASE_URL}/trip/${tripId}`)
                console.log("Trip Details Fetched Successfully From Backend. Details : " , res);
                // Set the state with the data object you provided
                setTrip(res.data.tripDetails); 
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
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Trip Summary: {trip.STARTLOC} to {trip.ENDLOC}</h2>
                <span style={{...styles.badge, backgroundColor: trip.STATUS === 'scheduled' ? '#e3f2fd' : '#f5f5f5'}}>
                    {trip.STATUS.toUpperCase()}
                </span>
            </div>

            <div style={styles.grid}>
                <div style={styles.item}><strong>Trip ID:</strong> {trip.ID}</div>
                <div style={styles.item}><strong>User:</strong> {trip.USERNAME}</div>
                <div style={styles.item}><strong>Start Date:</strong> {formatDate(trip.STARTDATE)}</div>
                <div style={styles.item}><strong>End Date:</strong> {formatDate(trip.ENDDATE)}</div>
                <div style={styles.item}><strong>Travellers:</strong> {trip.TRAVELLERSCOUNT}</div>
                <div style={styles.item}><strong>Rooms:</strong> {trip.ROOMSCOUNT}</div>
                <div style={styles.item}><strong>Cost:</strong> ₹{trip.COST.toLocaleString()}</div>
                <div style={styles.item}><strong>Travel Mode:</strong> {trip.MODE || 'Not Specified'}</div>
                <div style={styles.item}><strong>Rating:</strong> {trip.RATING || 'Pending'}</div>
                <div style={styles.item}><strong>Created At:</strong> {formatDate(trip.CREATED_AT)}</div>
            </div>
        </div>
    );
    
    
};
