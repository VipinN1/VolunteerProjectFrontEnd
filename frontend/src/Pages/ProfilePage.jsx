import React, { useState } from "react";
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

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
    "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA",
    "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const skillsOptions = ["Teaching", "Medical Aid", "Fundraising", "Event Planning", "Coding", "Marketing"];

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
    const selectedDates = Array.from(e.target.selectedOptions, (option) => option.value);
    setProfile((prev) => ({ ...prev, availability: selectedDates }));
  };

  // Handle form submission (currently just logs the data)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Data:", profile);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>Complete Your Volunteer Profile</h2>
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
          <select multiple required onChange={handleSkillChange}>
            {skillsOptions.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
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

         
          <label>Availability (Select multiple dates) *</label>
          <input type="date" multiple required onChange={handleAvailabilityChange} />

          {/* Submit Button */}
          <button type="submit">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
