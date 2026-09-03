import express, { Response } from 'express';
import { Leaderboard, User } from '../models';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = express.Router();

// Helper function to update leaderboard rankings
async function updateLeaderboardRanks(period: 'weekly' | 'monthly' | 'all_time' = 'all_time') {
  const entries = await Leaderboard.find({ period }).sort({ points: -1 });

  for (let i = 0; i < entries.length; i++) {
    entries[i].rank = i + 1;
    await entries[i].save();
  }
}

// Get leaderboard
router.get('/', async (req: any, res: Response) => {
  try {
    const { period = 'all_time', limit = 20 } = req.query;

    const leaderboard = await Leaderboard.find({ period })
      .sort({ points: -1 })
      .limit(Number(limit))
      .populate('userId', 'username firstName lastName profilePicture');

    res.json({
      period,
      leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Get user's leaderboard position
router.get('/user/position', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { period = 'all_time' } = req.query;
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const entry = await Leaderboard.findOne({ userId, period }).populate(
      'userId',
      'username firstName lastName'
    );

    if (!entry) {
      return res.status(404).json({ message: 'User not on leaderboard' });
    }

    res.json({
      position: {
        rank: entry.rank,
        points: entry.points,
        activitiesCount: entry.activitiesCount,
        user: {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user position:', error);
    res.status(500).json({ message: 'Error fetching user position' });
  }
});

// Get top performers this week
router.get('/weekly/top', async (req: any, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await Leaderboard.find({ period: 'weekly' })
      .sort({ points: -1 })
      .limit(Number(limit))
      .populate('userId', 'username firstName lastName profilePicture');

    res.json({
      period: 'weekly',
      leaderboard
    });
  } catch (error) {
    console.error('Error fetching weekly top performers:', error);
    res.status(500).json({ message: 'Error fetching top performers' });
  }
});

// Update leaderboard rankings
router.post('/update-ranks', async (req: any, res: Response) => {
  try {
    await updateLeaderboardRanks('all_time');
    await updateLeaderboardRanks('monthly');
    await updateLeaderboardRanks('weekly');

    res.json({ message: 'Leaderboard rankings updated successfully' });
  } catch (error) {
    console.error('Error updating leaderboard ranks:', error);
    res.status(500).json({ message: 'Error updating leaderboard' });
  }
});

export default router;
