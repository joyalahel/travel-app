import { useState, useEffect } from 'react';
import { getPackages } from '../api/api';
import WishlistHeart from '../components/WishlistHeart';
import { Link } from 'react-router-dom';
import './Packages.css';

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [starsFilter, setStarsFilter] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    const filters = {};
    if (starsFilter) filters.stars = starsFilter;
    if (roomTypeFilter) filters.roomType = roomTypeFilter;

    getPackages(filters)
      .then((data) => {
        if (!ignore) setPackages(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [starsFilter, roomTypeFilter]);

  return (
    <div className="packages-page">
      <div className="packages-header">
        <h1>Travel packages</h1>
        <p>Pick your stars, room type, and find the perfect fit.</p>
      </div>

      <div className="packages-filters">
        <select value={starsFilter} onChange={(e) => setStarsFilter(e.target.value)}>
          <option value="">All stars</option>
          <option value="3">3 stars</option>
          <option value="4">4 stars</option>
          <option value="5">5 stars</option>
        </select>

        <select value={roomTypeFilter} onChange={(e) => setRoomTypeFilter(e.target.value)}>
          <option value="">All room types</option>
          <option value="standard">Standard</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
        </select>
      </div>

      {loading && <p className="state-message">Loading packages...</p>}
      {error && <p className="state-message">Error: {error}</p>}

      {!loading && !error && packages.length === 0 && (
        <p className="state-message">No packages match these filters.</p>
      )}

      <div className="packages-grid">
        {packages.map((pkg) => (
          <Link to={`/packages/${pkg._id}`} key={pkg._id} className="package-card">
            <WishlistHeart type="package" id={pkg._id} data={pkg} />
            {pkg.destination?.image && (
              <img src={pkg.destination.image} alt={pkg.destination?.name} />
            )}
            <div className="package-card-body">
              <h3>{pkg.destination?.name || 'Unknown destination'}</h3>
              <p className="package-location">
                {pkg.destination?.city}, {pkg.destination?.country}
              </p>

              <div className="package-details">
                <span className="stars">{'★'.repeat(pkg.stars)}</span>
                <span className="room-type">{pkg.roomType}</span>
              </div>

              <p className="nights">{pkg.nights} nights</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Packages;