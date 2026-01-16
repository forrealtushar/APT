// client/src/components/AddTest.jsx
import { useState } from 'react';
import api from '../api/axios';

const AddTest = ({ onTestAdded }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [type, setType] = useState('timer'); // Default to timer
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/tests', { name, unit, type });
      alert('Test Created Successfully!');
      setName('');
      setUnit('');
      if (onTestAdded) onTestAdded();
    } catch (error) {
      console.error(error);
      alert('Error creating test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 border-l-4 border-purple-500">
      <h2 className="text-xl font-bold text-white mb-4">Create New Test Type</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        {/* Test Name */}
        <div>
          <label className="block text-gray-400 text-sm mb-1">Test Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-purple-500 outline-none"
            placeholder="e.g. 30m Sprint"
            required
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block text-gray-400 text-sm mb-1">Unit</label>
          <input 
            type="text" 
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-purple-500 outline-none"
            placeholder="e.g. seconds"
            required
          />
        </div>

        {/* Type Selection (Crucial for Leaderboard) */}
        <div>
          <label className="block text-gray-400 text-sm mb-1">Scoring Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-purple-500 outline-none"
          >
            <option value="timer">Time (Lower is Better)</option>
            <option value="distance">Distance (Higher is Better)</option>
            <option value="count">Count (Higher is Better)</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          {loading ? 'Saving...' : 'Create Test'}
        </button>
      </form>
    </div>
  );
};

export default AddTest;