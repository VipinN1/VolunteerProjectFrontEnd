const express = require("express");
const cors = require("cors");
const sql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pwdSaltRounds = 10;

const connection = sql.createConnection({
    host:'localhost',
    user:'local_user',
    password:'pingas',
    database:'volunteerdb'
});

const eventRoutes = require("./routes/eventRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
app.use("/api", eventRoutes);
app.use("/api", volunteerRoutes);

let storedLogins = {
    usernames: ["John Doe"],
    emails: ["johndoe@gmail.com"],
    passwords: ["tree113"]
};

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

app.get("/api/register", (req, res) => {
    res.status(200).json(storedLogins);
});

function hashPassword(password) {
    bcrypt.genSalt(pwdSaltRounds, function(err, salt) {bcrypt.hash(password, salt, function(err,hash) {return hash;});});
}

app.post("/api/register", (req, res) => {
    const registerData = req.body;
    const username = registerData["username"];
    const email = registerData["email"];
    const password = registerData["password"];
    const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!email_regex.test(email)) {
        return res.status(400).json({message: "This email address is invalid!"});
    }
    if(connection.state === 'disconnected') {
        console.log("Database connection failed");
    }
    else {
        console.log("Database connection successful");
    }
    const sql = `INSERT INTO Users(Username, PasswordHash, Email) VALUES (?, ?, ?);`;
    connection.query(sql, [username, password, email], (err) => { 
        if (err) {
            return res.status(401).json({ message: `Database invalid error: ${err}` });
        } else {
            return res.status(201).json({ message: "Registered new user successfully", profile: storedLogins });
        }
    });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required" });
    }

    // Query for the user with the given username
    connection.query(
        "SELECT UserID, Username, PasswordHash FROM Users WHERE Username = ?",
        [username],
        (err, results) => {
            if (err) {
                console.error("Database error during login:", err);
                return res.status(500).json({ message: `Database error: ${err}` });
            }
            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid username/password combination!" });
            }
            const userInfo = results[0];
            // Since we're not hashing passwords here, compare directly
            if (password === userInfo.PasswordHash) {
                // Return user info so the client can store the token as needed
                return res.status(200).json({ message: "Login successful", userID: userInfo.UserID, username: userInfo.Username });
            } else {
                return res.status(401).json({ message: "Invalid username/password combination!" });
            }
        }
    );
});


app.get("/api/login", (req, res) => {
    res.status(200).json(storedLogins);
});

app.get("/api", (req, res) => {
    res.json({ users: ["userOne", "UserTwo", "UserThree"] });
});

app.get("/api/profile", (req, res) => {
    res.json(storedProfile);
});

app.post("/api/profile", (req, res) => {
    storedProfile = req.body;
    res.json({ message: "Profile updated successfully", profile: storedProfile });
});

app.get("/api/notifications", (req, res) => {
    //let loggedID = sessionStorage.getItem("auth-token");
    connection.query(`
        SELECT Notifications.Message, Notifications.NotificationDate AS date, Notifications.UserID, Events.EventName
        FROM Notifications
        JOIN Events ON Notifications.EventID = Events.EventID
        ORDER BY Notifications.NotificationDate DESC
    `,(err, results) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            console.log(results);
            res.json(results);
        }
    });
});


app.post("/api/notifications", (req, res) => {
    const { UserID, EventID, Message } = req.body;

    if (!UserID || !EventID || !Message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const sqlQuery = `INSERT INTO Notifications (UserID, EventID, Message) VALUES (?, ?, ?)`;

    connection.query(sqlQuery, [UserID, EventID, Message], (err, result) => {
        if (err) {
            console.error("Error adding notification:", err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.status(201).json({ message: "Notification added successfully!" });
        }
    });
});

app.get("/api/volunteer-history", async (req, res) => {
    try {
        //let loggedID = sessionStorage.getItem("auth-token");
        const [rows] = await connection.promise().query(`
            SELECT Events.EventName, Events.Description, Events.Location, Events.RequiredSkills, 
                   Events.UrgencyLevel, Events.EventDate, VolunteerMatches.MatchDate , VolunteerMatches.UserID
            FROM VolunteerMatches
            JOIN Events ON VolunteerMatches.EventID = Events.EventID
            ORDER BY VolunteerMatches.MatchDate DESC;
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching volunteer history:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

if (require.main === module) {
    connection.connect();
    if(connection.state === 'disconnected') {
        console.log("Database connection failed");
    }
    else {
        console.log("Database connection successful");
    }

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

module.exports = app;
