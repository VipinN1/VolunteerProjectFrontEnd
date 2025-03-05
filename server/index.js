const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(morgan('tiny'))

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "UserTwo", "UserThree"]})
})

app.listen(5000, () => {console.log("server started on port 5000")})

app.post('/login', async(req, res) => {
    try {

    }
    catch(exception) {

    }
})