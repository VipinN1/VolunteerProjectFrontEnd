const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json()); 
app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "UserTwo", "UserThree"] });
});

app.get("/api/profile", (req, res) => {
    res.json({
        fullName: "John Doe",
        address1: "2331 Apple street",
        address2: "",
        city: "Houston",
        state: "TX",
        zipCode: "33213",
        skills: ["Teaching", "Medical Aid", "Fundraising"],
        preferences: "Weekends through may",
        availability: ["2025-03-10", "2025-03-15"]
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
