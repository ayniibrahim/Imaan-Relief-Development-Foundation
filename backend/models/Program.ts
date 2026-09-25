import mongoose, { Schema, Document } from 'mongoose';

export interface IProgram extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  icon?: string;
  category: string;
  objectives: string[];
  targetBeneficiaries: string;
  locations: string[];
  status: 'active' | 'upcoming' | 'completed' | 'on_hold';
  featured: boolean;
  published: boolean;
  order: number;
  stats?: {
    metricValue: string;
    metricLabel: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<IProgram>(
  {
    title: {
      type: String,
      required: [true, 'Program title is required'],
      trim: true,
      maxlength: 150,
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
      required: [true, 'Full description is required'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    icon: {
      type: String,
      default: 'category',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    objectives: {
      type: [String],
      default: [],
    },
    targetBeneficiaries: {
      type: String,
      default: '',
    },
    locations: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'upcoming', 'completed', 'on_hold'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    stats: [
      {
        metricValue: String,
        metricLabel: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

programSchema.index({ slug: 1 });
programSchema.index({ category: 1, published: 1 });

export const Program = mongoose.models.Program || mongoose.model<IProgram>('Program', programSchema);
