import { useWishlist } from '../context/WishlistContext';
import WishlistHeart from '../components/WishlistHeart';
import './Wishlist.css';

function Wishlist() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <h1>Your wishlist</h1>
        <p className="state-message">Nothing saved yet — tap the heart on any destination, package, or hotel to add it here.</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1>Your wishlist</h1>
      <div className="wishlist-grid">
        {items.map(({ type, id, data }) => (
          <div key={`${type}-${id}`} className="wishlist-card">
            <WishlistHeart type={type} id={id} data={data} />
            {data.image && <img src={data.image} alt={data.name || 'Saved item'} />}
            {!data.image && data.destination?.image && (
              <img src={data.destination.image} alt={data.destination?.name} />
            )}
            <div className="wishlist-card-body">
              <span className="wishlist-type">{type}</span>
              <h3>{data.name || data.destination?.name || 'Saved item'}</h3>
              {data.city && data.country && (
                <p className="wishlist-location">{data.city}, {data.country}</p>
              )}
              {data.pricePerNight && (
                <p className="wishlist-price">${data.pricePerNight} / night</p>
              )}
              {data.stars && (
                <p className="wishlist-stars">{'★'.repeat(data.stars)} {data.roomType}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;