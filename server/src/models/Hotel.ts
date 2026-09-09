import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IHotel extends Document {
  package: Types.ObjectId;
  name: string;
  pricePerNight: number;
  image?: string;
  description?: string;
  amenities: string[];
}

const hotelSchema = new Schema<IHotel>({
  package: {
    type: Schema.Types.ObjectId,
    ref: 'Package', //pop
    required: true
  },
  name: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  image: String,
  description: String,
  amenities: [String]
}, { timestamps: true });

export default mongoose.model<IHotel>('Hotel', hotelSchema);