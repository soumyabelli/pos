import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function ManagerDashboard() {
  const navigate = useNavigate();

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
              Manager Overview
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Welcome back. Here's what's happening at Urban Crust today.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/admin/inventory')}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all text-sm font-bold shadow-sm cursor-pointer"
            >
              Food Items
            </button>
            <button 
              onClick={() => navigate('/pos')}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all text-sm font-bold shadow-sm cursor-pointer"
            >
              Go to POS
            </button>
            <button className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-colors text-sm font-bold shadow-[0_8px_20px_rgba(14,165,233,0.3)] cursor-pointer">
              Download Report
            </button>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Today's Revenue" 
            value="₹4,289.00" 
            trend="+12.5%" 
            isPositive={true}
            icon="💰"
          />
          <StatCard 
            title="Total Orders" 
            value="142" 
            trend="+8.2%" 
            isPositive={true}
            icon="📦"
          />
          <StatCard 
            title="Avg Order Value" 
            value="₹30.20" 
            trend="-2.1%" 
            isPositive={false}
            icon="📈"
          />
          <StatCard 
            title="Active Staff" 
            value="8" 
            trend="Optimal" 
            isPositive={true}
            icon="👥"
          />
        </div>

        {/* Charts and Orders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Analytics Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 p-6 flex flex-col h-[420px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Revenue Analytics</h3>
              <select className="bg-slate-50 border border-slate-200 text-sm text-slate-600 font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer shadow-sm">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            
            <div className="flex-1 flex items-end gap-2 md:gap-4 mt-2 border-b border-slate-200 pb-2 relative">
              {/* Y axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 font-bold h-full pb-8">
                <span>₹5k</span>
                <span>₹4k</span>
                <span>₹3k</span>
                <span>₹2k</span>
                <span>₹1k</span>
              </div>
              
              <div className="ml-10 flex-1 flex items-end justify-between gap-1 sm:gap-2 h-full pb-6 relative">
                 {/* Decorative horizontal lines */}
                 <div className="absolute inset-x-0 bottom-6 top-1 flex flex-col justify-between pointer-events-none">
                   <div className="w-full border-b border-slate-100"></div>
                   <div className="w-full border-b border-slate-100"></div>
                   <div className="w-full border-b border-slate-100"></div>
                   <div className="w-full border-b border-slate-100"></div>
                 </div>

                 {/* Bars */}
                 {[
                   {day: 'Mon', val: 40}, {day: 'Tue', val: 65}, {day: 'Wed', val: 45},
                   {day: 'Thu', val: 80}, {day: 'Fri', val: 100}, {day: 'Sat', val: 110}, {day: 'Sun', val: 90}
                 ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 group h-full z-10">
                      <div className="w-full flex justify-center h-full items-end pb-2 relative">
                        <div 
                          style={{ height: `${item.val}%` }} 
                          className="w-full max-w-[48px] bg-slate-200 rounded-t-lg group-hover:bg-gradient-to-t group-hover:from-sky-500 group-hover:to-emerald-400 transition-all duration-300 relative cursor-pointer shadow-sm group-hover:shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white font-black text-xs py-1.5 px-2.5 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all duration-200 whitespace-nowrap pointer-events-none">
                            ₹{item.val * 30}
                            {/* Tooltip triangle */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 font-bold absolute bottom-0">{item.day}</span>
                    </div>
                 ))}
              </div>
            </div>
          </div>
          
          {/* Recent Orders List */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 p-6 flex flex-col h-[420px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Orders</h3>
              <button className="text-sm text-sky-500 hover:text-sky-600 transition-colors font-bold cursor-pointer">View All</button>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
              {[
                { id: '#1049', time: 'Just now', items: '2x Margherita, 1x Cola', amount: '₹42.50', status: 'Preparing' },
                { id: '#1048', time: '15 mins ago', items: '1x Pepperoni, Garlic Bread', amount: '₹36.00', status: 'Ready' },
                { id: '#1047', time: '32 mins ago', items: '3x Veggie Supreme', amount: '₹75.00', status: 'Delivered' },
                { id: '#1046', time: '1 hour ago', items: '1x BBQ Chicken', amount: '₹28.50', status: 'Delivered' },
                { id: '#1045', time: '2 hours ago', items: '2x Hawaiian, 2x Sprite', amount: '₹54.00', status: 'Delivered' },
              ].map((order, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50 transition-all flex justify-between items-center group cursor-pointer">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-slate-800">{order.id}</span>
                      <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${
                        order.status === 'Preparing' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        order.status === 'Ready' ? 'bg-sky-50 text-sky-600 border-sky-200' :
                        'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 truncate max-w-[180px]">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-800 group-hover:text-sky-600 transition-colors">{order.amount}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
    </div>
  );
}

// Reusable Stat Card Component for the dashboard
function StatCard({ title, value, trend, isPositive, icon }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-sky-300 hover:-translate-y-1 transition-all group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-sm font-bold mb-1">{title}</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h2>
        </div>
        <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-lg border border-sky-100 shadow-inner group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-sky-100 group-hover:to-emerald-100 transition-all">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
          isPositive 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
            : 'bg-rose-50 text-rose-600 border-rose-200'
        }`}>
          {trend}
        </span>
        <span className="text-xs text-slate-400 font-bold">vs yesterday</span>
      </div>
    </div>
  );
}