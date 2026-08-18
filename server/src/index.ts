import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import destinationRoutes from './routes/destinations.js';
import packageRoutes from './routes/packages.js';
import hotelRoutes from './routes/hotels.js';
import authRoutes from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('database connected'))
  .catch((err) => console.error('connection error:', err));

app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('api is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));