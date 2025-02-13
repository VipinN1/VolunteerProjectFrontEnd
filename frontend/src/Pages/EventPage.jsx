import React, { useState, useEffect } from "react";
import "./EventPage.css";

function EventPage (){
    
    const [volunteers, setVolunteers] = useState([]);  
    const [events, setEvents] = useState([]);          
    const [selectedVolunteer, setSelectedVolunteer] = useState(""); 
    const [filteredEvents, setFilteredEvents] = useState([]); 
    const [selectedVolunteerSkills, setSelectedVolunteerSkills] = useState([]);

    // Temp database for front end test
    useEffect(() => {
        setVolunteers([
            { id: "1", name: "Bobby Johnson", skills: ["teaching", "eventPlanning"] },
            { id: "2", name: "Craig Hodges", skills: ["marketing", "coding"] },
            { id: "3", name: "Vanessa Kirby", skills: ["medicalAid", "fundraising"] }
        ]);

        setEvents([
            { id: "101", name: "Food Drive", requiredSkills: ["fundraising", "marketing"] },
            { id: "102", name: "Coding Workshop", requiredSkills: ["coding"] },
            { id: "103", name: "Environmental Cleanup", requiredSkills: ["marketing", "eventPlanning"] }
        ]);
    }, []);
    
    function handleVolunteerChange(e) {
    const selectedName = e.target.value;
    setSelectedVolunteer(selectedName);

    // Find the volunteer's skills
    const volunteer = volunteers.find(v => v.name === selectedName);
    if (!volunteer) {
        setFilteredEvents([]);
        setSelectedVolunteerSkills([]); 
        return;
    }
    
    setSelectedVolunteerSkills(volunteer.skills);
    
    const matchedEvents = events.filter(event =>
        event.requiredSkills.some(skill => volunteer.skills.includes(skill))
    );

    setFilteredEvents(matchedEvents);
    }
    
    function formatSkill(skill) {
        return skill
            .replace(/([A-Z])/g, " $1")  
            .replace(/^./, (str) => str.toUpperCase()); 
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log("Form submitted"); //change later
        alert("Form submission successful!");
        document.getElementById("event_form").reset();
        document.getElementById("volunteer_form").reset();
        setSelectedVolunteer(""); 
        setFilteredEvents([]);
      }

    return(
        <>
            <div className="header">
                Volunteer Site            
            </div>

            <div className="body1">
                <h2 id="main-header">Welcome, admin</h2>

                <div className="form1">               
                <h2 className="form-header">Event Management Form</h2>               
                <form id="event_form" onSubmit={handleSubmit}>{/*do action later*/}
                    
                    <p>
                        <label htmlFor="eventName">Event Name:</label>
                        <input type="text" id="eventName" name="eventName" maxLength="100" required></input>
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
                    
                        <label htmlFor="skills">Required Skills</label>  {/* Press Ctrl to select multiple */}
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
                        <input type="date" id="eventDate" name="eventDate" required></input>
                    </p>

                    <p>
                        <button type="submit">Submit</button>
                    </p>

                </form>
                </div>

                <div className="form2">
                <h2 className="form-header">Volunteer Matching Form</h2>               
                <form id="volunteer_form" onSubmit={handleSubmit}> {/*do action later*/}
                    
                    <p>
                        <label htmlFor="volunteer">Select a Volunteer</label>
                        <select name="volunteer" id="volunteer" value={selectedVolunteer} onChange={handleVolunteerChange} required>
                                <option value="">-- Select a Volunteer --</option>
                                {volunteers.map((volunteer) => (<option key={volunteer.id} value={volunteer.name}>{volunteer.name}</option>))}
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
                            {filteredEvents.map((event) => (<option key={event.id} value={event.name}> {event.name} </option>))}
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
