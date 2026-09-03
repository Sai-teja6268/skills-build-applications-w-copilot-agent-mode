# OctoFit Tracker - Fitness Tracking Application

A multi-tier web application for tracking fitness activities, managing teams, and competing on leaderboards. Built with React, Express.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (LTS)
- MongoDB running on port 27017

### Start the Application

#### 1. Check MongoDB Status
```bash
ps aux | grep mongod
```

#### 2. Start the Backend
```bash
cd octofit-tracker/backend
npm install
npm run build
npm run seed  # Populate database with test data
npm run dev   # Start development server on port 8000
```

#### 3. Start the Frontend
```bash
cd octofit-tracker/frontend
npm install
npm run dev   # Start dev server on port 5173
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/api/health

## 📋 Features

### User Management
- Register new users with email and password
- Login with JWT authentication
- User profiles with fitness levels (beginner, intermediate, advanced)
- Track total points and rankings

### Activity Logging
- Log various workout types:
  - Running
  - Walking
  - Cycling
  - Swimming
  - Strength Training
- Track duration, distance, and intensity
- Add notes to activities
- View activity history

### Points System
- **Base Points by Activity Type**:
  - Walking: 2 points/min
  - Running: 5 points/min
  - Cycling: 4 points/min
  - Swimming: 6 points/min
  - Strength Training: 4 points/min

- **Intensity Multipliers**:
  - Low: 1x
  - Moderate: 1.5x
  - High: 2x

- **Distance Bonus**: 0.5 points per km

### Teams
- Create teams to encourage group fitness
- Join existing teams
- Track team total points
- Manage team membership

### Leaderboard
- View all-time rankings
- Weekly leaderboard
- Monthly rankings
- See your personal rank and points
- Track number of activities

## 🏗️ Architecture

### Backend (Node.js + Express + TypeScript)
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   ├── Activity.ts          # Activity schema
│   │   ├── Team.ts              # Team schema
│   │   ├── Leaderboard.ts       # Leaderboard schema
│   │   ├── Workout.ts           # Workout suggestions schema
│   │   └── index.ts             # Model exports
│   ├── routes/
│   │   ├── auth.ts              # Authentication endpoints
│   │   ├── activities.ts        # Activity logging endpoints
│   │   ├── teams.ts             # Team management endpoints
│   │   └── leaderboard.ts       # Leaderboard endpoints
│   ├── scripts/
│   │   └── seed.ts              # Database seeding
│   └── server.ts                # Express app setup
```

### Frontend (React 19 + Vite + Bootstrap)
```
frontend/
├── src/
│   ├── components/
│   │   └── Navigation.tsx        # Navigation bar
│   ├── pages/
│   │   ├── Home.tsx             # Landing page
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Registration page
│   │   ├── Dashboard.tsx        # User dashboard
│   │   ├── Activities.tsx       # Activity logging page
│   │   ├── Teams.tsx            # Teams page
│   │   └── Leaderboard.tsx      # Leaderboard page
│   ├── App.tsx                  # Main app component with routing
│   ├── App.css                  # App styling
│   ├── index.css                # Global styles
│   └── main.tsx                 # Entry point
```

### Database Schema
- **Users**: Email, password, fitness level, total points, team membership
- **Activities**: User ID, type, duration, distance, intensity, points earned
- **Teams**: Name, description, captain, members, total points
- **Leaderboard**: User ID, points, rank, activities count, period
- **Workouts**: Suggested workouts for users

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires token)

### Activities
- `POST /api/activities` - Log new activity (requires token)
- `GET /api/activities` - Get user's activities (requires token)
- `GET /api/activities/:id` - Get specific activity (requires token)
- `DELETE /api/activities/:id` - Delete activity (requires token)

### Teams
- `POST /api/teams` - Create new team (requires token)
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team details
- `POST /api/teams/:teamId/join` - Join team (requires token)
- `POST /api/teams/:teamId/leave` - Leave team (requires token)
- `GET /api/teams/:id/points` - Get team total points

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard (query: period, limit)
- `GET /api/leaderboard/user/position` - Get user's position (requires token)
- `GET /api/leaderboard/weekly/top` - Get weekly top performers
- `POST /api/leaderboard/update-ranks` - Update rankings

## 📦 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/octofit_db
JWT_SECRET=octofit_secret_key_change_in_production
```

## 🧪 Testing

### Test Data
The seed script creates:
- 3 sample users (john_runner, sarah_fitness, mike_athlete)
- 1 sample team (The Fit Squad)
- 4 sample activities
- Leaderboard entries

### Seed Database
```bash
cd octofit-tracker/backend
npm run seed
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 🛠️ Development

### Build Backend
```bash
cd octofit-tracker/backend
npm run build
```

### Build Frontend
```bash
cd octofit-tracker/frontend
npm run build
```

### Lint
```bash
npm run lint
```

## 📝 Notes

- JWT tokens expire after 7 days
- Points are automatically calculated based on activity parameters
- Leaderboard is updated when activities are logged
- All user actions require authentication except viewing public pages
- The application uses Bootstrap for responsive design

## 🔄 Next Steps

Consider implementing:
- Email verification for registration
- Password reset functionality
- Activity editing capabilities
- Workout suggestion algorithm
- Challenge/event system
- Friend/follow system
- Push notifications
- Mobile app version
- Analytics dashboard
