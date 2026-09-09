import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderItem {
  hotel: Types.ObjectId;
  hotelName: string;
  destinationName: string;
  pricePerNight: number;
  nights: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: 'pending' | 'paid' | 'cancelled';
}

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    hotelName: { type: String, required: true },
    destinationName: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    nights: { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', orderSchema);