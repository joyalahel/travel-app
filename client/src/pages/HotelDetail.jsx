import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getHotels } from '../api/api';
import WishlistHeart from '../components/WishlistHeart';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Rating from '@mui/material/Rating';
import './HotelDetail.css';
const AMENITY_ICONS = {
  pool: '🏊',
  wifi: '📶',
  gym: '💪',
  spa: '💆',
  parking: '🚗',
  breakfast: '🍳',
  'air conditioning': '❄️',
  bar: '🍸',
  restaurant: '🍽️',
};

function amenityIcon(name) {
  return AMENITY_ICONS[name.toLowerCase()] || '✓';
}

function HotelDetail() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [siblingHotels, setSiblingHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    getHotels()
      .then((allHotels) => {
        if (!ignore) {
          const found = allHotels.find((h) => h._id === hotelId);
          setHotel(found || null);

          if (found?.package?._id) {
            const siblings = allHotels.filter(
              (h) => h.package?._id === found.package._id && h._id !== hotelId
            );
            setSiblingHotels(siblings);
          }
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [hotelId]);

  if (loading) return <p className="state-message">Loading hotel...</p>;
  if (error) return <p className="state-message">Error: {error}</p>;
  if (!hotel) return <p className="state-message">Hotel not found.</p>;

  const pkg = hotel.package;
  const dest = pkg?.destination;
  const totalPrice = pkg ? hotel.pricePerNight * pkg.nights : hotel.pricePerNight;

  function handleAddToCart() {
    if (!pkg) return;
    addToCart({
      hotelId: hotel._id,
      hotelName: hotel.name,
      hotelImage: hotel.image,
      pricePerNight: hotel.pricePerNight,
      packageId: pkg._id,
      destinationName: dest?.name,
      destinationCity: dest?.city,
      destinationCountry: dest?.country,
      stars: pkg.stars,
      roomType: pkg.roomType,
      nights: pkg.nights,
    });
    showToast(`${hotel.name} added to cart!`);
    navigate('/cart');
  }

  return (
    <div className="hotel-detail-page">
      <Link to="/hotels" className="back-link">← Back to hotels</Link>

      <div className="hotel-detail-hero">
        {hotel.image && <img src={hotel.image} alt={hotel.name} />}
        <WishlistHeart type="hotel" id={hotel._id} data={hotel} />
        <div className="hotel-detail-hero-overlay">
          <h1>{hotel.name}</h1>
          {dest && (
            <p className="hotel-detail-location">
              <Link to={`/destinations/${dest._id}`}>{dest.city}, {dest.country}</Link>
            </p>
          )}
        </div>
      </div>

      <div className="hotel-detail-body">
        <div className="hotel-detail-main">
          {pkg && (
            <div className="hotel-detail-package-info">
              <Rating value={pkg.stars} readOnly />
              <span className="room-type">{pkg.roomType}</span>
              <span>{pkg.nights} nights</span>
            </div>
          )}

          <section>
            <h2>About this hotel</h2>
            <p>{hotel.description || 'No description available.'}</p>
          </section>

          {hotel.amenities?.length > 0 && (
            <section>
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="amenity-item">
                    <span className="amenity-icon">{amenityIcon(amenity)}</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {dest && (
            <section>
              <Link to={`/destinations/${dest._id}`} className="explore-destination-link">
                Explore {dest.name} →
              </Link>
            </section>
          )}

          {siblingHotels.length > 0 && (
            <section>
              <h2>Other hotels in this package</h2>
              <div className="sibling-hotels">
                {siblingHotels.map((h) => (
                  <Link to={`/hotels/${h._id}`} key={h._id} className="sibling-hotel-card">
                    {h.image && <img src={h.image} alt={h.name} />}
                    <div>
                      <p className="sibling-name">{h.name}</p>
                      <p className="sibling-price">${h.pricePerNight} / night</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="hotel-detail-sidebar">
          <div className="price-card">
            <p className="price-per-night">${hotel.pricePerNight}<span> / night</span></p>
            {pkg && (
              <p className="price-total">${totalPrice} total for {pkg.nights} nights</p>
            )}
            <button type="button" className="book-btn" onClick={handleAddToCart}>
              {isInCart(hotel._id) ? 'Already in cart' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetail;