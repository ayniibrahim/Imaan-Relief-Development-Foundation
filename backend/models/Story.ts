import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  location: string;
  project?: string;
  program?: string;
  author: string;
  readingTime?: string;
  featured: boolean;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    title: {
      type: String,
      required: [true, 'Story title is required'],
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
      required: [true, 'Story content is required'],
    },
    image: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    location: {
      type: String,
      required: [true, 'Field location is required'],
    },
    project: {
      type: String,
    },
    program: {
      type: String,
    },
    author: {
      type: String,
      default: 'Imaan Field Communications Team',
    },
    readingTime: {
      type: String,
      default: '4 min read',
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

storySchema.index({ slug: 1 });
storySchema.index({ published: 1, publishedAt: -1 });

export const Story = mongoose.models.Story || mongoose.model<IStory>('Story', storySchema);
