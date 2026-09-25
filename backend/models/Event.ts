import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  image: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  isVirtual: boolean;
  registrationUrl?: string;
  status: 'Upcoming' | 'Past' | 'Ongoing' | 'Cancelled';
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    image: {
      type: String,
      required: [true, 'Event banner is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    registrationUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Past', 'Ongoing', 'Cancelled'],
      default: 'Upcoming',
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ slug: 1 });
eventSchema.index({ date: 1, published: 1 });

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
