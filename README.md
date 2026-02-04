# Attendance Recorder

A lightweight attendance tracking application built with React and Node.js, designed for easy deployment on Vercel.

## Features

- ✅ **Event Management**: Create, edit, and delete events with start/end times
- ✅ **People Management**: Add and remove people from your roster
- ✅ **Quick Attendance Marking**: Mark people as present with a single click
- ✅ **Attendance Records**: View all attendance history
- ✅ **CSV Export**: Export attendance records to CSV format
- ✅ **Persistent Storage**: All data stored in Vercel Postgres database

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Vercel Serverless Functions
- **Database**: Vercel Postgres
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18+ installed
- A Vercel account (for database)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Vercel Postgres:
   - Create a new project on Vercel
   - Add a Postgres database to your project
   - Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Deployment to Vercel

### First Time Deployment

1. Install Vercel CLI (if not already installed):
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Follow the prompts to link your project

4. Add a Postgres database:
   - Go to your project dashboard on Vercel
   - Navigate to Storage tab
   - Create a new Postgres database
   - The database will be automatically connected

5. Deploy again to use the database:
```bash
vercel --prod
```

### Subsequent Deployments

Simply push to your connected Git repository, or run:
```bash
vercel --prod
```

## Usage

1. **Add People**: Go to the "People" tab and add all participants
2. **Create Events**: Go to the "Events" tab and create your events
3. **Mark Attendance**: On event day, go to "Mark Attendance", select your event, and click "Mark Present" for each attendee
4. **View Records**: Check the "Records" tab to see all attendance history
5. **Export Data**: Click "Export to CSV" in the Records tab to download attendance data

## Project Structure

```
Recorder/
├── api/                    # Vercel serverless functions
│   ├── db.js              # Database initialization
│   ├── events.js          # Events API endpoints
│   ├── people.js          # People API endpoints
│   └── attendance.js      # Attendance API endpoints
├── src/                   # React frontend
│   ├── pages/            # Page components
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── vercel.json           # Vercel configuration
```

## Environment Variables

The following environment variables are automatically set by Vercel when you connect a Postgres database:

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## License

MIT
