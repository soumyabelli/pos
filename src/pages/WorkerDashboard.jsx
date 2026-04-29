import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function WorkerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/tasks/${taskId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Urgent': return 'bg-red-100 text-red-700 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock size={16} />;
      case 'In Progress': return <AlertCircle size={16} />;
      case 'Completed': return <CheckCircle2 size={16} />;
      default: return null;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-[#F5E6D3] p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#3E2723] mb-2">My Tasks</h1>
          <p className="text-[#8B6F47]">Manage your assigned tasks and orders</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/60 border-2 border-[#D9C4B3] rounded-lg p-6 backdrop-blur-sm">
            <p className="text-[#8B6F47] text-sm font-bold mb-2">TOTAL TASKS</p>
            <p className="text-3xl font-black text-[#D4853D]">{stats.total}</p>
          </div>

          <div className="bg-white/60 border-2 border-[#D9C4B3] rounded-lg p-6 backdrop-blur-sm">
            <p className="text-[#8B6F47] text-sm font-bold mb-2">PENDING</p>
            <p className="text-3xl font-black text-orange-600">{stats.pending}</p>
          </div>

          <div className="bg-white/60 border-2 border-[#D9C4B3] rounded-lg p-6 backdrop-blur-sm">
            <p className="text-[#8B6F47] text-sm font-bold mb-2">IN PROGRESS</p>
            <p className="text-3xl font-black text-blue-600">{stats.inProgress}</p>
          </div>

          <div className="bg-white/60 border-2 border-[#D9C4B3] rounded-lg p-6 backdrop-blur-sm">
            <p className="text-[#8B6F47] text-sm font-bold mb-2">COMPLETED</p>
            <p className="text-3xl font-black text-green-600">{stats.completed}</p>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white/60 border-2 border-[#D9C4B3] rounded-lg p-12 text-center backdrop-blur-sm">
              <p className="text-[#8B6F47] font-bold">No tasks assigned yet</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task._id} className="bg-white/60 border-2 border-[#D9C4B3] rounded-lg p-6 backdrop-blur-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-[#3E2723]">{task.title}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md border flex items-center gap-1 ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {task.status}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-[#6F4E37] mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-xs text-[#8B6F47]">
                      <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span>🏷️ Category: {task.category}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {task.status === 'Pending' && (
                      <button
                        onClick={() => updateTaskStatus(task._id, 'In Progress')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-all"
                      >
                        Start
                      </button>
                    )}
                    
                    {task.status === 'In Progress' && (
                      <button
                        onClick={() => updateTaskStatus(task._id, 'Completed')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-sm hover:bg-green-600 transition-all"
                      >
                        Complete
                      </button>
                    )}

                    {task.status !== 'Completed' && task.status !== 'Cancelled' && (
                      <button
                        onClick={() => updateTaskStatus(task._id, 'Cancelled')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-all"
                      >
                        Cancel
                      </button>
                    )}
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
