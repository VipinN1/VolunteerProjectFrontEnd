const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let storedLogins = {
    usernames: ["John Doe"],
    emails: ["johndoe@gmail.com"],
    passwords: ["tree113"]
}

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

// Fetch stored logins
app.get("/api/register", (req, res) => {
    res.json(storedLogins);
});

// Save registered login
app.post("/api/register", (req, res) => {
    storedLogins["usernames"].push(req.body.username);
    storedLogins["passwords"].push(req.body.password);
    storedLogins["emails"].push(req.body.email);
    console.log(storedLogins);
    res.json({message: "Registered new user successfully", profile: storedLogins});
});

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

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

module.exports = app; // Export app for testing
