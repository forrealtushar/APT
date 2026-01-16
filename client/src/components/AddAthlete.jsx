import { useState, useEffect } from 'react';
import api from '../api/axios';

const AddAthlete = ({ onAthleteAdded }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  
  // List to show existing athletes for deletion
  const [athleteList, setAthleteList] = useState([]);

  const fetchAthletes = async () => {
    try {
      const res = await api.get('/athletes');
      setAthleteList(res.data);
    } catch (err) {
      console.error("Error fetching athletes");
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this athlete?")) return;
    try {
      await api.delete(`/athletes/${id}`);
      fetchAthletes();
    } catch (err) {
      alert("Error deleting athlete");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean request without jersey number
      await api.post('/athletes', { name, age });
      
      setName('');
      setAge('');
      alert('Athlete Added Successfully!');
      
      fetchAthletes(); 
      if (onAthleteAdded) onAthleteAdded();
      
    } catch (error) {
      console.error(error);
      alert('Error adding athlete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Manage Athletes</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-4 items-end mb-8 border-b border-slate-700 pb-6">
        <div className="flex-1">
          <label className="block text-gray-400 text-sm mb-1">Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-blue-500 outline-none"
            placeholder="Name"
            required
          />
        </div>
        <div className="w-24">
          <label className="block text-gray-400 text-sm mb-1">Age</label>
          <input 
            type="number" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-blue-500 outline-none"
            placeholder="Age"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition-colors"
        >
          Add
        </button>
      </form>

      <div className="max-h-40 overflow-y-auto pr-2">
        <h3 className="text-gray-400 text-sm font-semibold mb-2">Existing Athletes</h3>
        <ul className="space-y-2">
          {athleteList.map(ath => (
            <li key={ath._id} className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-700">
              <span className="text-gray-300 text-sm">{ath.name} (Age: {ath.age})</span>
              <button 
                onClick={() => handleDelete(ath._id)}
                className="text-red-400 hover:text-white hover:bg-red-600 px-2 rounded text-xs transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddAthlete;