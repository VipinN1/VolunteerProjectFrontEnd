import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import EventPage from "./Pages/EventPage.jsx";
import Notifications from "./Pages/Notifications.jsx";
import ParticipationHistory from "./Pages/ParticipationHistory.jsx";
import ForgotPassword from "./Pages/ForgotPasswordPage.jsx";
import ResetPassword from "./Pages/ResetPasswordPage.jsx";

import "./App.css";

function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div>
      <header id="header_div">
        <p>Volunteer Site</p>
        <div className="dropdown">
          <button className="dropdown-btn" onClick={toggleDropdown}>
            Menu ▼
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/" onClick={() => setDropdownOpen(false)}>Home</Link>
              <Link to="/login" onClick={() => setDropdownOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setDropdownOpen(false)}>Register</Link>
              <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
              <Link to="/event" onClick={() => setDropdownOpen(false)}>Event Management</Link>
              <Link to="/notifications" onClick={() => setDropdownOpen(false)}>Notifications</Link>
              <Link to="/participationhistory" onClick={() => setDropdownOpen(false)}>Participation History</Link>
            </div>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/participationhistory" element={<ParticipationHistory />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
        </Routes>
      </main>

      
    </div>
  );
}

export default App;
