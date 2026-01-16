// client/src/components/AddTest.jsx
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../api/axios';

const AddTest = ({ onTestAdded }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [type, setType] = useState('timer'); // Default to timer
  const [loading, setLoading] = useState(false);
  const [testList, setAthleteList] = useState([])

  const fetchTests = async () => {
      try {
        const res = await api.get('/tests');
        setAthleteList(res.data);
      } catch (err) {
        console.error("Error fetching tests");
      }
    };

    useEffect(() => {
    fetchTests();
    }, []);

    const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await api.delete(`/tests/${id}`);
      fetchTests(); // Refresh the list
    } catch (err) {
      alert("Error deleting test");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/tests', { name, type, unit });
      alert('Test Created Successfully!');
      setName('');
      setUnit('');
      setType('timer');
      
      fetchTests(); // Refresh the list after adding
    } catch (error) {
      alert('Error creating test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 border-l-4 border-purple-500">
      <h2 className="text-xl font-bold text-white mb-4">Create New Test Type</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-14">
        
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
          <label className="block text-gray-400 text-sm mb-1">Score type</label>
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
          {loading ? 'Saving...' : 'Create'}
        </button>
      </form>

      {/* LIST SECTION - Identical Style to Manage Athletes */}
<div className="max-h-40 overflow-y-auto pr-2">
  <h3 className="text-gray-400 text-sm font-semibold mb-2">Existing Tests</h3>
  
  {testList.length === 0 ? (
    <p className="text-gray-500 text-sm text-center italic">No tests yet.</p>
  ) : (
    <ul className="space-y-2">
      {testList.map(test => (
        <li key={test._id} className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-700">
          <span className="text-gray-300 text-sm">
            {test.name} <span className="text-gray-500 text-xs">({test.unit})</span>
          </span>
          <button 
            onClick={() => handleDelete(test._id)}
            className="text-red-400 hover:text-white hover:bg-red-600 px-2 rounded text-xs transition-colors"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )}
</div>
    </div>
  );
};

export default AddTest;