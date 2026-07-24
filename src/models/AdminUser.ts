import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['ADMIN'],
        message: '{VALUE} is not a valid role',
      },
      default: 'ADMIN',
      required: [true, 'Role is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compiling the model on hot-reloads in development
export const AdminUser =
  (mongoose.models.AdminUser as Model<IAdminUser>) ||
  mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
