import express, { Response } from 'express';
import { Team, User, Activity } from '../models';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = express.Router();

// Create a new team
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const captainId = req.user?.id;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    // Check if team already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(409).json({ message: 'Team name already exists' });
    }

    // Create team with captain as first member
    const team = new Team({
      name,
      description,
      captainId,
      members: [captainId]
    });

    await team.save();

    // Add team to user
    await User.findByIdAndUpdate(captainId, { teamId: team._id });

    res.status(201).json({
      message: 'Team created successfully',
      team: {
        id: team._id,
        name: team.name,
        description: team.description,
        members: team.members,
        totalPoints: team.totalPoints
      }
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Error creating team' });
  }
});

// Get all teams
router.get('/', async (req: any, res: Response) => {
  try {
    const teams = await Team.find().populate('captainId', 'username firstName lastName');

    res.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Error fetching teams' });
  }
});

// Get team by ID
router.get('/:id', async (req: any, res: Response) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('captainId', 'username firstName lastName')
      .populate('members', 'username firstName lastName totalPoints');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ team });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Error fetching team' });
  }
});

// Join a team
router.post('/:teamId/join', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.user?.id;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user already in team
    if (team.members.includes(userId as any)) {
      return res.status(400).json({ message: 'User already in team' });
    }

    // Add user to team
    team.members.push(userId as any);
    await team.save();

    // Update user's team
    await User.findByIdAndUpdate(userId, { teamId: team._id });

    res.json({
      message: 'Joined team successfully',
      team: {
        id: team._id,
        name: team.name,
        members: team.members
      }
    });
  } catch (error) {
    console.error('Error joining team:', error);
    res.status(500).json({ message: 'Error joining team' });
  }
});

// Leave a team
router.post('/:teamId/leave', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.user?.id;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Can't leave if captain
    if (team.captainId.toString() === userId) {
      return res.status(400).json({ message: 'Captain cannot leave team' });
    }

    // Remove user from team
    team.members = team.members.filter((id) => id.toString() !== userId);
    await team.save();

    // Remove team from user
    await User.findByIdAndUpdate(userId, { teamId: null });

    res.json({ message: 'Left team successfully' });
  } catch (error) {
    console.error('Error leaving team:', error);
    res.status(500).json({ message: 'Error leaving team' });
  }
});

// Get team total points
router.get('/:id/points', async (req: any, res: Response) => {
  try {
    const teamId = req.params.id;

    const team = await Team.findById(teamId).populate('members', '_id');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const memberIds = team.members.map((m) => m._id);
    const users = await User.find({ _id: { $in: memberIds } });

    const totalPoints = users.reduce((sum, user) => sum + user.totalPoints, 0);

    res.json({
      teamId: team._id,
      teamName: team.name,
      totalPoints,
      memberCount: team.members.length
    });
  } catch (error) {
    console.error('Error fetching team points:', error);
    res.status(500).json({ message: 'Error fetching team points' });
  }
});

export default router;
