import express, { Response } from 'express';
import { Activity, User, Leaderboard } from '../models';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = express.Router();

// Point calculation helper
function calculatePoints(
  type: string,
  duration: number,
  intensity: string,
  distance?: number
): number {
  let basePoints = 0;

  // Base points by activity type
  const typePoints: Record<string, number> = {
    walking: 2,
    running: 5,
    cycling: 4,
    swimming: 6,
    strength_training: 4
  };

  basePoints = typePoints[type] || 2;

  // Multiply by duration (points per minute)
  let points = basePoints * duration;

  // Add intensity multiplier
  const intensityMultipliers: Record<string, number> = {
    low: 1,
    moderate: 1.5,
    high: 2
  };

  points = points * (intensityMultipliers[intensity] || 1);

  // Add distance bonus if available
  if (distance && distance > 0) {
    points += distance * 0.5;
  }

  return Math.round(points);
}

// Log a new activity
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, duration, distance, intensity, notes } = req.body;
    const userId = req.user?.id;

    // Validation
    if (!type || !duration) {
      return res.status(400).json({ message: 'Type and duration are required' });
    }

    if (!['running', 'walking', 'strength_training', 'cycling', 'swimming'].includes(type)) {
      return res.status(400).json({ message: 'Invalid activity type' });
    }

    // Calculate points
    const pointsEarned = calculatePoints(type, duration, intensity || 'moderate', distance);

    // Create activity
    const activity = new Activity({
      userId,
      type,
      duration,
      distance,
      intensity: intensity || 'moderate',
      pointsEarned,
      notes
    });

    await activity.save();

    // Update user's total points
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: pointsEarned } },
      { new: true }
    );

    // Update leaderboard
    const leaderboardEntry = await Leaderboard.findOneAndUpdate(
      { userId, period: 'all_time' },
      { $inc: { points: pointsEarned, activitiesCount: 1 }, lastActivityDate: new Date() },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: 'Activity logged successfully',
      activity: {
        id: activity._id,
        type: activity.type,
        duration: activity.duration,
        distance: activity.distance,
        intensity: activity.intensity,
        pointsEarned: activity.pointsEarned,
        date: activity.date
      },
      userTotalPoints: user?.totalPoints
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: 'Error logging activity' });
  }
});

// Get user's activities
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { limit = 10, skip = 0 } = req.query;

    const activities = await Activity.find({ userId })
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Activity.countDocuments({ userId });

    res.json({
      activities,
      total,
      limit: Number(limit),
      skip: Number(skip)
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// Get activity by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Verify ownership
    if (activity.userId.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ activity });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: 'Error fetching activity' });
  }
});

// Delete activity
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Verify ownership
    if (activity.userId.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const pointsToRemove = activity.pointsEarned;

    // Remove activity
    await Activity.findByIdAndDelete(req.params.id);

    // Update user's total points
    await User.findByIdAndUpdate(req.user?.id, { $inc: { totalPoints: -pointsToRemove } });

    // Update leaderboard
    await Leaderboard.updateOne(
      { userId: req.user?.id, period: 'all_time' },
      { $inc: { points: -pointsToRemove, activitiesCount: -1 } }
    );

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Error deleting activity' });
  }
});

export default router;
