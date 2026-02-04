import { useState } from 'react';
import EventsPage from './pages/EventsPage';
import PeoplePage from './pages/PeoplePage';
import AttendancePage from './pages/AttendancePage';
import RecordsPage from './pages/RecordsPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('attendance');

  const renderPage = () => {
    switch (currentPage) {
      case 'events':
        return <EventsPage />;
      case 'people':
        return <PeoplePage />;
      case 'attendance':
        return <AttendancePage />;
      case 'records':
        return <RecordsPage />;
      default:
        return <AttendancePage />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📋 Attendance Recorder</h1>
      </header>
      
      <nav className="nav">
        <button
          className={currentPage === 'attendance' ? 'active' : ''}
          onClick={() => setCurrentPage('attendance')}
        >
          Mark Attendance
        </button>
        <button
          className={currentPage === 'events' ? 'active' : ''}
          onClick={() => setCurrentPage('events')}
        >
          Events
        </button>
        <button
          className={currentPage === 'people' ? 'active' : ''}
          onClick={() => setCurrentPage('people')}
        >
          People
        </button>
        <button
          className={currentPage === 'records' ? 'active' : ''}
          onClick={() => setCurrentPage('records')}
        >
          Records
        </button>
      </nav>

      <main className="main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
