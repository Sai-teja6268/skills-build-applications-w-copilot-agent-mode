import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <div className="hero-section">
        <Container>
          <h1>Welcome to OctoFit Tracker</h1>
          <p>Track your fitness journey and compete with friends!</p>
          <div>
            <Link to="/register">
              <Button className="me-3" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="outline-light" size="lg">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      <Container className="octofit-container py-5">
        <Row className="mb-5">
          <Col md={4} className="mb-4">
            <div className="stat-box">
              <h3>Track</h3>
              <p>Log your workouts and activities</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="stat-box">
              <h3>Compete</h3>
              <p>Challenge friends and teammates</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="stat-box">
              <h3>Achieve</h3>
              <p>Earn points and climb the leaderboard</p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-4">
            <h2>Features</h2>
            <ul>
              <li>Log running, walking, cycling, swimming, and strength training activities</li>
              <li>Create and join teams</li>
              <li>Earn points based on activity type, duration, and intensity</li>
              <li>View your progress on the leaderboard</li>
              <li>Get personalized workout suggestions</li>
              <li>Track team performance</li>
            </ul>
          </Col>
          <Col md={6} className="mb-4">
            <h2>How it Works</h2>
            <ol>
              <li>Create an account with your fitness level</li>
              <li>Log your daily activities</li>
              <li>Earn points based on your workout intensity and duration</li>
              <li>Join a team or create your own</li>
              <li>Compete with others on the leaderboard</li>
              <li>Receive personalized workout recommendations</li>
            </ol>
          </Col>
        </Row>
      </Container>
    </>
  );
}
