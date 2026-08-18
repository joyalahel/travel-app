import express, { Request, Response } from 'express';
import Destination from '../models/Destination.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// get for all
router.get('/', async (req: Request, res: Response) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// post admin
router.post('/', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const destination = new Destination(req.body);
    const savedDestination = await destination.save();
    res.status(201).json(savedDestination);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

// put admin
router.put('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

// delete admin
router.delete('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json({ message: 'Destination deleted successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;