import { useState, useEffect } from 'react';

const API_URL = '/api';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError('Failed to fetch events');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = `${API_URL}/events`;
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId 
        ? { ...formData, id: editingId }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save event');

      setFormData({ name: '', startTime: '', endTime: '' });
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      name: event.name,
      startTime: event.start_time,
      endTime: event.end_time,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await fetch(`${API_URL}/events?id=${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', startTime: '', endTime: '' });
  };

  return (
    <div className="page">
      <h2>Manage Events</h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Event' : 'Create Event'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="list">
        {events.length === 0 ? (
          <div className="empty-state">No events yet. Create your first event!</div>
        ) : (
          events.map((event) => (
            <li key={event.id} className="list-item">
              <div className="list-item-content">
                <h3>{event.name}</h3>
                <p>
                  {event.start_time} - {event.end_time}
                </p>
              </div>
              <div className="list-item-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(event)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default EventsPage;
