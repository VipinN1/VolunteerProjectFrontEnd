const express = require('express');
const cors = require("cors");

const app = express();

app.use(express.json);
app.use(cors());

var db = {
    "dbPos": [0],
    "username": ["John Doe"],
    "email": ["johndoe@gmail.com"],
    "password": ["deer113"],
    "address1": ["2331 Apple Street"],
    "address2": [""],
    "city": ["Houston"],
    "state": ["TX"],
    "zipcode": ["33213"],
    "skills": [["Teaching","Medical aid","Fundraising"]],
    "preferences": ["Has knee pain, can't lift heavy objects"],
    "availability": [["2025-03-08T00:00.00.000Z",
                     "2025-03-09T00:00.00.000Z",
                     "2025-03-15T00:00.00.000Z",
                     "2025-03-16T00:00.00.000Z",
                     "2025-03-22T00:00.00.000Z",
                     "2025-03-23T00:00.00.000Z",
                     "2025-03-29T00:00.00.000Z",
                     "2025-03-30T00:00.00.000Z",
                     "2025-04-05T00:00.00.000Z",
                     "2025-04-06T00:00.00.000Z",
                     "2025-04-12T00:00.00.000Z",
                     "2025-04-13T00:00.00.000Z",
                     "2025-04-19T00:00.00.000Z",
                     "2025-04-20T00:00.00.000Z",
                     "2025-04-26T00:00.00.000Z",
                     "2025-04-27T00:00.00.000Z"]]
}

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "UserTwo", "UserThree"]})
})

app.listen(5000, () => {console.log("server started on port 5000")})

app.post('/register', (req, res) => {
    try {
        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const email = req.body.email;
        if (email == "") {
            throw new SyntaxError("Email is empty");
        }
        else if (!email_regex.test(email)) {
            throw new SyntaxError("Email format is wrong")
        }
        else if (db["email"].find(email)) {
            throw new ReferenceError("Email already exists; no 2 emails can overlap!");
        }
        const username = req.body.username;
        if (username == "") {
            throw new SyntaxError("Username is empty");
        }
        else if (db["username"].find(username)) {
            throw new ReferenceError("Username already exists; no 2 usernames can overlap!");
        }
        const password = req.body.password;
        if (password == "") {
            throw new SyntaxError("Password is empty");
        }
        db["dbPos"].push(db["dbPos"].length);
        db["username"].push(username);
        db["email"].push(email);
        db["password"].push(password);
        db["address1"].push("");
        db["address2"].push("");
        db["city"].push("");
        db["state"].push("");
        db["zipcode"].push("");
        db["skills"].push([]);
        db["preferences"].push([]);
        db["availability"].push([]);
        res.send("Registration successful!");
    }
    catch(exception) {
        console.log(exception);
    }
})

app.post('/login', (req, res) => {
    console.log("Login connection established");
    try {
        const username = req.body.username;
        if (username == "") {
            throw new SyntaxError("Username is empty");
        }
        const password = req.body.password;
        if (password == "") {
            throw new SyntaxError("Password is empty");
        }
        if (!db["username"].indexOf(username)) {
            throw new ReferenceError("A user with this username does not exist");
        }
        else {
            found_index = db["dbPos"].at(db["username"].indexOf(username));
        }
        if (password != db["password"].at(found_index)) {
            throw new ReferenceError("Wrong password")
        }
        console.log("Login successful!");
        res.send("Login successful!");
    }
    catch(exception) {
        console.log(exception);
        if (exception instanceof SyntaxError) {
            res.send("Please fill out both the username and password!")
        }
        else if (exception instanceof ReferenceError) {
            res.send("Wrong username/password combination!")
        }
    }
})