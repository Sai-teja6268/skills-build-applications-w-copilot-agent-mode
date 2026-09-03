import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboard extends Document {
  userId: mongoose.Types.ObjectId;
  points: number;
  rank: number;
  activitiesCount: number;
  lastActivityDate?: Date;
  period: 'weekly' | 'monthly' | 'all_time';
  updatedAt: Date;
}

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    points: {
      type: Number,
      default: 0
    },
    rank: {
      type: Number,
      default: 0
    },
    activitiesCount: {
      type: Number,
      default: 0
    },
    lastActivityDate: {
      type: Date
    },
    period: {
      type: String,
      enum: ['weekly', 'monthly', 'all_time'],
      default: 'all_time'
    }
  },
  {
    timestamps: false
  }
);

// Index for efficient queries
leaderboardSchema.index({ period: 1, rank: 1 });
leaderboardSchema.index({ period: 1, points: -1 });

export const Leaderboard = mongoose.model<ILeaderboard>('Leaderboard', leaderboardSchema);
