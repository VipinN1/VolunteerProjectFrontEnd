import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx"; 
import ProfilePage from "./Pages/ProfilePage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import EventPage from "./Pages/EventPage.jsx";

function App() {
  return (
      <div>
        <header id="header_div"> 
        <h2>__________</h2>
          <nav>
            <Link to="/">Home</Link>|  
            <Link to="/login">Login</Link>|  
            <Link to="/register">Register</Link>|  
            <Link to="/profile">Profile</Link>|
            <Link to="/event">Event Management</Link> 
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* Use HomePage Component */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/event" element={<EventPage />} />
          </Routes>
        </main>

        <footer id="footer_div"></footer>  
      </div>
  );
}

export default App;
