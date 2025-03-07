const express = require('express');
const router = express.Router();
const events = require('../data/events');

router.get('/events', (req, res) => res.json(events));

router.post('/events', (req, res) => {

    try {
        const { name, location, requiredSkills, urgency, date } = req.body;

        // Validate required fields
        if (!name || !location || !requiredSkills || !urgency || !date) {
            return res.status(400).json({ message: "All fields (name, location, requiredSkills, urgency, date) are required." });
        }
 
        if (!Array.isArray(requiredSkills)) {
            return res.status(400).json({ message: "Required Skills must be an array." });
        }

        // Validate date format
        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ message: "Invalid date format." });
        }

        const newEvent = { id: events.length + 1, name, location, requiredSkills, urgency, date };
        events.push(newEvent);
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
