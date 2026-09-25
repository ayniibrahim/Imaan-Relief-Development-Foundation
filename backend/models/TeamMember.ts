import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  position: string;
  biography: string;
  photo: string;
  email?: string;
  department: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    position: {
      type: String,
      required: [true, 'Position/Title is required'],
      trim: true,
    },
    biography: {
      type: String,
      required: [true, 'Biography is required'],
    },
    photo: {
      type: String,
      required: [true, 'Photo URL is required'],
    },
    email: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      default: 'Leadership & Board of Trustees',
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
    },
    order: {
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

teamMemberSchema.index({ order: 1, published: 1 });

export const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
