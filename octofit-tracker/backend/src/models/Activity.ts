import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'running' | 'walking' | 'strength_training' | 'cycling' | 'swimming';
  duration: number; // in minutes
  distance?: number; // in kilometers
  intensity: 'low' | 'moderate' | 'high';
  pointsEarned: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['running', 'walking', 'strength_training', 'cycling', 'swimming'],
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    distance: {
      type: Number,
      min: 0
    },
    intensity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate'
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
activitySchema.index({ userId: 1, date: -1 });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
