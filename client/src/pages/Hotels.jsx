import { useState, useEffect } from 'react';
import { getHotels } from '../api/api';
import WishlistHeart from '../components/WishlistHeart';
import './Hotels.css';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [starsFilter, setStarsFilter] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    let ignore = false;

    getHotels()
      .then((data) => {
        if (!ignore) setHotels(data);
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
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const pkg = hotel.package;
    if (starsFilter && pkg?.stars !== Number(starsFilter)) return false;
    if (roomTypeFilter && pkg?.roomType !== roomTypeFilter) return false;
    if (maxPrice && hotel.pricePerNight > Number(maxPrice)) return false;
    return true;
  });

  if (loading) return <p className="state-message">Loading hotels...</p>;
  if (error) return <p className="state-message">Error: {error}</p>;

  return (
    <div className="hotels-page">
      <div className="hotels-header">
        <h1>Hotels</h1>
        <p>Browse hotels across all our destinations and packages.</p>
      </div>

      <div className="hotels-filters">
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

        <input
          type="number"
          placeholder="Max price / night"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {filteredHotels.length === 0 && (
        <p className="state-message">No hotels match these filters.</p>
      )}

      <div className="hotels-grid">
        {filteredHotels.map((hotel) => {
          const pkg = hotel.package;
          const dest = pkg?.destination;

          return (
            <div key={hotel._id} className="hotel-card">
              <WishlistHeart type="hotel" id={hotel._id} data={hotel} />
              {hotel.image && <img src={hotel.image} alt={hotel.name} />}
              <div className="hotel-card-body">
                <h3>{hotel.name}</h3>
                {dest && (
                  <p className="hotel-location">{dest.city}, {dest.country}</p>
                )}
                {hotel.description && (
                  <p className="hotel-description">{hotel.description}</p>
                )}

                {pkg && (
                  <div className="hotel-package-info">
                    <span className="stars">{'★'.repeat(pkg.stars)}</span>
                    <span className="room-type">{pkg.roomType}</span>
                    <span className="nights">{pkg.nights} nights</span>
                  </div>
                )}

                <p className="hotel-price">${hotel.pricePerNight}<span> / night</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Hotels;