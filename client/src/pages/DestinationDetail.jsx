import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDestinations, getPackages } from '../api/api';
import WishlistHeart from '../components/WishlistHeart';
import './DestinationDetail.css';

function DestinationDetail() {
  const { destinationId } = useParams();
  const [destination, setDestination] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    Promise.all([getDestinations(), getPackages({ destination: destinationId })])
      .then(([allDestinations, matchingPackages]) => {
        if (!ignore) {
          const found = allDestinations.find((d) => d._id === destinationId);
          setDestination(found || null);
          setPackages(matchingPackages);
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [destinationId]);

  if (loading) return <p className="state-message">Loading destination...</p>;
  if (error) return <p className="state-message">Error: {error}</p>;
  if (!destination) return <p className="state-message">Destination not found.</p>;

  return (
    <div className="destination-detail-page">
      <Link to="/destinations" className="back-link">← Back to destinations</Link>

      <div className="destination-detail-hero">
        <img src={destination.image} alt={destination.name} />
        <WishlistHeart type="destination" id={destination._id} data={destination} />
        <div className="destination-detail-hero-overlay">
          <h1>{destination.name}</h1>
          {destination.tagline && <p className="destination-detail-tagline">{destination.tagline}</p>}
          <p className="destination-detail-location">{destination.city}, {destination.country}</p>
        </div>
      </div>

      <div className="destination-detail-body">
        <section>
          <h2>About</h2>
          <p>{destination.description}</p>
          <div className="destination-detail-meta">
            {destination.bestSeason && (
              <div className="meta-item">
                <span className="meta-label">Best time to visit</span>
                <span className="meta-value">{destination.bestSeason}</span>
              </div>
            )}
            {packages.length > 0 && (
              <div className="meta-item">
                <span className="meta-label">Packages available</span>
                <span className="meta-value">{packages.length} package{packages.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          {destination.tags?.length > 0 && (
            <div className="destination-detail-tags">
              {destination.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </section>

        {destination.activities?.length > 0 && (
          <section>
            <h2>Things to do</h2>
            <div className="activities-grid">
              {destination.activities.map((activity) => (
                <div key={activity.name} className="activity-card">
                  {activity.image && <img src={activity.image} alt={activity.name} />}
                  <p>{activity.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="destination-detail-actions">
          <Link to={`/packages?destination=${destination._id}`} className="cta-primary">
            Explore packages
          </Link>
          <Link to={`/hotels?destination=${destination._id}`} className="cta-secondary">
            Book a hotel directly
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetail;