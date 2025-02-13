import React, { useState } from "react";
import "./ParticipationHistory.css";

const ParticipationHistory = () => {
    // Sample data for volunteer participation history
    const [history, setHistory] = useState([
        { id: 1, eventName: "Food Drive", description: "Helping the needy", location: "NYC", skills: "Cooking", urgency: "High", eventDate: "2024-03-15", status: "Completed" },
        { id: 2, eventName: "Tree Planting", description: "Environmental Event", location: "LA", skills: "Gardening", urgency: "Medium", eventDate: "2024-04-10", status: "Upcoming" },
    ]);

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
                        <th>Participation Status</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? (
                        history.map((event) => (
                            <tr key={event.id}>
                                <td>{event.eventName}</td>
                                <td>{event.description}</td>
                                <td>{event.location}</td>
                                <td>{event.skills}</td>
                                <td>{event.urgency}</td>
                                <td>{event.eventDate}</td>
                                <td>{event.status}</td>
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
