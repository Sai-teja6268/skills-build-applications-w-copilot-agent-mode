import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  captainId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    description: {
      type: String,
      maxlength: 500
    },
    captainId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    totalPoints: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
teamSchema.index({ captainId: 1 });

export const Team = mongoose.model<ITeam>('Team', teamSchema);
