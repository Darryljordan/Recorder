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

  const exportReport = () => {
    if (records.length === 0) {
      alert('No records to export');
      return;
    }

    // Group records by event
    const grouped = {};
    records.forEach((record) => {
      const key = record.event_id;
      if (!grouped[key]) {
        grouped[key] = {
          event_name: record.event_name,
          attendees: [],
        };
      }
      grouped[key].attendees.push(record);
    });

    const today = new Date().toLocaleDateString();

    // Build styled HTML document
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Attendance Report - ${today}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #2c3e50; background: #fff; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .subtitle { color: #7f8c8d; font-size: 14px; margin-bottom: 32px; }
    .event-section { margin-bottom: 32px; break-inside: avoid; }
    .event-header {
      background: #2c3e50; color: #fff; padding: 10px 16px;
      border-radius: 6px 6px 0 0; display: flex;
      justify-content: space-between; align-items: center;
    }
    .event-header h2 { font-size: 16px; font-weight: 600; }
    .event-header span { font-size: 13px; opacity: 0.85; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f5f6fa; text-align: left; font-weight: 600; font-size: 13px; color: #555; }
    th, td { padding: 10px 16px; border-bottom: 1px solid #e0e0e0; font-size: 14px; }
    tr:last-child td { border-bottom: none; }
    .badge {
      display: inline-block; padding: 3px 10px; border-radius: 12px;
      font-size: 12px; font-weight: 500;
    }
    .badge-online { background: #e3f2fd; color: #1976d2; }
    .badge-inperson { background: #f1f8e9; color: #558b2f; }
    .table-border { border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 6px 6px; overflow: hidden; }
    .total-row { background: #fafafa; font-weight: 600; font-size: 13px; color: #555; }
    @media print { body { padding: 20px; } .event-section { break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>Attendance Report</h1>
  <p class="subtitle">Generated on ${today} &mdash; ${records.length} total record(s)</p>
  ${Object.values(grouped)
    .map(
      (group) => `
  <div class="event-section">
    <div class="event-header">
      <h2>${group.event_name}</h2>
      <span>${group.attendees.length} attendee(s)</span>
    </div>
    <div class="table-border">
      <table>
        <thead>
          <tr>
            <th style="width:10%">#</th>
            <th style="width:35%">Person</th>
            <th style="width:25%">Attendance Type</th>
            <th style="width:30%">Marked At</th>
          </tr>
        </thead>
        <tbody>
          ${group.attendees
            .map(
              (r, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${r.person_name}</td>
            <td><span class="badge ${r.is_online ? 'badge-online' : 'badge-inperson'}">${r.is_online ? '🌐 Online' : '👤 In-Person'}</span></td>
            <td>${new Date(r.marked_at).toLocaleString()}</td>
          </tr>`
            )
            .join('')}
          <tr class="total-row">
            <td colspan="4">Total: ${group.attendees.length} attendee(s)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`
    )
    .join('')}
</body>
</html>`;

    // Open in new tab for viewing / printing
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Attendance Records</h2>
        <button className="btn btn-primary" onClick={exportReport}>
          📥 Export Report
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
          {(() => {
            const grouped = {};
            records.forEach((record) => {
              const key = record.event_id;
              if (!grouped[key]) {
                grouped[key] = { event_name: record.event_name, attendees: [] };
              }
              grouped[key].attendees.push(record);
            });

            return Object.entries(grouped).map(([eventId, group]) => (
              <div key={eventId} style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  borderRadius: '6px 6px 0 0',
                  fontWeight: '600'
                }}>
                  <span>{group.event_name}</span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    {group.attendees.length} attendee(s)
                  </span>
                </div>
                <table style={{ marginTop: 0 }}>
                  <thead>
                    <tr>
                      <th>Person</th>
                      <th>Attendance Type</th>
                      <th>Marked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.attendees.map((record) => (
                      <tr key={record.id}>
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
              </div>
            ));
          })()}
        </>
      )}
    </div>
  );
}

export default RecordsPage;
