import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied' | 'Archived';
  replyNotes?: string;
  repliedAt?: Date;
  repliedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
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
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    status: {
      type: String,
      enum: ['New', 'Read', 'Replied', 'Archived'],
      default: 'New',
    },
    replyNotes: {
      type: String,
      default: '',
    },
    repliedAt: {
      type: Date,
    },
    repliedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });

export const ContactMessage = mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);
