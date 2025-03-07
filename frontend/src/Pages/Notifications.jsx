import React, { useState, useEffect } from "react";
import "./Notifications.css";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [newNotification, setNewNotification] = useState({ eventName: "", message: "", date: "" });
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/notifications")
            .then((response) => response.json())
            .then((data) => setNotifications(data))
            .catch((error) => console.error("Error fetching notifications:", error));
    }, []);

    const handleChange = (e) => {
        setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newNotification),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setNotifications([...notifications, data.newNotification]);
                    setNewNotification({ eventName: "", message: "", date: "" });
                    setError("");
                }
            })
            .catch((error) => console.error("Error adding notification:", error));
    };

    return (
        <div className="notifications-container">
            <title>Volunteer Site - Notifications</title>
            <h2>🔔 Notification Center</h2>
            {error && <p className="error">{error}</p>}
            
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index} className="notification-item">
                        <strong>{notification.eventName}</strong> - {notification.message}
                        <br />
                        <span className="notification-date">📅 {notification.date}</span>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit} className="notification-form">
                <h3>Add Notification</h3>
                <input type="text" name="eventName" placeholder="Event Name" value={newNotification.eventName} onChange={handleChange} required />
                <input type="text" name="message" placeholder="Message" value={newNotification.message} onChange={handleChange} required />
                <input type="date" name="date" value={newNotification.date} onChange={handleChange} required />
                <button type="submit">Add Notification</button>
            </form>
        </div>
    );
};

export default Notifications;
