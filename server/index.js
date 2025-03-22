const express = require("express");
const cors = require("cors");
const sql = require("mysql2");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const connection = sql.createConnection({
    host:'localhost',
    user:'local_user',
    password:'pingas',
    database:'volunteerdb'
});

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

app.get("/api/register", (req, res) => {
    res.status(200).json(storedLogins);
});

app.post("/api/register", (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (storedLogins.usernames.includes(username)) {
        return res.status(400).json({ message: "This username is already in use!" });
    }
    if (storedLogins.emails.includes(email)) {
        return res.status(400).json({ message: "This email address is already in use!" });
    }
    storedLogins.usernames.push(username);
    storedLogins.passwords.push(password);
    storedLogins.emails.push(email);
    res.status(201).json({ message: "Registered new user successfully", profile: storedLogins });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required" });
    }
    const userIndex = storedLogins.usernames.indexOf(username);
    if (userIndex === -1 || storedLogins.passwords[userIndex] !== password) {
        return res.status(401).json({ message: "Invalid username/password combination!" });
    }
    res.status(200).json({ message: "Login successful", username });
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
    connection.query(`
        SELECT Notifications.Message, Notifications.NotificationDate AS date, Events.EventName
        FROM Notifications
        JOIN Events ON Notifications.EventID = Events.EventID
        ORDER BY Notifications.NotificationDate DESC
    `, (err, results) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
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
        const [rows] = await pool.query(`
            SELECT Events.EventName, Events.Description, Events.Location, Events.RequiredSkills, 
                   Events.UrgencyLevel, Events.EventDate, VolunteerMatches.MatchDate 
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

        connection.query("SELECT * from Users", (err, results, fields) => {
            if (err) {
                console.error("Error executing query:", err);
                return;
            }
            console.log("Users data retrieved:", results);
            console.log(results);
        });

    }

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}





module.exports = app;