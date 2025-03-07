import React, { useState, useEffect } from "react";
import "./EventPage.css";

function EventPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedVolunteerSkills, setSelectedVolunteerSkills] = useState([]);

  // Fetch events and volunteers from the backend 
  useEffect(() => {
    
    fetch('http://localhost:5000/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error("Error fetching events:", error));

    fetch('http://localhost:5000/api/volunteers')
      .then(response => response.json())
      .then(data => setVolunteers(data))
      .catch(error => console.error("Error fetching volunteers:", error));
  }, []);

  function handleVolunteerChange(e) {
    const selectedName = e.target.value;
    setSelectedVolunteer(selectedName);
  
    const volunteer = volunteers.find(v => v.username === selectedName);
    if (!volunteer) {
      setFilteredEvents([]);
      setSelectedVolunteerSkills([]);
      return;
    }
  
    setSelectedVolunteerSkills(volunteer.skills);
  
    const matchedEvents = events.filter(event => {
      const skillMatch = event.requiredSkills.some(skill =>
        volunteer.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );
      const dateMatch = volunteer.availability && volunteer.availability.includes(event.date);
      return skillMatch && dateMatch;
    });
  
    setFilteredEvents(matchedEvents);
  }
  

  function formatSkill(skill) {
    return skill
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  function handleSubmit(event) {
    event.preventDefault();    
    
    

    
    const eventName = document.getElementById("eventName").value;
    const eventDescription = document.getElementById("eventDescription").value;
    const eventLoc = document.getElementById("eventLoc").value;
    const skills = Array.from(document.getElementById("skills").selectedOptions).map(opt => opt.value);
    const urgency = document.getElementById("urgency").value;
    const eventDate = document.getElementById("eventDate").value;

    const newEvent = {
    name: eventName,
    description: eventDescription,
    location: eventLoc,
    requiredSkills: skills,
    urgency,
    date: eventDate
    };

    // Send POST request to backend to create new event
    fetch('http://localhost:5000/api/events', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEvent)
    })
    .then(response => {
        if (!response.ok) {
        throw new Error("Error creating event");
        }
        return response.json();
    })
    .then(data => {
        console.log("Event created:", data);
        alert("Event creation successful!");
        
        fetch('http://localhost:5000/api/events')
        .then(response => response.json())
        .then(data => setEvents(data));
    })
    .catch(error => {
        console.error("Error creating event:", error);
        alert("There was an error creating the event.");
    });
    

    
    document.getElementById("event_form").reset();
    document.getElementById("volunteer_form").reset();
    setSelectedVolunteer("");
    setFilteredEvents([]);
  }

  function handleMatchSubmit(e) {
    e.preventDefault();
  
    const volunteer = volunteers.find(v => v.username === selectedVolunteer);
    if (!volunteer) {
      alert("Please select a valid volunteer.");
      return;
    }  
    
    // Find matching event wuth user by email
    fetch('http://localhost:5000/api/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: volunteer.email })  
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error matching volunteer");
        }
        return response.json();
      })
      .then(data => {
        console.log("Matching result:", data);
        alert("Volunteer matching successful!");
        
        setFilteredEvents(data.matchingEvents);

        document.getElementById("volunteer_form").reset();
        setSelectedVolunteer("");
      })
      .catch(error => {
        console.error("Error matching volunteer:", error);
        alert("There was an error matching the volunteer.");
      });
  }
  

  return (
    <>
      <div className="body1">
        <h2 id="main-header">Welcome, admin</h2>

        <div className="form1">
          <h2 className="form-header">Event Management Form</h2>
          <form id="event_form" onSubmit={handleSubmit}>
            <p>
              <label htmlFor="eventName">Event Name:</label>
              <input type="text" id="eventName" name="eventName" maxLength="100" required />
            </p>
            <p>
              <label htmlFor="eventDescription">Description:</label>
              <textarea name="eventDescription" id="eventDescription" required></textarea>
            </p>
            <p>
              <label htmlFor="eventLoc">Location:</label>
              <textarea name="eventLoc" id="eventLoc" required></textarea>
            </p>
            <p>
              <label htmlFor="skills">Required Skills</label>
              <select name="skills" id="skills" multiple required>
                <option value="teaching">Teaching</option>
                <option value="medicalAid">Medical Aid</option>
                <option value="fundraising">Fundraising</option>
                <option value="eventPlanning">Event Planning</option>
                <option value="coding">Coding</option>
                <option value="marketing">Marketing</option>
              </select>
            </p>
            <p>
              <label htmlFor="urgency">Urgency</label>
              <select name="urgency" id="urgency" required>
                <option value="notUrgent">Not Urgent</option>
                <option value="Urgent">Urgent</option>
                <option value="veryUrgent">Very Urgent</option>
              </select>
            </p>
            <p>
              <label htmlFor="eventDate">Event Date</label>
              <input type="date" id="eventDate" name="eventDate" required />
            </p>
            <p>
              <button type="submit">Submit</button>
            </p>
          </form>
        </div>

        <div className="form2">
          <h2 className="form-header">Volunteer Matching Form</h2>
          <form id="volunteer_form" onSubmit={handleMatchSubmit}>
            <p>
              <label htmlFor="volunteer">Select a Volunteer</label>
              <select name="volunteer" id="volunteer" value={selectedVolunteer} onChange={handleVolunteerChange} required>
                <option value="">-- Select a Volunteer --</option>
                {volunteers.map(volunteer => (
                  <option key={volunteer.email} value={volunteer.username}>
                    {volunteer.username}
                  </option>
                ))}
              </select>
            </p>
            {selectedVolunteer && (
              <p>
                <em>Skills:</em> {selectedVolunteerSkills.map(formatSkill).join(", ")}
              </p>
            )}
            <p>
              <label htmlFor="matchedEvent">Events</label>
              <select id="matchedEvent" name="matchedEvent" required>
                <option value="">-- Matched Events --</option>
                {filteredEvents.map(event => (
                  <option key={event.id} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
            </p>
            <p>
              <button type="submit">Match Volunteer</button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default EventPage;
