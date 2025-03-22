import React, { useState, useEffect } from "react";
import "./ParticipationHistory.css";

const ParticipationHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/volunteer-history")
            .then((response) => response.json())
            .then((data) => setHistory(data))
            .catch((error) => console.error("Error fetching participation history:", error));
    }, []);

    return (
        <div className="history-container">
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
                        history.map((event, index) => (
                            <tr key={index}>
                                <td>{event.EventName}</td>
                                <td>{event.Description}</td>
                                <td>{event.Location}</td>
                                <td>{event.RequiredSkills}</td>
                                <td>{event.UrgencyLevel}</td>
                                <td>{event.EventDate}</td>
                                <td>{event.MatchDate}</td>
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
