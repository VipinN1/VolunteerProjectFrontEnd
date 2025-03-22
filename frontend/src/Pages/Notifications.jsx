import React, { useState, useEffect } from "react";
import "./Notifications.css";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const loggedID = sessionStorage.getItem("auth-token");

    useEffect(() => {
        fetch("http://localhost:5000/api/notifications")
            .then((response) => response.json())
            .then((data) => setNotifications(data))
            .catch((error) => console.error("Error fetching notifications:", error));
    }, []);

    const calculateDaysLeft = (dateStr) => {
        const today = new Date();
        const eventDate = new Date(dateStr);
        const timeDiff = eventDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysLeft >= 0 ? `${daysLeft} day(s) left` : "Event passed";
    };

    return (
        <div className="notifications-container">
            <title>Volunteer Site - Notifications</title>
            <h2>🔔 Notification Center</h2>
            <ul>
                {notifications.filter(notification => notification.userID !== loggedID)
                .map((notification, index) => (
                    <li key={index} className="notification-item">
                        <strong>{notification.EventName}</strong> - {notification.Message}
                        <br />
                        <span className="notification-date">
                            📅 {new Date(notification.date).toLocaleDateString()} | ⏳ {calculateDaysLeft(notification.date)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;