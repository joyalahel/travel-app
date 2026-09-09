import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkout } from '../api/api';
import './Checkout.css';

function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return <p className="state-message">Your cart is empty.</p>;
  }

  async function handlePay(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const order = await checkout(items, token);
      clearCart();
      navigate(`/checkout/success?orderId=${order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-summary">
          <h2>Order summary</h2>
          {items.map((item) => (
            <div key={item.hotelId} className="checkout-summary-item">
              <span>{item.hotelName} — {item.nights} nights </span>
              <span>${item.pricePerNight * item.nights}</span>
            </div>
          ))}
          <div className="checkout-summary-total">
            <span>Total </span>
            <span>${totalPrice}</span>
          </div>
        </div>

        <form className="checkout-form" onSubmit={handlePay}>
          <h2>Payment details</h2>
          <div className="form-group">
            <label htmlFor="cardName">Name on card</label>
            <input
              id="cardName"
              value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value })}
              placeholder="Name Surname"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card number</label>
            <input
              id="cardNumber"
              value={card.number}
              onChange={(e) => setCard({ ...card, number: e.target.value })}
              placeholder="**** **** **** ****"
              required
            />
          </div>

          <div className="checkout-form-row">
            <div className="form-group">
              <label htmlFor="expiry">Expiry</label>
              <input
                id="expiry"
                value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvc">CVC</label>
              <input
                id="cvc"
                value={card.cvc}
                onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                placeholder="123"
                required
              />
            </div>
          </div>

          {error && <p className="field-error">{error}</p>}

          <button type="submit" className="pay-btn" disabled={loading}>
            {loading ? 'Processing...' : `Pay $${totalPrice}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;