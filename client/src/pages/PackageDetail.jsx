import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getHotels } from '../api/api';
import WishlistHeart from '../components/WishlistHeart';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Rating from '@mui/material/Rating';
import './PackageDetail.css';

function PackageDetail() {
  const { packageId } = useParams();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    getHotels({ package: packageId })
      .then((data) => {
        if (!ignore) {
          setHotels(data);
          if (data.length > 0) setSelectedHotel(data[0]);
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [packageId]);

  if (loading) return <p className="state-message">Loading package...</p>;
  if (error) return <p className="state-message">Error: {error}</p>;
  if (hotels.length === 0) return <p className="state-message">No hotels found for this package.</p>;

  const pkg = selectedHotel?.package;
  const dest = pkg?.destination;

  function handleAddToCart() {
    if (!selectedHotel || !pkg) return;
    addToCart({
      hotelId: selectedHotel._id,
      hotelName: selectedHotel.name,
      hotelImage: selectedHotel.image,
      pricePerNight: selectedHotel.pricePerNight,
      packageId: pkg._id,
      destinationName: dest?.name,
      destinationCity: dest?.city,
      destinationCountry: dest?.country,
      stars: pkg.stars,
      roomType: pkg.roomType,
      nights: pkg.nights,
    });
    showToast(`${selectedHotel.name} added to cart!`);
    navigate('/cart');
  }

  return (
    <div className="package-detail-page">
      <Link to="/packages" className="back-link">← Back to packages</Link>

      {dest && (
        <div className="package-detail-header">
          <img src={dest.image} alt={dest.name} className="package-detail-hero" />
          <div className="package-detail-info">
            <h1>{dest.name}</h1>
            <p className="package-detail-location">{dest.city}, {dest.country}</p>
            <div className="package-detail-tags">
              <span className="stars">{<Rating value={pkg.stars} readOnly size="small" />}</span>
              <span className="room-type">{pkg.roomType}</span>
              <span className="nights">{pkg.nights} nights</span>
            </div>
          </div>
        </div>
      )}

      <h2>Choose your hotel</h2>
      <div className="hotel-options">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            role="button"
            tabIndex={0}
            className={`hotel-option ${selectedHotel?._id === hotel._id ? 'selected' : ''}`}
            onClick={() => setSelectedHotel(hotel)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedHotel(hotel);
              }
            }}
          >
            <WishlistHeart type="hotel" id={hotel._id} data={hotel} />
            {hotel.image && <img src={hotel.image} alt={hotel.name} />}
            <div className="hotel-option-body">
              <h3>{hotel.name}</h3>
              {hotel.description && <p>{hotel.description}</p>}
              <p className="hotel-option-price">${hotel.pricePerNight}<span> / night</span></p>
            </div>
          </div>
        ))}
      </div>

      {selectedHotel && (
        <div className="package-detail-summary">
          <div>
            <p className="summary-label">Selected</p>
            <p className="summary-value">{selectedHotel.name}</p>
          </div>
          <div>
            <p className="summary-label">Total estimate</p>
            <p className="summary-value">${selectedHotel.pricePerNight * pkg.nights}</p>
          </div>
          <button type="button" className="book-now-btn" onClick={handleAddToCart}>
            {isInCart(selectedHotel._id) ? 'Already in cart' : 'Book now'}
          </button>
        </div>
      )}
    </div>
  );
}

export default PackageDetail;