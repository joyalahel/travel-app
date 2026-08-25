import { useWishlist } from '../context/WishlistContext';
import './WishlistHeart.css';

function WishlistHeart({ type, id, data }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(type, id);

  return (
    <button
      type="button"
      className={`wishlist-heart ${active ? 'active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(type, id, data);
      }}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {active ? '♥' : '♡'}
    </button>
  );
}

export default WishlistHeart;