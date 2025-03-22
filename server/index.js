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

/*
async function testConnection() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT 1 AS test");
        console.log("Connection Test:", result.recordset);
    } catch (err) {
        console.error("Test Query Failed:", err);
    }
}

testConnection();
*/

/* SQL Server configuration - FIGURE THIS OUT
var config = {
    user: "John Doe", // SQL Server username
    password: "JohnDoe1234", // SQL Server password
    server: "localhost", // Change if needed (try "127.0.0.1" or your machine name)
    port: 1433, // Explicitly specify port
    database: "VolunteerDB",
    options: {
        encrypt: false, // Set to true if using Azure
        trustServerCertificate: true,
    }
};

 Connect to SQL Server
sql.connect(config)
    .then(pool => {
        console.log("Connected to SQL Server!");
        return pool;
    })
    .catch(err => {
        console.error("Database connection failed:", err);
    });
*/

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
    /*
    if (storedLogins.usernames.includes(username)) {
        return res.status(400).json({ message: "This username is already in use!" });
    }
    if (storedLogins.emails.includes(email)) {
        return res.status(400).json({ message: "This email address is already in use!" });
    }*/

    // Generates password salt for encryption

    // Inserts new user into Users; if an error occurs, returns the database error
    //connection.connect();
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

    /*storedLogins.usernames.push(username);
    storedLogins.passwords.push(password);
    storedLogins.emails.push(email);*/    
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

const volunteerHistory = [
    { id: 1, eventName: "Food Drive", description: "Helping the needy", location: "NYC", skills: "Cooking", urgency: "High", eventDate: "2024-03-15", status: "Completed" },
    { id: 2, eventName: "Tree Planting", description: "Environmental Event", location: "LA", skills: "Gardening", urgency: "Medium", eventDate: "2024-04-10", status: "Upcoming" },
];

app.get("/api/volunteer-history", (req, res) => {
    res.json(volunteerHistory);
});

if (require.main === module) {
    connection.connect();
    if(connection.state === 'disconnected') {
        console.log("Database connection failed");
        return;
    }
    else {
        console.log("Database connection successful");

        /*connection.query("SELECT * from Users", (err, results, fields) => {
            if (err) {
                console.error("Error executing query:", err);
                return;
            }
            console.log("Users data retrieved:", results);
            console.log(results);
        });*/
    }
    //connection.end();

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}





module.exports = app;
