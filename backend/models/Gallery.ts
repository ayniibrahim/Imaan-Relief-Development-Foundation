import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  description: string;
  image: string;
  thumbnail?: string;
  category: string;
  project?: string;
  location?: string;
  year?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, 'Gallery item title is required'],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    thumbnail: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Field Missions',
    },
    project: {
      type: String,
    },
    location: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      default: '2025',
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

gallerySchema.index({ category: 1, published: 1 });

export const Gallery = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', gallerySchema);
