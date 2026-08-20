import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Beyond Borders" className="logo-img" />
        </Link>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/destinations" onClick={() => setMenuOpen(false)}>Destinations</NavLink>
          <NavLink to="/packages" onClick={() => setMenuOpen(false)}>Packages</NavLink>
          <NavLink to="/hotels" onClick={() => setMenuOpen(false)}>Hotels</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact us</NavLink>

          <div className="mobile-actions">
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
              <span>♥</span> Wishlist
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              <span>🛒</span> Cart
            </Link>
            <Link to="/book" className="book-btn-mobile" onClick={() => setMenuOpen(false)}>Book now</Link>
          </div>
        </nav>

        <div className="header-actions">
          <Link to="/wishlist" className="icon-link" aria-label="Wishlist">
            <span>♥</span>
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="icon-link" aria-label="Cart">
            <span>🛒</span>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
          <Link to="/book" className="book-btn">Book now</Link>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span style={{ fontSize: '1.5rem' }}>{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
    </header>
  );
}

export default Header;