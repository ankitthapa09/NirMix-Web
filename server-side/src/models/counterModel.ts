import mongoose, { Document, Schema } from 'mongoose';

// One document per reference-code combination, e.g. { _id: "SALE-LAND", seq: 12 }.
export interface ICounter extends Document<string> {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model<ICounter>('Counter', counterSchema);

export default Counter;
