import "./Home.css"; 
import { Link } from 'react-router-dom';


function HomePage() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Make a Difference, Volunteer Today!</h1>
        <p>Join a community of passionate volunteers working together for a better world.</p>
        <Link to="/login">
          <button className="cta-button">Get Started</button>
        </Link>
      </header>

      <section className="features-section">
        <div className="feature">
          <img src="/images/helping-hands.png" alt="Helping Hands" />
          <h2>Make an Impact</h2>
          <p>Help people in need and contribute to meaningful projects.</p>
        </div>

        <div className="feature">
          <img src="/images/community.png" alt="Community" />
          <h2>Join a Community</h2>
          <p>Meet like-minded individuals and build lasting connections.</p>
        </div>

        <div className="feature">
          <img src="/images/flexible.png" alt="Make a change" />
          <h2>Flexible Volunteering</h2>
          <p>Choose from various opportunities that fit your schedule.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
