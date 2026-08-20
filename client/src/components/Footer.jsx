import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>Beyond Borders</h4>
          <p>Find your next trip, curated and ready to book.</p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/destinations">Destinations</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/hotels">Hotels</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/book">Book now</Link>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <Link to="/contact">Contact us</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Beyond Borders. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;