import React from 'react';
import { Download, Filter, MoreVertical, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const UserManagement = () => {
  // Unused state variables removed for linting

  const teamMembers = [
    {
      id: 1,
      name: 'Akash',
      email: 'sarah.j@curator.com',
      role: 'ADMIN',
      store: 'Central Flagship',
      status: 'Active',
      avatar: 'AK'
    },
    {
      id: 2,
      name: 'Soumya',
      email: 'm.bennett@curator.com',
      role: 'MANAGER',
      store: 'Westside Boutique',
      status: 'Active',
      avatar: 'SM'
    },
    {
      id: 3,
      name: 'Dhyan',
      email: 'd.chen@curator.com',
      role: 'CASHIER',
      store: 'Downtown Express',
      status: 'Away',
      avatar: 'DH'
    },
    {
      id: 4,
      name: 'Elena Rodriguez',
      email: 'e.rodriguez@curator.com',
      role: 'CASHIER',
      store: 'Central Flagship',
      status: 'Active',
      avatar: 'ER'
    },
    {
      id: 5,
      name: 'Jordan Smith',
      email: 'j.smith@curator.com',
      role: 'INVITED',
      store: 'Pending Assignment',
      status: 'Pending',
      avatar: 'JS'
    }
  ];

  const summaryCards = [
    { title: 'TOTAL EMPLOYEES', value: '42', color: '#0ea5e9' }, // sky-500
    { title: 'STORE MANAGERS', value: '8', color: '#10b981' }, // emerald-500
    { title: 'ACTIVE CASHIERS', value: '24', color: '#8b5cf6' }, // purple-500
    { title: 'PENDING INVITATIONS', value: '3', color: '#f59e0b' } // amber-500
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Away':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Pending':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'MANAGER':
        return 'bg-sky-50 text-sky-600 border-sky-200';
      case 'CASHIER':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'INVITED':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gradient-to-br from-sky-50 to-emerald-50 text-slate-800 selection:bg-sky-500/30">
      <Sidebar />
      <div className="flex-1 overflow-y-auto relative pb-12">
        {/* Soft Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-300/30 blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-emerald-300/30 blur-[120px] pointer-events-none z-0"></div>
        
        <div className="relative z-10">
          <Navbar />

          <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
                  User Management
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                  Manage employee access levels and store assignments across your network.
                </p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-colors text-sm font-bold shadow-[0_8px_20px_rgba(14,165,233,0.3)] cursor-pointer flex items-center gap-2 hover:-translate-y-0.5">
                <Plus size={18} strokeWidth={3} />
                Add User
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {summaryCards.map((card, index) => (
                <div key={index} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-sky-300 hover:-translate-y-1 transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-slate-500 text-sm font-bold mb-1">{card.title}</p>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</h2>
                    </div>
                    <div 
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-all text-white font-bold"
                      style={{ backgroundColor: card.color }}
                    >
                      {card.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Team Members Section */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 flex flex-col mb-10 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Active Team Members</h2>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all text-sm font-bold shadow-sm flex items-center gap-2">
                    <Download size={16} />
                    Export CSV
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all text-sm font-bold shadow-sm flex items-center gap-2">
                    <Filter size={16} />
                    Filters
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Store Assigned</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teamMembers.map((member) => {
                      const statusClass = getStatusColor(member.status);
                      const roleClass = getRoleColor(member.role);
                      
                      return (
                        <tr key={member.id} className="hover:bg-sky-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-emerald-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold group-hover:scale-105 transition-transform">
                                {member.avatar}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{member.name}</p>
                                <p className="text-xs font-medium text-slate-500">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full border ${roleClass}`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-600">
                            {member.store}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full border ${statusClass}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all mx-auto">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                <p className="text-sm font-medium text-slate-500">
                  Showing <span className="font-bold text-slate-800">1</span> to <span className="font-bold text-slate-800">5</span> of <span className="font-bold text-slate-800">42</span> employees
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-sky-50 hover:text-sky-700 transition-all text-sm font-bold flex items-center gap-1 shadow-sm">
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-center">1</button>
                  <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-all font-bold text-sm shadow-sm flex items-center justify-center">2</button>
                  <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-all font-bold text-sm shadow-sm flex items-center justify-center">3</button>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-sky-50 hover:text-sky-700 transition-all text-sm font-bold flex items-center gap-1 shadow-sm">
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-sky-300 transition-all group">
                <h3 className="text-lg font-black text-slate-800 mb-4 border-b border-slate-100 pb-3">Admin Permissions</h3>
                <ul className="space-y-3">
                  {['Full system access', 'User management', 'Store configuration', 'Financial reports'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-sky-300 transition-all group">
                <h3 className="text-lg font-black text-slate-800 mb-4 border-b border-slate-100 pb-3">Manager Permissions</h3>
                <ul className="space-y-3">
                  {['Staff management', 'Food Items control', 'Sales reports', 'Order processing'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-sky-300 transition-all group">
                <h3 className="text-lg font-black text-slate-800 mb-4 border-b border-slate-100 pb-3">Cashier Permissions</h3>
                <ul className="space-y-3">
                  {['POS operations', 'Product lookup', 'Basic returns', 'Shift reports'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
