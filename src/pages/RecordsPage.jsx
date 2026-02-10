import { useState, useEffect } from 'react';

const API_URL = '/api';

function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_URL}/attendance`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch records:', err);
      setError('Failed to fetch records. Please check if the database is connected.');
      setRecords([]);
    }
  };

  const exportToCSV = () => {
    if (records.length === 0) {
      alert('No records to export');
      return;
    }

    // Create CSV content
    const headers = ['Event', 'Person', 'Attendance Type', 'Marked At'];
    const rows = records.map((record) => [
      record.event_name,
      record.person_name,
      record.is_online ? 'Online' : 'In-Person',
      new Date(record.marked_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Attendance Records</h2>
        <button className="btn btn-primary" onClick={exportToCSV}>
          📥 Export to CSV
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}

      {records.length === 0 ? (
        <div className="empty-state">
          No attendance records yet. Start marking attendance in the Mark Attendance tab!
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: '#666' }}>
            Total Records: <strong>{records.length}</strong>
          </div>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Person</th>
                <th>Attendance Type</th>
                <th>Marked At</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.event_name}</td>
                  <td>{record.person_name}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.85rem',
                      backgroundColor: record.is_online ? '#e3f2fd' : '#f1f8e9',
                      color: record.is_online ? '#1976d2' : '#558b2f',
                      fontWeight: '500'
                    }}>
                      {record.is_online ? '🌐 Online' : '👤 In-Person'}
                    </span>
                  </td>
                  <td>{new Date(record.marked_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default RecordsPage;
