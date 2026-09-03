import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal } from 'react-bootstrap';

interface TeamsProps {
  isAuthenticated: boolean;
}

export default function Teams({ isAuthenticated }: TeamsProps) {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      setTeams(data.teams || []);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please log in to create a team');
        setSubmitting(false);
        return;
      }

      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        setError('Your session has expired. Please log in again.');
        setTimeout(() => window.location.href = '/login', 2000);
        setSubmitting(false);
        return;
      }

      if (!response.ok) {
        setError(data.message || 'Failed to create team');
        setSubmitting(false);
        return;
      }

      setSuccess('Team created successfully!');
      setFormData({ name: '', description: '' });
      setShowCreateModal(false);
      fetchTeams();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('An error occurred while creating team');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to join a team');
        return;
      }

      const response = await fetch(`/api/teams/${teamId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        setError('Your session has expired. Please log in again.');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
      }

      if (!response.ok) {
        setError(data.message || 'Failed to join team');
        return;
      }

      setSuccess('Joined team successfully!');
      fetchTeams();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('An error occurred while joining team');
    }
  };

  return (
    <Container className="octofit-container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Teams</h1>
        {isAuthenticated && (
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Create Team
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading ? (
        <p className="text-center">Loading teams...</p>
      ) : teams.length === 0 ? (
        <Alert variant="info">No teams available yet. Be the first to create one!</Alert>
      ) : (
        <Row>
          {teams.map((team: any) => (
            <Col md={6} lg={4} key={team._id} className="mb-4">
              <div className="team-card">
                <h4>{team.name}</h4>
                <p className="text-muted">{team.description || 'No description'}</p>
                <div className="mb-3">
                  <div className="mb-2">
                    <small className="text-muted">Members: {team.members?.length || 0}</small>
                  </div>
                  <div>
                    <small className="text-muted">Total Points: {team.totalPoints || 0}</small>
                  </div>
                </div>
                {isAuthenticated && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100"
                    onClick={() => handleJoinTeam(team._id)}
                  >
                    Join Team
                  </Button>
                )}
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleCreateTeam}>
            <Form.Group className="mb-3">
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., The Fit Squad"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What's your team about?"
                rows={3}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Team'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
