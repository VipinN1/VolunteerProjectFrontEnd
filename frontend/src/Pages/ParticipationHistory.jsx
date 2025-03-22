import React, { useState, useEffect } from "react";
import "./ParticipationHistory.css";

const ParticipationHistory = () => {
    const [history, setHistory] = useState([]);
    const loggedID = sessionStorage.getItem("auth-token");

    // Fetch volunteer history from backend
    useEffect(() => {
        fetch("http://localhost:5000/api/volunteer-history")
            .then((response) => response.json())
            .then((data) => setHistory(data))
            .catch((error) => console.error("Error fetching participation history:", error));
    }, []);
    

    return (
        <div className="history-container">
            <title>Volunteer Site - Participation History</title>
            <h2>Volunteer Participation History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Required Skills</th>
                        <th>Urgency</th>
                        <th>Event Date</th>
                        <th>Match Date</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? (
                        history.filter(event => event.userID !== loggedID)
                        .map((event) => (
                            <tr key={event.id}>
                                <td>{event.EventName}</td>
                                <td>{event.Description}</td>
                                <td>{event.Location}</td>
                                <td>{event.RequiredSkills}</td>
                                <td>{event.UrgencyLevel}</td>
                                <td>{new Date(event.EventDate).toLocaleDateString()}</td>
                                <td>{new Date(event.MatchDate).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No participation history available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ParticipationHistory;
