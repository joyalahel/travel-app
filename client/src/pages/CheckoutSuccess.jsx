import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getOrder } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './CheckoutSuccess.css';

function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    if (!orderId) {
      setLoading(false);
      return;
    }

    getOrder(orderId, token)
      .then((data) => { if (!ignore) setOrder(data); })
      .catch(() => {})
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [orderId, token]);

  if (loading) return <p className="state-message">Loading confirmation...</p>;

  return (
    <div className="checkout-success-page">
      <div className="success-icon">✓</div>
      <h1>Booking confirmed</h1>
      <p>Thank you — your trip is booked.</p>

      {order && (
        <div className="success-order-summary">
          {order.items.map((item, i) => (
            <div key={i} className="success-item">
              <span>{item.hotelName} — {item.destinationName}</span>
              <span>${item.pricePerNight * item.nights}</span>
            </div>
          ))}
          <div className="success-total">
            <span>Total paid</span>
            <span>${order.totalPrice}</span>
          </div>
        </div>
      )}

      <Link to="/destinations" className="success-cta">Explore more destinations</Link>
    </div>
  );
}

export default CheckoutSuccess;