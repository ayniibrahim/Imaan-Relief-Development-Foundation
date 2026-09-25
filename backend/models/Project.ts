import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  location: string;
  startDate?: string;
  endDate?: string;
  status: 'Upcoming' | 'Active' | 'Completed' | 'On Hold';
  targetBeneficiaries: string;
  beneficiariesReached: string;
  program: string; // program id or category
  programTitle?: string;
  featured: boolean;
  images: string[];
  coverImage: string;
  objectives: string[];
  activities: string[];
  results: string[];
  budgetGoal?: number;
  fundsRaised?: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
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
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: 300,
    },
    description: {
      type: String,
      required: [true, 'Full project description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Active', 'Completed', 'On Hold'],
      default: 'Active',
    },
    targetBeneficiaries: {
      type: String,
      default: '',
    },
    beneficiariesReached: {
      type: String,
      default: '',
    },
    program: {
      type: String,
      required: [true, 'Associated program is required'],
    },
    programTitle: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    objectives: {
      type: [String],
      default: [],
    },
    activities: {
      type: [String],
      default: [],
    },
    results: {
      type: [String],
      default: [],
    },
    budgetGoal: {
      type: Number,
      default: 0,
    },
    fundsRaised: {
      type: Number,
      default: 0,
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

projectSchema.index({ slug: 1 });
projectSchema.index({ status: 1, published: 1 });

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
