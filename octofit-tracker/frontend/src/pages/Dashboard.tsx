import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState({
    totalPoints: 0,
    activitiesCount: 0,
    rank: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    Promise.all([
      fetch('/api/activities', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch('/api/leaderboard/user/position', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
      .then(([activitiesRes, leaderboardRes]) => Promise.all([activitiesRes.json(), leaderboardRes.json()]))
      .then(([activitiesData, leaderboardData]) => {
        setRecentActivities(activitiesData.activities?.slice(0, 5) || []);
        setStats({
          totalPoints: leaderboardData.position?.points || 0,
          activitiesCount: leaderboardData.position?.activitiesCount || 0,
          rank: leaderboardData.position?.rank || 0
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading dashboard...</div>;
  }

  return (
    <Container className="octofit-container py-5">
      <h1 className="mb-4">Welcome, {user?.firstName}!</h1>

      <Row className="mb-5">
        <Col md={4} className="mb-3">
          <div className="stat-box">
            <h3>{stats.totalPoints}</h3>
            <p>Total Points</p>
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div className="stat-box">
            <h3>#{stats.rank}</h3>
            <p>Leaderboard Rank</p>
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div className="stat-box">
            <h3>{stats.activitiesCount}</h3>
            <p>Activities Logged</p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Recent Activities</Card.Title>
              {recentActivities.length === 0 ? (
                <p className="text-muted">No activities logged yet. Start tracking your fitness journey!</p>
              ) : (
                <div>
                  {recentActivities.map((activity: any) => (
                    <div key={activity._id} className="activity-card p-3 mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1 text-capitalize">{activity.type.replace(/_/g, ' ')}</h5>
                          <small className="text-muted">
                            {activity.duration} min
                            {activity.distance && ` • ${activity.distance} km`}
                          </small>
                        </div>
                        <div className="points-badge">{activity.pointsEarned} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
            <Card.Footer>
              <Link to="/activities">
                <Button variant="outline-primary" className="w-100">
                  View All Activities
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <Link to="/activities" className="mb-2 d-block">
                <Button variant="primary" className="w-100 mb-2">
                  Log Activity
                </Button>
              </Link>
              <Link to="/teams">
                <Button variant="outline-primary" className="w-100 mb-2">
                  Join a Team
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="outline-primary" className="w-100">
                  View Leaderboard
                </Button>
              </Link>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>User Profile</Card.Title>
              <div className="mb-2">
                <strong>Fitness Level:</strong> <span className="text-capitalize">{user?.fitnessLevel}</span>
              </div>
              <div>
                <strong>Member Since:</strong> <span>Today</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
