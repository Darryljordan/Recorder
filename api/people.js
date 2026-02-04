import { sql } from '@vercel/postgres';
import { initDatabase } from './db.js';

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
    // GET all people
    if (req.method === 'GET') {
      const { rows } = await sql`
        SELECT * FROM people ORDER BY name ASC
      `;
      return res.status(200).json(rows);
    }

    // POST new person
    if (req.method === 'POST') {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const { rows } = await sql`
        INSERT INTO people (name)
        VALUES (${name})
        RETURNING *
      `;
      
      return res.status(201).json(rows[0]);
    }

    // DELETE person
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Person ID required' });
      }

      await sql`DELETE FROM people WHERE id = ${id}`;
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('People API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
