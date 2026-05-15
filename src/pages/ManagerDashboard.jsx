import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Home, ShoppingBag, Box, Truck, Users, UserCircle, 
  BarChart2, Tag, Settings, Monitor, FileText, 
  Archive, PlusCircle, Database, HelpCircle, Bell, ChevronDown, LogOut 
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../config/api';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#f43f5e', '#8b5cf6'];

export default function ManagerDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get(`${API_BASE}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/products`)
        ]);
        setOrders(ordersRes.data || []);
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Derived Stats
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map(o => o.customerPhone)).size;
  const averageBill = totalOrders > 0 ? totalSales / totalOrders : 0;
  const grossProfit = totalSales * 0.2; // Mock profit margin 20%

  // Top Selling Products
  const topSelling = useMemo(() => {
    return [...products].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 5);
  }, [products]);

  // Low Stock
  const lowStock = useMemo(() => {
    return products.filter(p => p.stock < 10).slice(0, 5);
  }, [products]);

  // Recent Transactions
  const recentTransactions = useMemo(() => {
    return orders.slice(0, 5).map((o, index) => ({
      invoice: o.orderId || `INV-${10000 + index}`,
      date: o.date,
      customer: o.customerName || 'Walk-in Customer',
      amount: o.totalAmount || 0,
      method: o.paymentMethod || 'Cash',
      cashier: 'Ramesh'
    }));
  }, [orders]);

  // Chart Data
  const salesOverviewData = useMemo(() => {
    // Mock daily data for the chart based on the image
    return [
      { time: '00:00', sales: 10000 },
      { time: '04:00', sales: 45000 },
      { time: '08:00', sales: 80000 },
      { time: '12:00', sales: 150000 },
      { time: '16:00', sales: 220000 },
      { time: '20:00', sales: 250000 },
      { time: '24:00', sales: 290000 }
    ];
  }, []);

  const paymentData = useMemo(() => {
    return [
      { name: 'UPI', value: 125450, color: '#10b981' },
      { name: 'Cash', value: 68420, color: '#f59e0b' },
      { name: 'Card', value: 32680, color: '#3b82f6' },
      { name: 'Wallet', value: 12450, color: '#f43f5e' },
      { name: 'Others', value: 6680, color: '#94a3b8' }
    ];
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#fdf8f4] via-[#faf8f6] to-[#fdf8f4] text-slate-800 font-sans relative">
      {/* Decorative background blur elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4853D]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8B6F47]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-2xl border-r border-white/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col shrink-0 z-10 relative">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[#3E2723]">
            <div className="grid h-8 w-8 place-content-center rounded-xl bg-gradient-to-br from-[#D4853D] to-[#6F4E37] text-white">☕</div>
            <span className="font-black text-xl tracking-tight">Urban Crust</span>
            <span className="text-xs font-semibold text-[#8B6F47] ml-2 border-l border-[#8B6F47]/30 pl-2">Manager<br/>Dashboard</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-[#3E2723] text-white rounded-lg font-medium text-sm">
              <Home size={18} /> Dashboard
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm">
              <div className="flex items-center gap-3"><ShoppingBag size={18} /> Sales Management</div>
              <ChevronDown size={14} className="opacity-50" />
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm">
              <div className="flex items-center gap-3"><Box size={18} /> Inventory Management</div>
              <ChevronDown size={14} className="opacity-50" />
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm">
              <div className="flex items-center gap-3"><Truck size={18} /> Purchase Management</div>
              <ChevronDown size={14} className="opacity-50" />
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm">
              <div className="flex items-center gap-3"><Users size={18} /> Employees</div>
              <ChevronDown size={14} className="opacity-50" />
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm">
              <UserCircle size={18} /> Customers
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm">
              <div className="flex items-center gap-3"><BarChart2 size={18} /> Reports & Analytics</div>
              <ChevronDown size={14} className="opacity-50" />
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm">
              <Tag size={18} /> Offers & Discounts
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm">
              <div className="flex items-center gap-3"><Settings size={18} /> Store Settings</div>
              <ChevronDown size={14} className="opacity-50" />
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm">
              <div className="flex items-center gap-3"><Monitor size={18} /> System Settings</div>
              <ChevronDown size={14} className="opacity-50" />
            </a>
          </nav>
          
          <div className="mt-8 px-4">
            <div className="bg-[#f8eee3] rounded-xl p-4">
              <h4 className="text-xs font-bold text-[#3E2723] mb-3">Today&apos;s Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Sales</span>
                  <span className="font-bold text-slate-900">₹{totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Orders</span>
                  <span className="font-bold text-slate-900">{totalOrders}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Customers</span>
                  <span className="font-bold text-slate-900">{totalCustomers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Average Bill Value</span>
                  <span className="font-bold text-slate-900">₹{averageBill.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/pos')}
              className="mt-4 w-full bg-[#3E2723] text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-[#2e1d1a] transition"
            >
              <Monitor size={18} /> POS Terminal
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden z-10 relative">
        {/* Header */}
        <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-white/50 shadow-sm flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            <span className="text-sm text-slate-500 hidden md:block">Welcome back! Here&apos;s what&apos;s happening in your store today.</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50">
              <span className="text-slate-500">Store:</span>
              <span className="font-semibold text-slate-700">UC001 - Main Cafe</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
            <div className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50">
              <span className="font-semibold text-slate-700">30 Apr 2025</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
            <span className="text-sm font-semibold text-slate-700">12:30 PM</span>
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200/60">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-700 leading-none">Soumya & Dhyan</p>
                <p className="text-xs text-slate-500 font-medium">Manager</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4853D] to-[#6F4E37] flex items-center justify-center text-white shadow-lg shadow-[#D4853D]/30 ring-2 ring-white hover:scale-105 transition-transform">
                <UserCircle size={22} />
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 hover:scale-110 flex items-center justify-center border border-red-100 hover:border-transparent"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(62,39,35,0.15)] transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <span className="font-bold text-xl">₹</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Sales</p>
                <h3 className="text-xl font-bold text-slate-800">₹{totalSales > 0 ? totalSales.toLocaleString('en-IN') : "2,45,680.50"}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">▲ 12.5% <span className="text-slate-400 font-normal ml-1">vs Yesterday</span></p>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(62,39,35,0.15)] transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Orders</p>
                <h3 className="text-xl font-bold text-slate-800">{totalOrders > 0 ? totalOrders : "658"}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">▲ 8.3% <span className="text-slate-400 font-normal ml-1">vs Yesterday</span></p>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(62,39,35,0.15)] transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Customers</p>
                <h3 className="text-xl font-bold text-slate-800">{totalCustomers > 0 ? totalCustomers : "832"}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">▲ 9.7% <span className="text-slate-400 font-normal ml-1">vs Yesterday</span></p>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(62,39,35,0.15)] transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Average Bill Value</p>
                <h3 className="text-xl font-bold text-slate-800">₹{averageBill > 0 ? averageBill.toFixed(2) : "372.86"}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">▲ 3.2% <span className="text-slate-400 font-normal ml-1">vs Yesterday</span></p>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(62,39,35,0.15)] transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <BarChart2 size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Gross Profit</p>
                <h3 className="text-xl font-bold text-slate-800">₹{grossProfit > 0 ? grossProfit.toLocaleString('en-IN') : "48,720.30"}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">▲ 15.4% <span className="text-slate-400 font-normal ml-1">vs Yesterday</span></p>
              </div>
            </div>
          </div>

          {/* Middle Row: Charts & Low Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sales Overview Area Chart */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#3E2723]/20 transition-all duration-300 lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Sales Overview</h3>
                <div className="flex gap-2">
                  <span className="text-xs font-semibold text-[#8B6F47] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8B6F47]"></span> Today</span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Yesterday</span>
                </div>
              </div>
              <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesOverviewData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4853D" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D4853D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#D4853D" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Payment Method Pie Chart */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#3E2723]/20 transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800">Sales by Payment Method</h3>
                <span className="text-xs text-slate-500 border border-slate-200 rounded px-2 py-1">Today ▼</span>
              </div>
              <div className="flex-1 relative min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for Donut Chart */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-bold text-slate-800">₹2,45,680.50</span>
                  <span className="text-xs text-slate-500">Total Sales</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {paymentData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-700 leading-none">{item.name}</p>
                      <p className="text-slate-500">₹{(item.value/1000).toFixed(1)}k</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#3E2723]/20 transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Low Stock Alert</h3>
                <a href="#" className="text-xs text-[#8B6F47] font-semibold hover:underline">View All</a>
              </div>
              <div className="space-y-4 flex-1 overflow-auto">
                {(lowStock.length > 0 ? lowStock : [
                  {product: 'Espresso Shot', sku: 'COF-ESP-001', stock: 5, min: 20},
                  {product: 'Croissant', sku: 'FOD-CRO-001', stock: 8, min: 20},
                  {product: 'Mocha Frappe', sku: 'DRK-MOC-003', stock: 3, min: 15},
                  {product: 'Cheesecake', sku: 'DST-CHS-004', stock: 6, min: 20}
                ]).map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-slate-200 flex items-center justify-center bg-slate-50 text-xs">IMG</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{item.product}</p>
                        <p className="text-xs text-slate-400">SKU: {item.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-500">Stock: {item.stock}</p>
                      <p className="text-xs text-slate-400">Min: {item.min || 15}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Recent Transactions & Top Selling */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
            {/* Recent Sales Transactions */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#3E2723]/20 transition-all duration-300 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Recent Sales Transactions</h3>
                <a href="#" className="text-sm text-[#8B6F47] font-semibold hover:underline">View All</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200">
                      <th className="font-medium pb-3 pr-4">Invoice No.</th>
                      <th className="font-medium pb-3 px-4">Date & Time</th>
                      <th className="font-medium pb-3 px-4">Customer</th>
                      <th className="font-medium pb-3 px-4 text-right">Total Amount</th>
                      <th className="font-medium pb-3 px-4 text-center">Payment Method</th>
                      <th className="font-medium pb-3 pl-4">Cashier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(recentTransactions.length > 0 ? recentTransactions : [
                      {invoice: 'INV-250430-001', date: '30 Apr 2025, 12:28 PM', customer: 'Walk-in Customer', amount: 1245.50, method: 'UPI', cashier: 'Ramesh'},
                      {invoice: 'INV-250430-002', date: '30 Apr 2025, 12:19 PM', customer: 'Walk-in Customer', amount: 856.00, method: 'Cash', cashier: 'Suresh'},
                      {invoice: 'INV-250430-003', date: '30 Apr 2025, 12:15 PM', customer: 'Walk-in Customer', amount: 2450.75, method: 'Card', cashier: 'Ramesh'},
                      {invoice: 'INV-250430-004', date: '30 Apr 2025, 12:08 PM', customer: 'Walk-in Customer', amount: 645.00, method: 'UPI', cashier: 'Priya'},
                      {invoice: 'INV-250430-005', date: '30 Apr 2025, 12:01 PM', customer: 'Walk-in Customer', amount: 1150.00, method: 'Cash', cashier: 'Suresh'}
                    ]).map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="py-3 pr-4 font-medium text-slate-700">{row.invoice}</td>
                        <td className="py-3 px-4 text-slate-600">{new Date(row.date).toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-600">{row.customer}</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-800">₹{(row.amount || 0).toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            row.method === 'UPI' ? 'bg-emerald-100 text-emerald-700' :
                            row.method === 'Cash' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {row.method}
                          </span>
                        </td>
                        <td className="py-3 pl-4 text-slate-600">{row.cashier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              {/* Top Selling Products */}
              <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#3E2723]/20 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-sm">Top Selling Products</h3>
                  <span className="text-xs text-slate-500 border border-slate-200 rounded px-2 py-1">Today ▼</span>
                </div>
                <div className="space-y-3">
                  {(topSelling.length > 0 ? topSelling : [
                    {product: 'Caramel Macchiato', price: 28450.00, qty: 142},
                    {product: 'Cheesecake', price: 18750.00, qty: 125},
                    {product: 'Iced Lemon Tea', price: 16320.00, qty: 85},
                    {product: 'Margherita Pizza', price: 14680.00, qty: 104},
                    {product: 'Pancake Stack', price: 12450.00, qty: 68}
                  ]).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-slate-700">
                        <span className="text-slate-400 w-3">{i+1}</span>
                        <span className="font-medium line-clamp-1">{item.product}</span>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <span className="font-semibold text-slate-800">₹{item.price ? item.price.toLocaleString() : "0"}</span>
                        <span className="text-slate-500 text-xs w-12">Qty: {item.qty || item.stock}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Store Performance */}
              <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#3E2723]/20 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-sm">Store Performance</h3>
                  <span className="text-xs text-emerald-600 font-semibold">This Month ▼</span>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <p className="text-xs text-slate-500">Total Sales</p>
                    <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      ₹28,45,680.50 <span className="text-[10px] text-emerald-600">▲ 14.5%</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Orders</p>
                    <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      7,658 <span className="text-[10px] text-emerald-600">▲ 11.8%</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Customers</p>
                    <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      9,856 <span className="text-[10px] text-emerald-600">▲ 13.2%</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Gross Profit</p>
                    <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      ₹5,48,720.30 <span className="text-[10px] text-emerald-600">▲ 16.7%</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Bar */}
        <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-slate-200 p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20 flex gap-2 overflow-x-auto">
          {[
            {icon: Monitor, label: 'POS Terminal', sub: 'F1'},
            {icon: BarChart2, label: 'Sales Report', sub: 'F2'},
            {icon: Box, label: 'Inventory Report', sub: 'F3'},
            {icon: Truck, label: 'Purchase Order', sub: 'F4'},
            {icon: Users, label: 'Add Employee', sub: 'F5'},
            {icon: Tag, label: 'Offers & Discounts', sub: 'F6'},
            {icon: Database, label: 'Backup Data', sub: 'F7'},
            {icon: Settings, label: 'Settings', sub: 'F8'}
          ].map((item, i) => (
            <button key={i} className="flex-1 min-w-[100px] flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition text-slate-600 hover:text-[#3E2723] group">
              <item.icon size={20} className="mb-1 text-slate-400 group-hover:text-[#3E2723]" />
              <span className="text-xs font-semibold whitespace-nowrap">{item.label}</span>
              <span className="text-[10px] text-slate-400">{item.sub}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}


