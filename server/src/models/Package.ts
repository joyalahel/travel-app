import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPackage extends Document {
  destination: Types.ObjectId;
  stars: 3 | 4 | 5;
  roomType: 'standard' | 'deluxe' | 'suite';
  nights: number;
}

const packageSchema = new Schema<IPackage>({
  destination: {
    type: Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  stars: {
    type: Number,
    enum: [3, 4, 5],
    required: true
  },
  roomType: {
    type: String,
    enum: ['standard', 'deluxe', 'suite'],
    required: true
  },
  nights: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model<IPackage>('Package', packageSchema);