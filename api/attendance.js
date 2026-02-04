import { query, initDatabase } from './db.js';

export default async function handler(req, res) {
  // Initialize database on first request
  await initDatabase();

  // Enable CORS for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET attendance for an event
    if (req.method === 'GET') {
      const { eventId } = req.query;
      
      if (!eventId) {
        // Get all attendance records with details
        const { rows } = await query(`
          SELECT 
            a.id,
            a.event_id,
            a.person_id,
            a.marked_at,
            e.name as event_name,
            p.name as person_name
          FROM attendance a
          JOIN events e ON a.event_id = e.id
          JOIN people p ON a.person_id = p.id
          ORDER BY a.marked_at DESC
        `);
        return res.status(200).json(rows);
      }

      // Get attendance for specific event
      const { rows } = await query(
        `SELECT 
          a.id,
          a.person_id,
          a.marked_at,
          p.name as person_name
        FROM attendance a
        JOIN people p ON a.person_id = p.id
        WHERE a.event_id = $1
        ORDER BY a.marked_at DESC`,
        [eventId]
      );
      
      return res.status(200).json(rows);
    }

    // POST mark attendance
    if (req.method === 'POST') {
      const { eventId, personId } = req.body;
      
      if (!eventId || !personId) {
        return res.status(400).json({ error: 'Event ID and Person ID required' });
      }

      // Check if already marked
      const { rows: existing } = await query(
        'SELECT id FROM attendance WHERE event_id = $1 AND person_id = $2',
        [eventId, personId]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Attendance already marked' });
      }

      const { rows } = await query(
        'INSERT INTO attendance (event_id, person_id) VALUES ($1, $2) RETURNING *',
        [eventId, personId]
      );
      
      return res.status(201).json(rows[0]);
    }

    // DELETE attendance record
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Attendance ID required' });
      }

      await query('DELETE FROM attendance WHERE id = $1', [id]);
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Attendance API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
