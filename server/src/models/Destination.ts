import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity {
  name: string;
  image?: string;
}

export interface IDestination extends Document {
  name: string;
  country: string;
  city: string;
  description?: string;
  tagline?: string;
  bestSeason?: string;
  tags: string[];
  activities: IActivity[];
  image?: string;
}

const destinationSchema = new Schema<IDestination>({
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  description: String,
  tagline: String,
  bestSeason: String,
  tags: [String],
  activities: [{ name: String, image: String }],
  image: String,
}, { timestamps: true });

export default mongoose.model<IDestination>('Destination', destinationSchema);