import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, required: true },
    },
    action: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
    },
    resourceId: {
      type: String,
    },
    details: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
