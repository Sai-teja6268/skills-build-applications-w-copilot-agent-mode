import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  workoutType: 'running' | 'walking' | 'strength_training' | 'cycling' | 'swimming';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in minutes
  targetIntensity: 'low' | 'moderate' | 'high';
  completed: boolean;
  completedDate?: Date;
  suggestedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    workoutType: {
      type: String,
      enum: ['running', 'walking', 'strength_training', 'cycling', 'swimming'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    estimatedDuration: {
      type: Number,
      required: true,
      min: 5,
      max: 180
    },
    targetIntensity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate'
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: {
      type: Date
    },
    suggestedDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
workoutSchema.index({ userId: 1, completed: 1 });

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
