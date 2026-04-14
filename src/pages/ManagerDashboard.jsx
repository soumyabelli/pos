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

        {/* Placeholders for tomorrow's work */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative h-[400px] rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="h-16 w-16 bg-neutral-800/50 rounded-full flex items-center justify-center text-2xl mb-4 border border-neutral-700">
              📊
            </div>
            <h3 className="text-xl font-semibold mb-2">Revenue Analytics Chart</h3>
            <p className="text-neutral-500 max-w-sm mb-6">
              Interactive sales graphs, heatmap for busy hours, and item performance charts will be implemented here.
            </p>
            <div className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-semibold tracking-wider uppercase mb-8 z-10">
              Scheduled for Tomorrow
            </div>
            
            {/* Decorative background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>
          </div>
          
          <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center h-[400px]">
            <div className="h-16 w-16 bg-neutral-800/50 rounded-full flex items-center justify-center text-2xl mb-4 border border-neutral-700">
              📋
            </div>
            <h3 className="text-xl font-semibold mb-2">Recent Transactions</h3>
            <p className="text-neutral-500 text-sm max-w-[200px] mb-6">
              Live feed of incoming orders and payment status.
            </p>
            <div className="px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-semibold tracking-wider uppercase">
              Scheduled for Tomorrow
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