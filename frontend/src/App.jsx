import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const [backendData, setBackendData] = useState([{}]);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [userLogins, setUserLogins] = useState({
    usernames: ["John Doe"],
    emails: ["johndoe@gmail.com"],
    passwords: ["tree113"],
  });

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => setBackendData(data));
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  async function handleLogin(username, password) {
    try {
      if (userLogins["usernames"].includes(username)) {
        const userIndex = userLogins["usernames"].indexOf(username);
        if (userLogins["passwords"][userIndex] === password) {
          sessionStorage.setItem("auth-token", username);
          navigate("/profile/");
        } else {
          alert("Invalid username/password combination!");
          throw new SyntaxError("Password does not match this username's password");
        }
      } else {
        alert("Invalid username/password combination!");
        throw new SyntaxError("A user with this username does not exist");
      }
    } catch (exception) {
      console.log(exception);
    }
  }

  async function handleRegister(email, username, password) {
    try {
      const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email) {
        alert("Please enter your email!");
        throw new SyntaxError("Email is empty");
      } else if (!email_regex.test(email)) {
        alert("Please enter a valid email address!");
        throw new SyntaxError("Email format is wrong");
      } else if (userLogins["emails"].includes(email)) {
        alert("This email address is already in use!");
        throw new ReferenceError("No 2 accounts can share an email!");
      }

      if (!username) {
        alert("Please enter a username!");
        throw new SyntaxError("Username is empty");
      } else if (userLogins["usernames"].includes(username)) {
        alert("This username is already in use!");
        throw new ReferenceError("No 2 accounts can share the same username!");
      }

      if (!password) {
        alert("Please enter a password!");
        throw new SyntaxError("Password is empty");
      }

      userLogins["usernames"].push(username);
      userLogins["passwords"].push(password);
      userLogins["emails"].push(email);
      navigate("/login/");
      alert("Succesfully registered account!");
    } catch (exception) {
      console.log(exception);
    }
  }

  return (
    <div>
      <header id="header_div">
        <p>Volunteer Site</p>
        <div className="dropdown">
          <button className="dropdown-btn" onClick={toggleDropdown}>Menu ▼</button>
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
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage handleRegister={handleRegister} />} />
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
