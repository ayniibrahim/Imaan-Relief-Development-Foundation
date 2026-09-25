import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: string;
  tags?: string[];
  featured: boolean;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
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
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: 350,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    featuredImage: {
      type: String,
      required: [true, 'Featured image is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Emergency Update',
    },
    author: {
      type: String,
      default: 'Imaan Press Office',
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

newsSchema.index({ slug: 1 });
newsSchema.index({ published: 1, publishedAt: -1 });

export const News = mongoose.models.News || mongoose.model<INews>('News', newsSchema);
