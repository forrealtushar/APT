import { useState, useEffect } from 'react';
import api from '../api/axios';

const AddScore = ({ onScoreAdded }) => {
  const [athleteId, setAthleteId] = useState('');
  const [testId, setTestId] = useState('');
  const [score, setScore] = useState('');
  
  const [athletes, setAthletes] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const athletesRes = await api.get('/athletes');
        const testsRes = await api.get('/tests');
        setAthletes(athletesRes.data);
        setTests(testsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!athleteId || !testId) {
      alert("Please select both an athlete and a test");
      return;
    }

    setLoading(true);
    try {
      await api.post('/scores', { 
        athleteId, 
        testId, 
        score: Number(score) 
      });
      alert('Score Recorded Successfully!');
      setScore(''); 
      if (onScoreAdded) onScoreAdded();
    } catch (error) {
      console.error(error);
      alert('Error saving score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 border-l-4 border-green-500">
      <h2 className="text-xl font-bold text-white mb-4">Record Performance</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        <div>
          <label className="block text-gray-400 text-sm mb-1">Athlete</label>
          <select 
            value={athleteId}
            onChange={(e) => setAthleteId(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-green-500 outline-none"
            required
          >
            <option value="">Select Athlete...</option>
            {athletes.map(ath => (
              <option key={ath._id} value={ath._id}>{ath.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Test</label>
          <select 
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-green-500 outline-none"
            required
          >
            <option value="">Select Test...</option>
            {tests.map(t => (
              <option key={t._id} value={t._id}>{t.name} ({t.unit})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Result Score</label>
          <input 
            type="number" 
            step="0.01" // Allows decimals (e.g. 4.5s)
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-green-500 outline-none"
            placeholder="e.g. 4.5"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          {loading ? 'Saving...' : 'Save Score'}
        </button>
      </form>
    </div>
  );
};

export default AddScore;