import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteer extends Document {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  education: string;
  experience?: string;
  availability: string;
  interests: string[];
  message: string;
  cvUrl?: string;
  status: 'New' | 'Reviewing' | 'Approved' | 'Rejected' | 'Contacted';
  notes?: string;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const volunteerSchema = new Schema<IVolunteer>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
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
      required: [true, 'Phone number is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
    },
    interests: {
      type: [String],
      default: [],
    },
    message: {
      type: String,
      required: [true, 'Message or statement of motivation is required'],
    },
    cvUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['New', 'Reviewing', 'Approved', 'Rejected', 'Contacted'],
      default: 'New',
    },
    notes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

volunteerSchema.index({ status: 1, createdAt: -1 });

export const Volunteer = mongoose.models.Volunteer || mongoose.model<IVolunteer>('Volunteer', volunteerSchema);
