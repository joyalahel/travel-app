import express, { Request, Response } from 'express';
import Package from '../models/Package.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
const router = express.Router();

// get /api/packages 
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: Record<string, string> = {};
    if (req.query.destination) filter.destination = req.query.destination as string;
    if (req.query.stars) filter.stars = req.query.stars as string;
    if (req.query.roomType) filter.roomType = req.query.roomType as string;

    const packages = await Package.find(filter).populate('destination');
    res.json(packages);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});


// post /api/packages
router.post('/', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const newPackage = new Package(req.body);
    const saved = await newPackage.save();
    res.status(201).json(saved);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});
// put /api/packages/:id 
router.put('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

// delete /api/packages/:id
router.delete('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ message: 'Package deleted successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});
export default router;