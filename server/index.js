const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const sql = require("mysql2");
const bcrypt = require("bcrypt");

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

app.post("/api/register", (req, res) => {
    const registerData = req.body;
    const username = registerData["username"];
    const email = registerData["email"];
    const password = registerData["password"];
    const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const saltRounds = 10;
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
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        console.error(err);
        return res.status(400).json({message: "Salting error"});
      }
      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(hash)  // debug
        const sql = `INSERT INTO Users(Username, PasswordHash, Email) VALUES (?, ?, ?);`;
        connection.query(sql, [username, hash, email], (err) => { 
          if (err) {
              return res.status(401).json({ message: `Database invalid error: ${err}` });
          } else {
              return res.status(201).json({ message: "Registered new user successfully"});  // , profile: storedLogins 
          }
        });
      });
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
            bcrypt.compare(password, userInfo.PasswordHash, (err, result) => {
              if (err) {
                return res.status(401).json({ message: "Invalid username/password combination!" });
              }
              if (result) {
                return res.status(200).json({ message: "Login successful", userID: userInfo.UserID, username: userInfo.Username });
              }
              else {
                return res.status(401).json({ message: "Invalid username/password combination!" });
              }
            });
            
            /*if (password === userInfo.PasswordHash) {
                // Return user info so the client can store the token as needed
                return res.status(200).json({ message: "Login successful", userID: userInfo.UserID, username: userInfo.Username });
            } else {
                return res.status(401).json({ message: "Invalid username/password combination!" });
            }*/
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

// Event Management
app.get("/api/events", (req, res) => {
    connection.query("SELECT * FROM Events;", (err, results) => {
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
      VALUES (?, ?, ?, ?, ?, ?);
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
    connection.query("SELECT * FROM Users WHERE Email = ?;", [email], (err, userResults) => {
      if (err) {
        console.error("Error fetching volunteer:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (userResults.length === 0) {
        return res.status(404).json({ message: "Volunteer not found" });
      }
      const volunteer = userResults[0];
      
      connection.query("SELECT Skill FROM UserSkills WHERE UserID = ?;", [volunteer.UserID], (err, skillResults) => {
        if (err) {
          console.error("Error fetching skills:", err);
          return res.status(500).json({ message: "Server error" });
        }
        const volunteerSkills = skillResults.map(r => r.Skill);
        // Get availability
        connection.query("SELECT AvailableDate FROM UserAvailability WHERE UserID = ?;", [volunteer.UserID], (err, availResults) => {
          if (err) {
            console.error("Error fetching availability:", err);
            return res.status(500).json({ message: "Server error" });
          }
          const availability = availResults.map(r => new Date(r.AvailableDate).toISOString().split("T")[0]);
          // Get all events
          connection.query("SELECT * FROM Events;", (err, eventResults) => {
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
    connection.query("SELECT * FROM Users;", (err, userResults) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (userResults.length === 0) return res.json([]);
      
      const volunteers = [];
      let completed = 0;
      userResults.forEach(user => {
        
        connection.query("SELECT Skill FROM UserSkills WHERE UserID = ?;", [user.UserID], (err, skillResults) => {
          if (err) {
            console.error("Error fetching skills:", err);
            return res.status(500).json({ message: "Server error" });
          }
          
          connection.query("SELECT AvailableDate FROM UserAvailability WHERE UserID = ?;", [user.UserID], (err, availResults) => {
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

app.post("/api/report", (req, res) => {
  const format = req.body["format"];
  const subject = req.body["subject"];
  if (!format) {
    return res.status(400).json({ message: "Report file format is required" });
  }
  if (!subject) {
    return res.status(400).json({ message: "Report subject is required" });
  }
  switch(subject) {  // Switch statement - based on report subject, does different 
    case "Volunteers and Participation History":
      connection.query("SELECT * FROM Users;", (err, userResults) => {
        if (err) {
          console.error("Error fetching users:", err);
          return res.status(500).json({ message: "Server error" });
        }
        switch(format) {
          case "PDF":  // TODO, WIP
            const doc = new PDFDocument();
            const date = new Date();
            const writeStream = fs.createWriteStream(`./volunteer-report-${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}.pdf`);
            doc.pipe(writeStream);
            doc.font("Courier");
            doc.fontSize(16);
            doc.text(`Volunteers and Participation History Report - ${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`, {
              align:"center"
            });
            doc.fontSize(10);
            doc.moveDown();
            (async () => {
              for (const user of userResults) {
                doc.font("Courier-Bold");
                doc.text(`${user.Username} - ${user.Email} | `);
                doc.font("Courier");
            
                try {
                  const [matches] = await connection.promise().query(
                    "SELECT UserID, EventName, EventDate, Location, MatchDate FROM VolunteerMatches LEFT JOIN Events ON VolunteerMatches.EventID = Events.EventID WHERE VolunteerMatches.UserID = ?;",
                    [user.UserID]
                  );
            
                  if (matches.length === 0) {
                    doc.text("No volunteer history", { indent: 12 });
                  } else {
                    matches.forEach(match => {
                      doc.text(`${(match.EventDate.getMonth()+1).toString().padStart(2,0)}/${match.EventDate.getDate().toString().padStart(2,0)}/${match.EventDate.getFullYear()} - ${match.EventName} at ${match.Location}, matched on ${(match.MatchDate.getMonth()+1).toString().padStart(2,0)}/${match.MatchDate.getDate().toString().padStart(2,0)}/${match.MatchDate.getFullYear()}`, {
                        indent: 12
                      });
                    });
                  }
                } catch (err) {
                  console.error("Error fetching volunteer matches:", err);
                  doc.text("Error! Report could not generate fully.");
                  doc.end();
                  return res.status(401).json({message: "Report could not generate fully."});
                }
            
                doc.moveDown();
              }
            
              doc.end();
            })();            
            writeStream.on('finish', function () {
              return res.status(200).json({message: "Report successfully generated!"});
            });
            break;
          case "CSV":  // TODO
            break;
          default:
            return res.status(400).json({message: "Invalid report file format"});
        }
      })
      break;
    case "Event Details and Volunteer Assignments":
      connection.query("SELECT * FROM Events;", (err, eventResults) => {
        if (err) {
          console.error("Error fetching events:", err);
          return res.status(500).json({ message: "Server error" });
        }
        switch(format) {
          case "PDF":  // TODO, WIP
            const doc = new PDFDocument();
            const date = new Date();
            const writeStream = fs.createWriteStream(`./event-report-${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}.pdf`);
            doc.pipe(writeStream);
            doc.fontSize(16);
            doc.font("Courier");
            doc.text(`Event Details and Volunteer Assignments Report - ${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`, {
              align:"center"
            });
            doc.fontSize(10);
            doc.moveDown();
            (async () => {
              for (const event of eventResults) {
                doc.font("Courier-Bold");
                doc.text(`${event.EventName} - ${(event.EventDate.getMonth()+1).toString().padStart(2,0)}/${event.EventDate.getDate().toString().padStart(2,0)}/${event.EventDate.getFullYear()}, ${event.Location}`);
                doc.font("Courier");
                doc.text(`Required Skills: ${event.RequiredSkills.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).replace(/\s./, (str) => str.toUpperCase()).replace(/,/,", ")}`);
                doc.text(`Urgency: ${event.UrgencyLevel.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}`);
                try {
                  const [matches] = await connection.promise().query(
                    "SELECT * FROM VolunteerMatches LEFT JOIN Users ON VolunteerMatches.UserID = Users.UserID WHERE VolunteerMatches.EventID = ?;", 
                    [event.EventID]
                  );
                  if (matches.length === 0) {
                    doc.text("No volunteers assigned", {indent:12});
                  }
                  else {
                    matches.forEach(match => {
                      doc.text(`${match.FullName} AKA ${match.Username} - ${match.Email}`, {
                        indent: 12
                      });
                    });
                  }
                }
                catch (err) {
                  console.error("Error fetching events and volunteer assignments:", err);
                  doc.text("Error! Report could not generate fully.");
                  doc.end();
                  return res.status(401).json({message: "Report could not generate fully."});
                }
                doc.moveDown();
              }
              doc.end();
            })();
            writeStream.on('finish', function () {
              return res.status(200).json({message: "Report successfully generated!"});
            });
            break;
          case "CSV":
            break;
        }
      });
      break;
    default:
      return res.status(400).json({message: "Invalid report subject" });
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
