# Quick Start Guide

## Local Development

Your app is now running! You have two servers:

1. **Frontend (React)**: http://localhost:3000
2. **Backend API**: http://localhost:3001

### Running the App

You need to run **both** servers in separate terminals:

**Terminal 1 - API Server:**
```bash
npm run dev:api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

### How to Use

1. **Add People**: 
   - Click on "People" tab
   - Enter names and click "Add Person"
   - These will persist in `local-db.json`

2. **Create Events**:
   - Click on "Events" tab
   - Enter event name, start time, and end time
   - Click "Create Event"

3. **Mark Attendance** (Main Feature):
   - Click on "Mark Attendance" tab
   - Select your event from the dropdown
   - Click "Mark Present" for each person who attends
   - The timestamp is automatically recorded

4. **View Records**:
   - Click on "Records" tab
   - See all attendance records
   - Click "Export to CSV" to download data

### Local Data Storage

For local development, all data is stored in `local-db.json` in the project root. This file is automatically created when you first use the app.

## Deploying to Vercel

### Prerequisites

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

### Deployment Steps

1. **Deploy the project:**
```bash
vercel
```

2. **Add Postgres Database:**
   - Go to your project on vercel.com
   - Click on "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a name and region
   - Click "Create"

3. **Redeploy with database:**
```bash
vercel --prod
```

4. **Your app is live!**
   - Vercel will give you a URL like: `https://your-app.vercel.app`
   - The database tables will be created automatically on first API call

### Important Notes

- **Local vs Production**: 
  - Local development uses `local-db.json` (file-based)
  - Production uses Vercel Postgres (cloud database)
  
- **No Code Changes Needed**: The API routes automatically detect if they're running on Vercel and use the appropriate database

- **Environment Variables**: Vercel automatically injects Postgres credentials when you connect a database

### Troubleshooting

**API not responding locally?**
- Make sure both servers are running
- Check that API server is on port 3001
- Check that frontend is on port 3000

**Database errors on Vercel?**
- Make sure you've added a Postgres database in Vercel dashboard
- Redeploy after adding the database
- Check Vercel function logs for errors

**Data not persisting locally?**
- Check if `local-db.json` exists in project root
- Make sure you have write permissions

## Next Steps

- Customize the UI colors in `src/App.css`
- Add more fields to people (email, phone, etc.)
- Add event categories or tags
- Implement search/filter functionality
- Add authentication for multi-user support
