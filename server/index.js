const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Fix: Connect to MySQL with proper error handling
const connection = mysql.createConnection({
    host: "localhost",
    user: "local_user",
    password: "pingas",
    database: "volunteerdb"
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Database connected successfully!");
});

// ✅ Fetch user profile by `UserID`
app.get("/api/profile/:userID", (req, res) => {
    const userID = req.params.userID;

    connection.query("SELECT * FROM Users WHERE UserID = ?", [userID], (err, userResults) => {
        if (err) return res.status(500).json({ error: "Database query failed", details: err });
        if (userResults.length === 0) return res.status(404).json({ message: "User not found" });

        const user = userResults[0];

        // Fetch user skills
        connection.query("SELECT Skill FROM UserSkills WHERE UserID = ?", [userID], (err, skillResults) => {
            if (err) return res.status(500).json({ error: "Database query failed", details: err });

            const skills = skillResults.map((s) => s.Skill);

            // Fetch availability
            connection.query("SELECT AvailableDate FROM UserAvailability WHERE UserID = ?", [userID], (err, availabilityResults) => {
                if (err) return res.status(500).json({ error: "Database query failed", details: err });

                const availability = availabilityResults.map((a) => a.AvailableDate);

                res.json({
                    fullName: user.FullName,
                    address1: user.Address1,
                    address2: user.Address2,
                    city: user.City,
                    state: user.State,
                    zipCode: user.ZipCode,
                    skills,
                    preferences: "",
                    availability
                });
            });
        });
    });
});

// ✅ Update user profile
app.post("/api/profile/:userID", (req, res) => {
    const userID = req.params.userID;
    const { fullName, address1, address2, city, state, zipCode, skills, availability } = req.body;

    // Update Users table
    connection.query(
        "UPDATE Users SET FullName = ?, Address1 = ?, Address2 = ?, City = ?, State = ?, ZipCode = ? WHERE UserID = ?",
        [fullName, address1, address2, city, state, zipCode, userID],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Database update failed", details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: "User not found" });

            // Delete and insert skills
            connection.query("DELETE FROM UserSkills WHERE UserID = ?", [userID], () => {
                skills.forEach((skill) => {
                    connection.query("INSERT INTO UserSkills (UserID, Skill) VALUES (?, ?)", [userID, skill]);
                });
            });

            // Delete and insert availability
            connection.query("DELETE FROM UserAvailability WHERE UserID = ?", [userID], () => {
                availability.forEach((date) => {
                    connection.query("INSERT INTO UserAvailability (UserID, AvailableDate) VALUES (?, ?)", [userID, date]);
                });
            });

            res.json({ message: "Profile updated successfully" });
        }
    );
});

// ✅ Start Express Server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;
