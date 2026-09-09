import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../api/api';
import WishlistHeart from '../components/WishlistHeart';
import './Destinations.css';

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    getDestinations()
      .then((data) => {
        if (!ignore) setDestinations(data);
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

  if (loading) return <p className="state-message">Loading destinations...</p>;
  if (error) return <p className="state-message">Error: {error}</p>;

  return (
    <div className="destinations-page">
      <div className="destinations-header">
        <h1>Explore destinations</h1>
        <p>Find your next trip, curated and ready to book.</p>
      </div>

      <div className="destinations-grid">
        {destinations.map((dest) => (
          <Link to={`/destinations/${dest._id}`} key={dest._id} className="destination-card-link">
            <div className="destination-card">
              <WishlistHeart type="destination" id={dest._id} data={dest} />
              <img src={dest.image} alt={dest.name} />
              <div className="destination-card-body">
                <h3>{dest.name}</h3>
                <p className="destination-card-location">{dest.city}, {dest.country}</p>
                <p className="description">{dest.description}</p>
                {dest.tags && dest.tags.length > 0 && (
                  <div className="destination-tags">
                    {dest.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Destinations;