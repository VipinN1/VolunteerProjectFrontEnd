const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let storedProfile = {
    fullName: "John Doe",
    address1: "2331 Apple street",
    address2: "",
    city: "Houston",
    state: "TX",
    zipCode: "33213",
    skills: ["Teaching", "Medical Aid", "Fundraising"],
    preferences: "Weekends through May",
    availability: ["2025-03-10", "2025-03-15"],
};

// Fetch users
app.get("/api", (req, res) => {
    res.json({ users: ["userOne", "UserTwo", "UserThree"] });
});

// Fetch profile data
app.get("/api/profile", (req, res) => {
    res.json(storedProfile);
});

// Save profile data
app.post("/api/profile", (req, res) => {
    storedProfile = req.body;
    res.json({ message: "Profile updated successfully", profile: storedProfile });
});


// Hardcoded notifications
const notifications = [
    { eventName: "Community Cleanup", message: "Reminder: Event this Saturday!", date: "2025-03-10" },
    { eventName: "Blood Donation Camp", message: "Update: New location assigned.", date: "2025-03-15" },
];

app.get("/api/notifications", (req, res) => {
    res.json(notifications);
});

app.post("/api/notifications", (req, res) => {
    const { eventName, message, date } = req.body;
    if (!eventName || !message || !date) {
        return res.status(400).json({ error: "All fields are required." });
    }

    if (message.length < 5) {
        return res.status(400).json({ error: "Message must be at least 5 characters long." });
    }

    const newNotification = { eventName, message, date };
    notifications.push(newNotification);
    res.status(201).json({ message: "Notification added successfully!", newNotification });
});

//hardcoded volunteer history data
const volunteerHistory = [
    { id: 1, eventName: "Food Drive", description: "Helping the needy", location: "NYC", skills: "Cooking", urgency: "High", eventDate: "2024-03-15", status: "Completed" },
    { id: 2, eventName: "Tree Planting", description: "Environmental Event", location: "LA", skills: "Gardening", urgency: "Medium", eventDate: "2024-04-10", status: "Upcoming" },
];


app.get("/api/volunteer-history", (req, res) => {
    res.json(volunteerHistory);
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

module.exports = app;
