import { useState, useEffect } from 'react';
import api from '../api/axios';

const Leaderboard = ({ role }) => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/tests').then(res => setTests(res.data));
  }, []);

  const fetchLeaderboard = async (testId) => {
    if (!testId) {
      setLeaderboard([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/leaderboard/${testId}`);
      setLeaderboard(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestChange = (e) => {
    const testId = e.target.value;
    setSelectedTest(testId);
    fetchLeaderboard(testId);
  };

  const handleDelete = async (scoreId) => {
    if (!window.confirm("Are you sure you want to delete this score?")) return;

    try {
      await api.delete(`/scores/${scoreId}`);
      setLeaderboard(prev => prev.filter(score => score._id !== scoreId));
    } catch (err) {
      alert("Failed to delete score");
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 border-t-4 border-yellow-500">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">🏆 Live Leaderboard</h2>
      
      <div className="mb-6 max-w-md mx-auto">
        <label className="block text-gray-400 text-sm mb-2 text-center">Select Event to View Rankings</label>
        <select 
          value={selectedTest}
          onChange={handleTestChange}
          className="w-full bg-slate-700 text-white p-3 rounded text-lg border border-slate-600 focus:border-yellow-500 outline-none text-center"
        >
          <option value="">-- Select an Event --</option>
          {tests.map(t => (
            <option key={t._id} value={t._id}>{t.name} ({t.type})</option>
          ))}
        </select>
      </div>

      {selectedTest && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-slate-700 text-gray-100 uppercase text-sm">
              <tr>
                <th className="p-4 text-center w-16">Rank</th>
                <th className="p-4">Athlete Name</th>
                <th className="p-4 text-right">Score</th>
                {role === 'coach' && <th className="p-4 text-center w-20">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <tr key={entry._id} className="hover:bg-slate-700/50 transition-colors group">
                    <td className="p-4 text-center font-bold text-yellow-500 text-xl">
                      {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : index + 1}
                    </td>
                    <td className="p-4 font-medium text-white">
                        {entry.athlete?.name || "Unknown"}
                        <span className="block text-xs text-gray-500">{entry.athlete?.team}</span>
                    </td>
                    <td className="p-4 text-right font-mono text-lg text-blue-300">{entry.score}</td>
                    {role === 'coach' && (
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDelete(entry._id)}
                          className="text-red-400 hover:text-red-200 hover:bg-red-900/50 p-2 rounded transition-all"
                          title="Delete Score"
                        >
                          🗑️
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'coach' ? 4 : 3} className="p-8 text-center text-gray-500">
                    {loading ? "Loading..." : "No scores recorded for this event yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;