import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx"; 
import ProfilePage from "./Pages/ProfilePage.jsx";

function App() {
  return (
      <div> 
        <header id="header_div"> 
          <h2>__________</h2>
          <nav>
            <Link to="/">Home</Link> |  
            <Link to="/login">Login</Link> |  
            <Link to="/profile">Profile</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* Use HomePage Component */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>

        <footer id="footer_div"></footer>  
      </div>
  );
}

export default App;
