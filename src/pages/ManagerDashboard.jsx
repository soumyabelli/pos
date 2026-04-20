import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function ManagerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500/30 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 text-transparent bg-clip-text">
              Manager Overview
            </h1>
            <p className="text-neutral-400 mt-1">
              Welcome back. Here's what's happening at Urban Crust today.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/inventory')}
              className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors text-sm font-medium cursor-pointer"
            >
              Inventory
            </button>
            <button 
              onClick={() => navigate('/pos')}
              className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors text-sm font-medium cursor-pointer"
            >
              Go to POS
            </button>
            <button className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl hover:opacity-90 transition-opacity text-sm font-medium shadow-lg shadow-orange-500/20 cursor-pointer">
              Download Report
            </button>
          </div>
        </div>

        {/* Top Stats Cards - The "Completed" half of the page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Today's Revenue" 
            value="$4,289.00" 
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
            value="$30.20" 
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
          <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md p-6 flex flex-col h-[420px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Revenue Analytics</h3>
              <select className="bg-neutral-800 border border-neutral-700 text-sm text-neutral-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            
            <div className="flex-1 flex items-end gap-2 md:gap-4 mt-2 border-b border-neutral-800 pb-2 relative">
              {/* Y axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-500 font-medium h-full pb-8">
                <span>$5k</span>
                <span>$4k</span>
                <span>$3k</span>
                <span>$2k</span>
                <span>$1k</span>
              </div>
              
              <div className="ml-10 flex-1 flex items-end justify-between gap-1 sm:gap-2 h-full pb-6 relative">
                 {/* Decorative horizontal lines */}
                 <div className="absolute inset-x-0 bottom-6 top-1 flex flex-col justify-between pointer-events-none">
                   <div className="w-full border-b border-neutral-800/50"></div>
                   <div className="w-full border-b border-neutral-800/50"></div>
                   <div className="w-full border-b border-neutral-800/50"></div>
                   <div className="w-full border-b border-neutral-800/50"></div>
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
                          className="w-full max-w-[48px] bg-gradient-to-t from-orange-500/20 to-orange-500/80 rounded-t-lg group-hover:to-orange-400 group-hover:from-orange-400/40 transition-all duration-300 relative cursor-pointer shadow-[0_0_15px_rgba(249,115,22,0)] group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-neutral-800 text-white text-xs py-1.5 px-2.5 rounded-lg shadow-lg transition-all duration-200 whitespace-nowrap border border-neutral-700 pointer-events-none">
                            ${item.val * 30}
                            {/* Tooltip triangle */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 rotate-45 border-r border-b border-neutral-700"></div>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-400 font-medium absolute bottom-0">{item.day}</span>
                    </div>
                 ))}
              </div>
            </div>
          </div>
          
          {/* Recent Orders List */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md p-6 flex flex-col h-[420px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Recent Orders</h3>
              <button className="text-sm text-rose-400 hover:text-rose-300 transition-colors font-medium cursor-pointer">View All</button>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
              {[
                { id: '#1049', time: 'Just now', items: '2x Margherita, 1x Cola', amount: '$42.50', status: 'Preparing' },
                { id: '#1048', time: '15 mins ago', items: '1x Pepperoni, Garlic Bread', amount: '$36.00', status: 'Ready' },
                { id: '#1047', time: '32 mins ago', items: '3x Veggie Supreme', amount: '$75.00', status: 'Delivered' },
                { id: '#1046', time: '1 hour ago', items: '1x BBQ Chicken', amount: '$28.50', status: 'Delivered' },
                { id: '#1045', time: '2 hours ago', items: '2x Hawaiian, 2x Sprite', amount: '$54.00', status: 'Delivered' },
              ].map((order, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-neutral-800/30 border border-neutral-800/50 hover:bg-neutral-800/80 transition-colors flex justify-between items-center group cursor-pointer">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{order.id}</span>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'Preparing' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        order.status === 'Ready' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 truncate max-w-[180px]">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{order.amount}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{order.time}</p>
                  </div>
                </div>
              ))}
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
    <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md hover:bg-neutral-900/80 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-neutral-400 text-sm font-medium mb-1">{title}</p>
          <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
        </div>
        <div className="h-10 w-10 rounded-xl bg-neutral-800/80 flex items-center justify-center text-lg border border-neutral-700 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
        }`}>
          {trend}
        </span>
        <span className="text-xs text-neutral-500 font-medium">vs yesterday</span>
      </div>
    </div>
  );
}