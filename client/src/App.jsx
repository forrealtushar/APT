// client/src/App.jsx
import { useState } from 'react';
import AddAthlete from './components/AddAthlete';
import AddTest from './components/AddTest';
import AddScore from './components/AddScore';
import Leaderboard from './components/LeaderBoard';

function App() {
  // State to simulate the current user's role
  // Default is 'coach' so you can see everything initially
  const [role, setRole] = useState('coach');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* --- NAVBAR / ROLE SWITCHER --- */}
      <nav className="bg-slate-900 border-b border-slate-700 p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-white from-blue-400 to-purple-500">
            🏅 Athlete Performance Tracker
          </h1>
          
          {/* THE MAGIC SWITCH */}
          <div className="flex items-center gap-3 bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button 
              onClick={() => setRole('viewer')}
              className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${
                role === 'viewer' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Viewer
            </button>
            <button 
              onClick={() => setRole('coach')}
              className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${
                role === 'coach' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Coach
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-4xl mx-auto p-6">
        
        {/* 1. VIEW SECTION (Visible to EVERYONE) */}
        <div className="mb-8">
          <Leaderboard role={role} />
        </div>

        {/* 2. COACH SECTION (Protected by Logic) */}
        {role === 'coach' ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-slate-700 flex-1"></div>
              <span className="text-purple-400 font-bold uppercase text-sm tracking-wider">Coach Dashboard</span>
              <div className="h-px bg-slate-700 flex-1"></div>
            </div>

            <div className="grid gap-8">
              {/* Priority 1: Enter Scores */}
              <AddScore />

              {/* Priority 2: Setup (Side by Side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <AddAthlete />
                 <AddTest />
              </div>
            </div>
          </div>
        ) : (
          /* Viewer Message */
          <div className="text-center py-10 opacity-50">
            <p className="text-gray-500 italic">
              You are in Viewer Mode. Switch to Coach to edit data.
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;