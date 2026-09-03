import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

export default function Activities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'running',
    duration: '',
    distance: '',
    intensity: 'moderate',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/activities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setActivities(data.activities || []);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'distance' ? (value ? parseFloat(value) : '') : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration as any) : 0,
          distance: formData.distance ? parseFloat(formData.distance as any) : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to log activity');
        return;
      }

      setSuccess('Activity logged successfully!');
      setFormData({
        type: 'running',
        duration: '',
        distance: '',
        intensity: 'moderate',
        notes: ''
      });
      fetchActivities();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('An error occurred while logging activity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="octofit-container py-5">
      <h1 className="mb-4">Activity Logging</h1>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Log New Activity</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Activity Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="running">Running</option>
                    <option value="walking">Walking</option>
                    <option value="cycling">Cycling</option>
                    <option value="swimming">Swimming</option>
                    <option value="strength_training">Strength Training</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="30"
                    required
                    min="1"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Distance (km)</Form.Label>
                  <Form.Control
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    placeholder="5.0"
                    step="0.1"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Intensity</Form.Label>
                  <Form.Select
                    name="intensity"
                    value={formData.intensity}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="How did it feel?"
                    rows={3}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={submitting}>
                  {submitting ? 'Logging...' : 'Log Activity'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Activity History</Card.Title>
              {loading ? (
                <p className="text-muted">Loading activities...</p>
              ) : activities.length === 0 ? (
                <p className="text-muted">No activities logged yet. Start your fitness journey!</p>
              ) : (
                <div>
                  {activities.map((activity: any) => (
                    <div key={activity._id} className="activity-card p-3 mb-2">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="mb-1 text-capitalize">{activity.type.replace(/_/g, ' ')}</h5>
                          <small className="text-muted">
                            {new Date(activity.date).toLocaleDateString()} at{' '}
                            {new Date(activity.date).toLocaleTimeString()}
                          </small>
                        </div>
                        <div className="points-badge">{activity.pointsEarned} pts</div>
                      </div>
                      <div className="small">
                        <strong>Duration:</strong> {activity.duration} min
                        {activity.distance && ` • Distance: ${activity.distance} km`}
                        <br />
                        <strong>Intensity:</strong> <span className="text-capitalize">{activity.intensity}</span>
                      </div>
                      {activity.notes && (
                        <div className="small mt-2">
                          <strong>Notes:</strong> {activity.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
