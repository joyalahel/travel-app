import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <img src={logo} alt="Beyond Borders" className="home-hero-logo" />
        <h1>Beyond Borders</h1>
        <p>Curated travel packages, real destinations, and an AI travel assistant to help you find your next trip.</p>
        <Link to="/destinations" className="home-cta">Explore destinations</Link>
      </section>

      <section className="home-section">
        <h2>Our story</h2>
        <p>
          Beyond Borders started with a simple idea: choosing a trip shouldn't mean
          scrolling through endless listings with no real guidance. We built a
          curated catalog of destinations, hotels, and packages — paired with an
          AI assistant that actually understands what you're looking for — so you
          can go from "I don't know where to go" to a booked trip in minutes.
        </p>
      </section>

      <section className="home-section">
        <h2>Our locations</h2>
        <div className="locations-grid">
          <div className="location-card">
            <h3>Head office</h3>
            <p>Beirut, Lebanon</p>
          </div>
          <div className="location-card">
            <h3>Support hub</h3>
            <p>Remote / online</p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2>Opening hours</h2>
        <table className="hours-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monday – Friday</td>
              <td>9:00 AM – 6:00 PM</td>
            </tr>
            <tr>
              <td>Saturday</td>
              <td>10:00 AM – 4:00 PM</td>
            </tr>
            <tr>
              <td>Sunday</td>
              <td>Closed</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Home;