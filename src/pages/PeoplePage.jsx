import { useState, useEffect } from 'react';

const API_URL = '/api';

function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await fetch(`${API_URL}/people`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setPeople(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch people:', err);
      setError('Failed to fetch people. Please check if the database is connected.');
      setPeople([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to add person');

      setName('');
      fetchPeople();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this person?')) return;

    try {
      await fetch(`${API_URL}/people?id=${id}`, { method: 'DELETE' });
      fetchPeople();
    } catch (err) {
      setError('Failed to delete person');
    }
  };

  return (
    <div className="page">
      <h2>Manage People</h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Person Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter person's name"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Person
        </button>
      </form>

      <ul className="list">
        {people.length === 0 ? (
          <div className="empty-state">No people yet. Add your first person!</div>
        ) : (
          people.map((person) => (
            <li key={person.id} className="list-item">
              <div className="list-item-content">
                <h3>{person.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#999' }}>
                  Added: {new Date(person.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="list-item-actions">
                <button className="btn btn-danger" onClick={() => handleDelete(person.id)}>
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

export default PeoplePage;
