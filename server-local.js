import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simple file-based storage for local development
const DB_FILE = path.join(__dirname, 'local-db.json');

// Initialize database file
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      events: [],
      people: [],
      attendance: [],
      nextId: { events: 1, people: 1, attendance: 1 }
    }, null, 2));
  }
}

function readDB() {
  initDB();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Events endpoints
app.get('/api/events', (req, res) => {
  const db = readDB();
  res.json(db.events);
});

app.post('/api/events', (req, res) => {
  const db = readDB();
  const { name, startTime, endTime } = req.body;
  
  const newEvent = {
    id: db.nextId.events++,
    name,
    start_time: startTime,
    end_time: endTime,
    created_at: new Date().toISOString()
  };
  
  db.events.push(newEvent);
  writeDB(db);
  res.status(201).json(newEvent);
});

app.put('/api/events', (req, res) => {
  const db = readDB();
  const { id, name, startTime, endTime } = req.body;
  
  const index = db.events.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  db.events[index] = {
    ...db.events[index],
    name,
    start_time: startTime,
    end_time: endTime
  };
  
  writeDB(db);
  res.json(db.events[index]);
});

app.delete('/api/events', (req, res) => {
  const db = readDB();
  const id = parseInt(req.query.id);
  
  db.events = db.events.filter(e => e.id !== id);
  db.attendance = db.attendance.filter(a => a.event_id !== id);
  
  writeDB(db);
  res.json({ success: true });
});

// People endpoints
app.get('/api/people', (req, res) => {
  const db = readDB();
  res.json(db.people);
});

app.post('/api/people', (req, res) => {
  const db = readDB();
  const { name } = req.body;
  
  const newPerson = {
    id: db.nextId.people++,
    name,
    created_at: new Date().toISOString()
  };
  
  db.people.push(newPerson);
  writeDB(db);
  res.status(201).json(newPerson);
});

app.delete('/api/people', (req, res) => {
  const db = readDB();
  const id = parseInt(req.query.id);
  
  db.people = db.people.filter(p => p.id !== id);
  db.attendance = db.attendance.filter(a => a.person_id !== id);
  
  writeDB(db);
  res.json({ success: true });
});

// Attendance endpoints
app.get('/api/attendance', (req, res) => {
  const db = readDB();
  const { eventId } = req.query;
  
  if (!eventId) {
    // Get all attendance with details
    const records = db.attendance.map(a => {
      const event = db.events.find(e => e.id === a.event_id);
      const person = db.people.find(p => p.id === a.person_id);
      return {
        ...a,
        event_name: event?.name || 'Unknown',
        person_name: person?.name || 'Unknown',
        is_online: a.is_online || false
      };
    });
    return res.json(records);
  }
  
  // Get attendance for specific event
  const records = db.attendance
    .filter(a => a.event_id === parseInt(eventId))
    .map(a => {
      const person = db.people.find(p => p.id === a.person_id);
      return {
        ...a,
        person_name: person?.name || 'Unknown',
        is_online: a.is_online || false
      };
    });
  
  res.json(records);
});

app.post('/api/attendance', (req, res) => {
  const db = readDB();
  const { eventId, personId, isOnline } = req.body;
  
  // Check if already marked
  const existing = db.attendance.find(
    a => a.event_id === eventId && a.person_id === personId
  );
  
  if (existing) {
    return res.status(400).json({ error: 'Attendance already marked' });
  }
  
  const newAttendance = {
    id: db.nextId.attendance++,
    event_id: eventId,
    person_id: personId,
    marked_at: new Date().toISOString(),
    is_online: isOnline || false
  };
  
  db.attendance.push(newAttendance);
  writeDB(db);
  res.status(201).json(newAttendance);
});

app.delete('/api/attendance', (req, res) => {
  const db = readDB();
  const id = parseInt(req.query.id);
  
  db.attendance = db.attendance.filter(a => a.id !== id);
  
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Local API server running on http://localhost:${PORT}`);
  console.log('Database file:', DB_FILE);
});
