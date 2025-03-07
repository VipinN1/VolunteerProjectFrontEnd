const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let storedProfile = { // Temporary storage for the profile data
    fullName: "John Doe",
    address1: "2331 Apple street",
    address2: "",
    city: "Houston",
    state: "TX",
    zipCode: "33213",
    skills: ["Teaching", "Medical Aid", "Fundraising"],
    preferences: "Weekends through May",
    availability: ["2025-03-10", "2025-03-15"]
};

// Endpoint to fetch the profile
app.get("/api/profile", (req, res) => {
    res.json(storedProfile);
});

// Endpoint to save/update the profile
app.post("/api/profile", (req, res) => {
    storedProfile = req.body; // Store new profile data
    res.json({ message: "Profile updated successfully", profile: storedProfile });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
