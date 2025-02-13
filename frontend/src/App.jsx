import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx"; 
import ProfilePage from "./Pages/ProfilePage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import EventPage from "./Pages/EventPage.jsx";
import Notifications from "./Pages/Notifications.jsx";
import ParticipationHistory from "./Pages/ParticipationHistory.jsx";
import "./App.css";

function App() {
  return (
      <div>
        <header id="header_div"> 
          <p>Volunteer Site</p>
          <nav>
            <Link to="/">Home</Link>|  
            <Link to="/login">Login</Link>|  
            <Link to="/register">Register</Link>|  
            <Link to="/profile">Profile</Link>|
            <Link to="/event">Event Management</Link>|
            <Link to="/notifications">Notifications</Link>|
            <Link to="/participation-history">Volunteer History</Link> 
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* Use HomePage Component */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/event" element={<EventPage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/participation-history" element={<ParticipationHistory />} />
          </Routes>
        </main>

        <footer id="footer_div"></footer>  
      </div>
  );
}

export default App;
