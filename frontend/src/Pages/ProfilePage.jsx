import React, { useState, useEffect } from "react";
import "./Profile.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    skills: [],
    preferences: "",
    availability: [],
  });
  //const userID = 1;
  useEffect(() => {
    const userID = sessionStorage.getItem("auth-token"); 
    if (!userID) return;

    fetch(`http://localhost:5000/api/profile/${userID}`)
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
    "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA",
    "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const skillMap = {
    teaching:     "Teaching",
    medicalaid:   "Medical Aid",
    fundraising:  "Fundraising",
    eventplanning:"Event Planning",
    coding:       "Coding",
    marketing:    "Marketing"
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle skill selection
  const handleSkillChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setProfile((prev) => ({ ...prev, skills: options }));
  };

  // Handle date selection for availability
    const handleAvailabilityChange = (e) => {
      const newDate = e.target.value;
      if (newDate && !profile.availability.includes(newDate)) {
        setProfile((prev) => ({
          ...prev,
          availability: [...prev.availability, newDate]
        }));
      }
    };
  
  const removeDate = (indexToRemove) => {
    setProfile((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== indexToRemove)
    }));
  };
  
  // Handle form submission 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userID = sessionStorage.getItem("auth-token");
  
    const normalizeSkill = (skill) => skill.toLowerCase().replace(/\s/g, "");
  
    const normalizedProfile = {
      ...profile,
      skills: profile.skills.map(normalizeSkill),
    };
  
    console.log("Submitting profile data:", normalizedProfile);
  
    try {
      const response = await fetch(`http://localhost:5000/api/profile/${userID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedProfile),
      });
  
      const result = await response.json();
      console.log("Server Response:", result);
      alert(result.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };
  
  

  return (
    <div className="profile-page">
      <title>Volunteer Site - Profile</title>
      <div className="profile-container">
        <h2>Your Profile Information</h2>

        <form onSubmit={handleSubmit}>
          <label>Full Name *</label>
          <input
            type="text"
            name="fullName"
            maxLength="50"
            placeholder="Enter full name"
            required
            value={profile.fullName}
            onChange={handleChange}
          />

          <label>Address 1 *</label>
          <input
            type="text"
            name="address1"
            maxLength="100"
            placeholder="Enter address"
            required
            value={profile.address1}
            onChange={handleChange}
          />

          <label>Address 2</label>
          <input
            type="text"
            name="address2"
            maxLength="100"
            placeholder="Enter address (optional)"
            value={profile.address2}
            onChange={handleChange}
          />

          <label>City *</label>
          <input
            type="text"
            name="city"
            maxLength="100"
            placeholder="Enter city"
            required
            value={profile.city}
            onChange={handleChange}
          />

          <label>State *</label>
          <select name="state" required value={profile.state} onChange={handleChange}>
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <label>Zip Code *</label>
          <input
            type="text"
            name="zipCode"
            maxLength="9"
            placeholder="Enter zip code (min 5 characters)"
            pattern="\d{5,9}"
            title="Zip code must be between 5 to 9 digits"
            required
            value={profile.zipCode}
            onChange={handleChange}
          />

          <label>Skills (Hold Ctrl/Cmd to select multiple) *</label>
          <select
            name="skills"
            id="skills"
            multiple
            required
            onChange={handleSkillChange}
          >
            {Object.entries(skillMap).map(([key,label]) => (
              <option
                key={key}
                value={key}
                selected={profile.skills.includes(key)}
              >
                {label}
              </option>
            ))}
          </select>
          <label>Preferences</label>
          <textarea
            name="preferences"
            placeholder="Enter your preferences"
            value={profile.preferences}
            onChange={handleChange}
          ></textarea>

          <label>Availability (You can enter multiple dates) *</label>
          <input type="date" onChange={handleAvailabilityChange} style={{ color: "black", backgroundColor: "white" }} />

          <ul>
            {profile.availability.map((date, idx) => (
              <li key={idx}>
                {date}
                <button type="button" onClick={() => removeDate(idx)}>Remove</button>
              </li>
            ))}
          </ul>

          <button type="submit">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;