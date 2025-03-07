const express = require('express');
const router = express.Router();
const events = require('../data/events');

const users = [
  {
    id: 1,
    username: "John Doe",
    email: "johndoe@gmail.com",
    skills: ["Teaching", "Medical Aid", "Fundraising"],
    preferences: "Weekends through may",
    availability: ["2025-03-10", "2025-03-15"]
  },
  {
    id: 2,
    username: "Jane Smith",
    email: "janesmith@gmail.com",
    skills: ["Coding", "Event Planning"],
    preferences: "Weekdays",
    availability: ["2024-06-10", "2024-07-01"]
  },
  {
    id: 3,
    username: "Alice Brown",
    email: "alicebrown@gmail.com",
    skills: ["Marketing", "Fundraising"],
    preferences: "Evenings",
    availability: ["2024-05-15", "2024-07-01"]
  },
  {
    id: 4,
    username: "Bob Johnson",
    email: "bobjohnson@gmail.com",
    skills: ["Coding", "Teaching"],
    preferences: "Mornings",
    availability: ["2024-06-10", "2025-03-15"]
  }
];

router.get('/volunteers', (req, res) => res.json(users));

// Volunteer matching
router.post('/match', (req, res) => {
  const { email } = req.body;
  const volunteer = users.find(v => v.email === email);
  if (!volunteer) {
    return res.status(404).json({ message: "Volunteer not found" });
  }
  
  // Matching logic
  const matchingEvents = events.filter(evt => {
    const skillMatch = evt.requiredSkills.some(skill =>
      volunteer.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );
    const dateMatch = volunteer.availability && volunteer.availability.includes(evt.date);
    return skillMatch && dateMatch;
  });

  res.json({ volunteer, matchingEvents });
});

module.exports = router;
