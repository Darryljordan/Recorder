import { query, initDatabase } from './db.js';

export default async function handler(req, res) {
  // Initialize database on first request
  await initDatabase();

  // Enable CORS for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET all events
    if (req.method === 'GET') {
      const { rows } = await query(
        'SELECT * FROM events ORDER BY start_time DESC'
      );
      return res.status(200).json(rows);
    }

    // POST new event
    if (req.method === 'POST') {
      const { name, startTime, endTime } = req.body;
      
      if (!name || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { rows } = await query(
        'INSERT INTO events (name, start_time, end_time) VALUES ($1, $2, $3) RETURNING *',
        [name, startTime, endTime]
      );
      
      return res.status(201).json(rows[0]);
    }

    // PUT update event
    if (req.method === 'PUT') {
      const { id, name, startTime, endTime } = req.body;
      
      if (!id || !name || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { rows } = await query(
        'UPDATE events SET name = $1, start_time = $2, end_time = $3 WHERE id = $4 RETURNING *',
        [name, startTime, endTime, id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      return res.status(200).json(rows[0]);
    }

    // DELETE event
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Event ID required' });
      }

      await query('DELETE FROM events WHERE id = $1', [id]);
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Events API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
