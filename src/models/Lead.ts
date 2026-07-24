import mongoose, { Schema, Document, Model } from 'mongoose';
import { LEAD_STATUSES, BUDGET_RANGES, LeadStatus, BudgetRange } from '@/constants/lead';

export interface ILead extends Document {
  name: string;
  email: string;
  budget: BudgetRange;
  message: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    budget: {
      type: String,
      required: [true, 'Budget range is required'],
      enum: {
        values: BUDGET_RANGES,
        message: '{VALUE} is not a valid budget range',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: LEAD_STATUSES,
        message: '{VALUE} is not a valid status',
      },
      default: 'NEW',
    },
  },
  {
    timestamps: true,
  }
);

// Define compound index for filtering by status and sorting by newest first
LeadSchema.index({ status: 1, createdAt: -1 });

// Prevent re-compiling the model on hot-reloads in development
export const Lead = (mongoose.models.Lead as Model<ILead>) || mongoose.model<ILead>('Lead', LeadSchema);
