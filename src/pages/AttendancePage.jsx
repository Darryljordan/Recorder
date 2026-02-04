import { useState, useEffect } from 'react';

const API_URL = '/api';

function AttendancePage() {
  const [events, setEvents] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchPeople();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchAttendance(selectedEvent.id);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      setEvents(data);
      if (data.length > 0 && !selectedEvent) {
        setSelectedEvent(data[0]);
      }
    } catch (err) {
      setError('Failed to fetch events');
    }
  };

  const fetchPeople = async () => {
    try {
      const response = await fetch(`${API_URL}/people`);
      const data = await response.json();
      setPeople(data);
    } catch (err) {
      setError('Failed to fetch people');
    }
  };

  const fetchAttendance = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/attendance?eventId=${eventId}`);
      const data = await response.json();
      setAttendance(data);
    } catch (err) {
      setError('Failed to fetch attendance');
    }
  };

  const markPresent = async (personId) => {
    if (!selectedEvent) {
      setError('Please select an event first');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          personId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to mark attendance');
      }

      fetchAttendance(selectedEvent.id);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const unmarkPresent = async (attendanceId) => {
    try {
      await fetch(`${API_URL}/attendance?id=${attendanceId}`, {
        method: 'DELETE',
      });
      fetchAttendance(selectedEvent.id);
    } catch (err) {
      setError('Failed to unmark attendance');
    }
  };

  const isPresent = (personId) => {
    return attendance.find((a) => a.person_id === personId);
  };

  if (events.length === 0) {
    return (
      <div className="page">
        <h2>Mark Attendance</h2>
        <div className="empty-state">
          <p>No events found. Please create an event first in the Events tab.</p>
        </div>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="page">
        <h2>Mark Attendance</h2>
        <div className="empty-state">
          <p>No people found. Please add people first in the People tab.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Mark Attendance</h2>
      
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label>Select Event</label>
        <select
          value={selectedEvent?.id || ''}
          onChange={(e) => {
            const event = events.find((ev) => ev.id === parseInt(e.target.value));
            setSelectedEvent(event);
          }}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} ({event.start_time} - {event.end_time})
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          <h3>{selectedEvent.name}</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {selectedEvent.start_time} - {selectedEvent.end_time}
          </p>
          <p style={{ marginTop: '0.5rem', fontWeight: '600', color: '#27ae60' }}>
            Present: {attendance.length} / {people.length}
          </p>
        </div>
      )}

      <div className="attendance-grid">
        {people.map((person) => {
          const attendanceRecord = isPresent(person.id);
          return (
            <div
              key={person.id}
              className={`person-card ${attendanceRecord ? 'present' : ''}`}
            >
              <h4>{person.name}</h4>
              <div className="status">
                {attendanceRecord
                  ? `✓ Present (${new Date(attendanceRecord.marked_at).toLocaleTimeString()})`
                  : 'Absent'}
              </div>
              {attendanceRecord ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => unmarkPresent(attendanceRecord.id)}
                  style={{ marginTop: '0.5rem', width: '100%' }}
                >
                  Unmark
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => markPresent(person.id)}
                  style={{ marginTop: '0.5rem', width: '100%' }}
                >
                  Mark Present
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AttendancePage;
