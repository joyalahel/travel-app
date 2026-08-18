import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  country: string;
  city: string;
  description?: string;
  tags: string[];
  image?: string;
}

const destinationSchema = new Schema<IDestination>({
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  description: String,
  tags: [String],
  image: String,
}, { timestamps: true });

export default mongoose.model<IDestination>('Destination', destinationSchema);