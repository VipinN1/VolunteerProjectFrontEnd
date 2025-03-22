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

// Event Management
app.get("/api/events", (req, res) => {
    connection.query("SELECT * FROM Events", (err, results) => {
      if (err) {
        console.error("Error fetching events:", err);
        return res.status(500).json({ message: "Server error" });
      }
      
      const events = results.map(event => ({
        ...event,
        requiredSkills: event.RequiredSkills ? event.RequiredSkills.split(",") : []
      }));
      res.json(events);
    });
  });
  
  app.post("/api/events", (req, res) => {
    const { name, description, location, requiredSkills, urgency, date } = req.body;
    if (!name || !description || !location || !requiredSkills || !urgency || !date) {
      return res.status(400).json({ message: "All fields (name, location, requiredSkills, urgency, date) are required." });
    }
    if (!Array.isArray(requiredSkills)) {
      return res.status(400).json({ message: "Required Skills must be an array." });
    }
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "Invalid date format." });
    }
    const skillsStr = requiredSkills.join(",");
    const sql = `
      INSERT INTO Events (EventName, Description, Location, RequiredSkills, UrgencyLevel, EventDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    connection.query(sql, [name, description, location, skillsStr, urgency, date], (err, result) => {
      if (err) {
        console.error("Error creating event:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(201).json({ id: result.insertId, name, description, location, requiredSkills, urgency, date });
    });
  });
  
  // Volunteer Matching  
  app.post("/api/match", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Get volunteer record from Users
    connection.query("SELECT * FROM Users WHERE Email = ?", [email], (err, userResults) => {
      if (err) {
        console.error("Error fetching volunteer:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (userResults.length === 0) {
        return res.status(404).json({ message: "Volunteer not found" });
      }
      const volunteer = userResults[0];
      
      connection.query("SELECT Skill FROM UserSkills WHERE UserID = ?", [volunteer.UserID], (err, skillResults) => {
        if (err) {
          console.error("Error fetching skills:", err);
          return res.status(500).json({ message: "Server error" });
        }
        const volunteerSkills = skillResults.map(r => r.Skill);
        // Get availability
        connection.query("SELECT AvailableDate FROM UserAvailability WHERE UserID = ?", [volunteer.UserID], (err, availResults) => {
          if (err) {
            console.error("Error fetching availability:", err);
            return res.status(500).json({ message: "Server error" });
          }
          const availability = availResults.map(r => new Date(r.AvailableDate).toISOString().split("T")[0]);
          // Get all events
          connection.query("SELECT * FROM Events", (err, eventResults) => {
            if (err) {
              console.error("Error fetching events:", err);
              return res.status(500).json({ message: "Server error" });
            }
            const events = eventResults.map(event => ({
              ...event,
              requiredSkills: event.RequiredSkills ? event.RequiredSkills.split(",") : [],
              // Format event date
              EventDate: new Date(event.EventDate).toISOString().split("T")[0]
            }));
            const normalize = str => str.toLowerCase().replace(/\s/g, "");
            const matchingEvents = events.filter(evt => {
              const skillMatch = evt.requiredSkills.every(skill =>
                volunteerSkills.map(s => normalize(s)).includes(normalize(skill))
              );
              const dateMatch = availability.includes(evt.EventDate);
              return skillMatch && dateMatch;
            });
            res.json({ volunteer: { ...volunteer, skills: volunteerSkills, availability }, matchingEvents });
          });
        });
      });
    });
  });

  // Volunteer populating array
app.get("/api/volunteers", (req, res) => {
    connection.query("SELECT * FROM Users", (err, userResults) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (userResults.length === 0) return res.json([]);
      
      const volunteers = [];
      let completed = 0;
      userResults.forEach(user => {
        
        connection.query("SELECT Skill FROM UserSkills WHERE UserID = ?", [user.UserID], (err, skillResults) => {
          if (err) {
            console.error("Error fetching skills:", err);
            return res.status(500).json({ message: "Server error" });
          }
          
          connection.query("SELECT AvailableDate FROM UserAvailability WHERE UserID = ?", [user.UserID], (err, availResults) => {
            if (err) {
              console.error("Error fetching availability:", err);
              return res.status(500).json({ message: "Server error" });
            }
            const skills = skillResults.map(row => row.Skill);
            const availability = availResults.map(row => new Date(row.AvailableDate).toISOString().split("T")[0]);
            volunteers.push({
              UserID: user.UserID,
              Username: user.Username,
              Email: user.Email,
              skills,
              availability
            });
            completed++;
            if (completed === userResults.length) {
              res.json(volunteers);
            }
          });
        });
      });
    });
  });  

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;
