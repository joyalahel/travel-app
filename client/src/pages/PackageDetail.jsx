import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHotels } from '../api/api';
import WishlistHeart from '../components/WishlistHeart';
import './PackageDetail.css';

function PackageDetail() {
  const { packageId } = useParams();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <span className="stars">{'★'.repeat(pkg.stars)}</span>
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
            className={`hotel-option ${selectedHotel?._id === hotel._id ? 'selected' : ''}`}
            onClick={() => setSelectedHotel(hotel)}
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
          <Link to="/book" className="book-now-btn">Book now</Link>
        </div>
      )}
    </div>
  );
}

export default PackageDetail;