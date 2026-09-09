import express, { Response } from 'express';
import Order from '../models/Order.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';


const router = express.Router();

// GET /api/orders - logged-in user's own orders
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// GET /api/orders/:id - a single order (for the confirmation page)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

interface CheckoutItem {
  hotelId: string;
  hotelName: string;
  destinationName: string;
  pricePerNight: number;
  nights: number;
}

// POST /api/orders/checkout - create an order, simulate instant payment
router.post('/checkout', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body as { items: CheckoutItem[] };

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + item.pricePerNight * item.nights,
      0
    );

    const order = new Order({
      user: req.userId,
      items: items.map((item) => ({
        hotel: item.hotelId,
        hotelName: item.hotelName,
        destinationName: item.destinationName,
        pricePerNight: item.pricePerNight,
        nights: item.nights,
      })),
      totalPrice,
      status: 'paid', // simulated payment — instantly marked paid
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

export default router;