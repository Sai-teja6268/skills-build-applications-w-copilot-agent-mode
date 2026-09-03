import mongoose from 'mongoose';
import { User, Team, Activity, Leaderboard, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({})
    ]);

    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        username: 'john_runner',
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        age: 16,
        fitnessLevel: 'beginner'
      },
      {
        username: 'sarah_fitness',
        email: 'sarah@example.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Smith',
        age: 17,
        fitnessLevel: 'intermediate'
      },
      {
        username: 'mike_athlete',
        email: 'mike@example.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Johnson',
        age: 18,
        fitnessLevel: 'advanced'
      }
    ]);

    console.log('Created sample users');

    // Create sample team
    const team = await Team.create({
      name: 'The Fit Squad',
      description: 'A team dedicated to staying healthy and fit',
      captainId: users[0]._id,
      members: [users[0]._id, users[1]._id]
    });

    // Update users with team
    await User.updateMany({ _id: { $in: [users[0]._id, users[1]._id] } }, { teamId: team._id });

    console.log('Created sample team');

    // Create sample activities
    const activities = await Activity.create([
      {
        userId: users[0]._id,
        type: 'running',
        duration: 30,
        distance: 5,
        intensity: 'moderate',
        pointsEarned: 225,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        userId: users[0]._id,
        type: 'strength_training',
        duration: 45,
        intensity: 'high',
        pointsEarned: 270,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        userId: users[1]._id,
        type: 'cycling',
        duration: 60,
        distance: 20,
        intensity: 'moderate',
        pointsEarned: 360,
        date: new Date()
      },
      {
        userId: users[2]._id,
        type: 'swimming',
        duration: 40,
        intensity: 'high',
        pointsEarned: 480,
        date: new Date()
      }
    ]);

    console.log('Created sample activities');

    // Update user total points
    await User.findByIdAndUpdate(users[0]._id, { totalPoints: 495 });
    await User.findByIdAndUpdate(users[1]._id, { totalPoints: 360 });
    await User.findByIdAndUpdate(users[2]._id, { totalPoints: 480 });

    // Create leaderboard entries
    await Leaderboard.create([
      {
        userId: users[2]._id,
        points: 480,
        rank: 1,
        activitiesCount: 1,
        period: 'all_time'
      },
      {
        userId: users[0]._id,
        points: 495,
        rank: 2,
        activitiesCount: 2,
        period: 'all_time'
      },
      {
        userId: users[1]._id,
        points: 360,
        rank: 3,
        activitiesCount: 1,
        period: 'all_time'
      }
    ]);

    console.log('Created leaderboard entries');

    // Create sample workouts
    await Workout.create([
      {
        userId: users[0]._id,
        title: 'Morning Jog',
        description: 'A refreshing 5km jog to start the day',
        workoutType: 'running',
        difficulty: 'beginner',
        estimatedDuration: 30,
        targetIntensity: 'moderate'
      },
      {
        userId: users[1]._id,
        title: 'Strength Training Session',
        description: 'Full body strength training workout',
        workoutType: 'strength_training',
        difficulty: 'intermediate',
        estimatedDuration: 60,
        targetIntensity: 'high'
      }
    ]);

    console.log('Created sample workouts');
    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
