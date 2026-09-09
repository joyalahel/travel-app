import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

function Cart() {
  const { items, removeFromCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your cart</h1>
        <p className="state-message">
          Your cart is empty. <Link to="/packages">Browse packages</Link> to get started.
        </p>
      </div>
    );
  }

  function handleCheckout() {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  }

  return (
    <div className="cart-page">
      <h1>Your cart</h1>

      <div className="cart-list">
        {items.map((item) => (
          <div key={item.hotelId} className="cart-item">
            {item.hotelImage && <img src={item.hotelImage} alt={item.hotelName} />}
            <div className="cart-item-body">
              <h3>{item.hotelName}</h3>
              <p className="cart-item-location">
                {item.destinationCity}, {item.destinationCountry}
              </p>
              <div className="cart-item-details">
                <span>{'★'.repeat(item.stars)}</span>
                <span className="room-type">{item.roomType}</span>
                <span>{item.nights} nights</span>
              </div>
            </div>
            <div className="cart-item-price">
              <p>${item.pricePerNight} / night</p>
              <p className="cart-item-subtotal">${item.pricePerNight * item.nights} total</p>
              <button type="button" onClick={() => removeFromCart(item.hotelId)} className="remove-btn">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div>
          <p className="summary-label">Total</p>
          <p className="summary-total">${totalPrice}</p>
        </div>
        <button type="button" className="checkout-btn" onClick={handleCheckout}>
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;