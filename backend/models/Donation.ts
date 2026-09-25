import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  donorName: string;
  email: string;
  phone?: string;
  amount: number;
  currency: string;
  frequency: 'One-time' | 'Monthly';
  purpose: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'pledged';
  transactionReference: string;
  coverFees: boolean;
  feeAmount?: number;
  totalCharged?: number;
  dedication?: {
    honoreeName?: string;
    recipientEmail?: string;
    message?: string;
  };
  billingCountry?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    donorName: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Donation amount must be at least 1'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    frequency: {
      type: String,
      enum: ['One-time', 'Monthly'],
      default: 'One-time',
    },
    purpose: {
      type: String,
      required: [true, 'Donation purpose is required'],
      default: 'Where Needed Most',
    },
    paymentMethod: {
      type: String,
      default: 'Card (Stripe / Bank Intent)',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'pledged'],
      default: 'completed',
    },
    transactionReference: {
      type: String,
      unique: true,
      required: true,
    },
    coverFees: {
      type: Boolean,
      default: true,
    },
    feeAmount: {
      type: Number,
      default: 0,
    },
    totalCharged: {
      type: Number,
      default: 0,
    },
    dedication: {
      honoreeName: String,
      recipientEmail: String,
      message: String,
    },
    billingCountry: {
      type: String,
      default: 'United States',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

donationSchema.index({ transactionReference: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ paymentStatus: 1 });

export const Donation = mongoose.models.Donation || mongoose.model<IDonation>('Donation', donationSchema);
