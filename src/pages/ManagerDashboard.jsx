import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

export default function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
    category: 'Orders',
    notes: ''
  });

  useEffect(() => {
    fetchTasks();
    fetchWorkers();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users/workers/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkers(res.data);
    } catch (err) {
      console.error('Failed to fetch workers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/tasks`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ 
        title: '', 
        description: '', 
        assignedTo: '', 
        priority: 'Medium', 
        dueDate: '', 
        category: 'Orders', 
        notes: '' 
      });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await axios.delete(`${API_BASE}/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-slate-100 text-slate-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-[#F5E6D3] p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#3E2723] mb-2">Manager Dashboard</h1>
            <p className="text-[#8B6F47]">Create and assign tasks to your team</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#D4853D] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-[#C97030] transition-all"
            >
              <Plus size={20} /> New Task
            </button>
            <button
              onClick={handleLogout}
              className="bg-white text-rose-600 border border-rose-200 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-rose-50 transition-all shadow-sm"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Create Task Form */}
        {showForm && (
          <div className="bg-white/60 border-2 border-[#D9C4B3] rounded-lg p-6 mb-8 backdrop-blur-sm">
            <h2 className="text-xl font-black text-[#3E2723] mb-4">Assign New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="px-4 py-2 border-2 border-[#D9C4B3] rounded-lg focus:outline-none focus:border-[#D4853D]"
                  required
                />

                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="px-4 py-2 border-2 border-[#D9C4B3] rounded-lg focus:outline-none focus:border-[#D4853D]"
                  required
                >
                  <option value="">Select Worker</option>
                  {workers.map(worker => (
                    <option key={worker._id} value={worker._id}>{worker.name}</option>
                  ))}
                </select>

                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="px-4 py-2 border-2 border-[#D9C4B3] rounded-lg focus:outline-none focus:border-[#D4853D]"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent</option>
                </select>

                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="px-4 py-2 border-2 border-[#D9C4B3] rounded-lg focus:outline-none focus:border-[#D4853D]"
                >
                  <option value="Orders">Orders</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Report">Report</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="px-4 py-2 border-2 border-[#D9C4B3] rounded-lg focus:outline-none focus:border-[#D4853D] col-span-1 md:col-span-2"
                  required
                />
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border-2 border-[#D9C4B3] rounded-lg focus:outline-none focus:border-[#D4853D]"
                rows="3"
              />

              <textarea
                placeholder="Additional Notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-2 border-2 border-[#D9C4B3] rounded-lg focus:outline-none focus:border-[#D4853D]"
                rows="2"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition-all"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white/60 border-2 border-[#D9C4B3] rounded-lg p-12 text-center backdrop-blur-sm">
              <p className="text-[#8B6F47] font-bold">No tasks yet. Create one to get started!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task._id} className="bg-white/60 border-2 border-[#D9C4B3] rounded-lg p-6 backdrop-blur-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-[#3E2723]">{task.title}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#8B6F47] mt-3">
                      <div>
                        <p className="font-bold">Assigned To:</p>
                        <p>{task.assignedTo?.name}</p>
                      </div>
                      <div>
                        <p className="font-bold">Priority:</p>
                        <p>{task.priority}</p>
                      </div>
                      <div>
                        <p className="font-bold">Category:</p>
                        <p>{task.category}</p>
                      </div>
                      <div>
                        <p className="font-bold">Due Date:</p>
                        <p>{new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}