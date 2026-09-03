import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Table } from 'react-bootstrap';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<any[]>([]);
  const [userPosition, setUserPosition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserPosition();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const [allTimeRes, weeklyRes] = await Promise.all([
        fetch('/api/leaderboard?period=all_time&limit=50'),
        fetch('/api/leaderboard/weekly/top?limit=50')
      ]);

      const allTimeData = await allTimeRes.json();
      const weeklyData = await weeklyRes.json();

      setLeaderboard(allTimeData.leaderboard || []);
      setWeeklyLeaderboard(weeklyData.leaderboard || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosition = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/leaderboard/user/position', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUserPosition(data.position);
    } catch (err) {
      console.log('Not logged in or error fetching position');
    }
  };

  const renderLeaderboardTable = (data: any[]) => (
    <Table responsive className="mb-0">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>Points</th>
          <th>Activities</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry: any, index: number) => (
          <tr key={entry._id || index}>
            <td>
              <div className="leaderboard-rank">#{index + 1}</div>
            </td>
            <td>
              <strong>{entry.userId?.username || 'Unknown'}</strong>
              <br />
              <small className="text-muted">{entry.userId?.firstName} {entry.userId?.lastName}</small>
            </td>
            <td>
              <strong>{entry.points}</strong>
            </td>
            <td>{entry.activitiesCount}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Container className="octofit-container py-5">
      <h1 className="mb-4">Leaderboard</h1>

      {userPosition && (
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <div className="stat-box">
              <h3>#{userPosition.rank}</h3>
              <p>Your Rank</p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="stat-box">
              <h3>{userPosition.points}</h3>
              <p>Your Points</p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="stat-box">
              <h3>{userPosition.activitiesCount}</h3>
              <p>Your Activities</p>
            </div>
          </Col>
        </Row>
      )}

      <Card>
        <Card.Body>
          {loading ? (
            <p className="text-center">Loading leaderboard...</p>
          ) : (
            <Tabs defaultActiveKey="all-time" className="mb-3">
              <Tab eventKey="all-time" title="All Time">
                {leaderboard.length === 0 ? (
                  <p className="text-muted text-center py-4">No data available</p>
                ) : (
                  renderLeaderboardTable(leaderboard)
                )}
              </Tab>
              <Tab eventKey="weekly" title="Weekly">
                {weeklyLeaderboard.length === 0 ? (
                  <p className="text-muted text-center py-4">No data available</p>
                ) : (
                  renderLeaderboardTable(weeklyLeaderboard)
                )}
              </Tab>
            </Tabs>
          )}
        </Card.Body>
      </Card>

      <Row className="mt-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>How Points are Calculated</Card.Title>
              <ul className="mb-0">
                <li><strong>Walking:</strong> 2 points per minute</li>
                <li><strong>Running:</strong> 5 points per minute</li>
                <li><strong>Cycling:</strong> 4 points per minute</li>
                <li><strong>Swimming:</strong> 6 points per minute</li>
                <li><strong>Strength Training:</strong> 4 points per minute</li>
                <li><strong>Intensity Multiplier:</strong> Low (1x), Moderate (1.5x), High (2x)</li>
                <li><strong>Distance Bonus:</strong> 0.5 points per km</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Tips to Climb the Leaderboard</Card.Title>
              <ul className="mb-0">
                <li>Consistency is key - log activities regularly</li>
                <li>Challenge yourself with higher intensity workouts</li>
                <li>Try different types of activities for variety</li>
                <li>Join a team for extra motivation</li>
                <li>Set personal goals and track your progress</li>
                <li>Compete with friends and teammates</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
