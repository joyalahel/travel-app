import express, { Request, Response } from 'express';
import Hotel from '../models/Hotel.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
const router = express.Router();

// get /api/hotels 
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: Record<string, string> = {};
    if (req.query.package) filter.package = req.query.package as string;

    const hotels = await Hotel.find(filter).populate({
      path: 'package',
      populate: { path: 'destination' }
    });
    res.json(hotels);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// post /api/hotels
router.post('/', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const newHotel = new Hotel(req.body);
    const saved = await newHotel.save();
    res.status(201).json(saved);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

// put /api/hotels/:id
router.put('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const updated = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

// delete /api/hotels/:id
router.delete('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const deleted = await Hotel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}); 
export default router;