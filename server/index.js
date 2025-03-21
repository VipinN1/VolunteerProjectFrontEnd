const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const bcrypt = require("bcrypt")

const app = express();
const PORT = 5000;
const pwdSaltRounds = 10;

app.use(cors());
app.use(express.json());

// SQL Server configuration - FIGURE THIS OUT
var config = {
    "user": "vpserver", // Database username
    "password": "server", // Database password
    "server": "localhost\\SQLEXPRESS", // Server IP address
    "database": "VolunteerDB", // Database name
    "options": {
        "encrypt": false // Disable encryption
    }
}

// Connect to SQL Server
sql.connect(config, err => {
    console.log("Connecting to database")
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
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

app.get("/api/register", (req, res) => {
    res.status(200).json(storedLogins);
});

app.post("/api/register", (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    /*
    if (storedLogins.usernames.includes(username)) {
        return res.status(400).json({ message: "This username is already in use!" });
    }
    if (storedLogins.emails.includes(email)) {
        return res.status(400).json({ message: "This email address is already in use!" });
    }
        */

    // Generates password salt for encryption
    bcrypt.genSalt(pwdSaltRounds, function(err, salt) {bcrypt.hash(password, salt, function(err,hash) {});});

    // Inserts new user into Users; if an error occurs, returns the database error
    sql.connect(config, function(err) {
        let request = new sql.Request();
        request.query(`INSERT INTO Users VALUES(${username}, ${hash}, ${email}`, function(err) {  // If this needs to input FullName, add ', ${username})' near the end of the insert part
            if (err) {
                return res.status(401).json({message: `Database invalid error: ${err}`});
            }
        })
    })

    /*
    storedLogins.usernames.push(username);
    storedLogins.passwords.push(password);
    storedLogins.emails.push(email);
    */
    res.status(201).json({ message: "Registered new user successfully", profile: storedLogins });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required" });
    }
    let userData;
    let request = new sql.Request();
    request.query('SELECT [Username, PasswordHash] FROM Users', function(err, data) {
        if (err) {
            return res.status(401).json({message: `Database invalid error: ${err}`});
        }
        userData = data;
    });
    for (const loginData in userData) {
        bcrypt.compare(password, loginData["PasswordHash"], function(err, result) {
            if (result && username == loginData["Username"]) {
                res.status(200).json({ message: "Login successful", username });
            }
            else {
                res.status(401).json({message: "Invalid username/password combination!"})
            }
        })
    }

    /*
    const userIndex = storedLogins.usernames.indexOf(username);
    if (userIndex === -1 || storedLogins.passwords[userIndex] !== password) {
        return res.status(401).json({ message: "Invalid username/password combination!" });
    }*/
    
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
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

module.exports = app;
