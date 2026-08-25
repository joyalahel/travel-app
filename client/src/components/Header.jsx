import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext';
import logo from '../assets/logo.png';

import './Header.css';

function Header() {
  const [cartCount] = useState(0);
  const { items: wishlistItems, clearWishlist } = useWishlist();
  const wishlistCount = wishlistItems.length;
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  function handleSignOut() {
    logout();
    clearWishlist();
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo-link">
          <img src={logo} alt="TravelGo" className="logo-img" />
        </Link>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/destinations" onClick={() => setMenuOpen(false)}>Destinations</NavLink>
          <NavLink to="/packages" onClick={() => setMenuOpen(false)}>Packages</NavLink>
          <NavLink to="/hotels" onClick={() => setMenuOpen(false)}>Hotels</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact us</NavLink>
          {user?.role === 'admin' && (
               <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          )}
          <div className="mobile-actions">
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
              <span>♥</span> Wishlist
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              <span>🛒</span> Cart
            </Link>
            {user ? (
              <button type="button" className="book-btn-mobile" onClick={() => { handleSignOut(); setMenuOpen(false); }}>
                Sign out
              </button>
            ) : (
              <Link to="/login" className="book-btn-mobile" onClick={() => setMenuOpen(false)}>Sign in</Link>
            )}
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

          {user ? (
            <button type="button" className="signin-btn" onClick={handleSignOut}>
              {user.name} · Sign out
            </button>
          ) : (
            <Link to="/login" className="signin-btn">Sign in</Link>
          )}

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