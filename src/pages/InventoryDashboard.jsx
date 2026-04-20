import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function InventoryDashboard() {
  const navigate = useNavigate();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Enhanced Dummy State for Products
  const [products, setProducts] = useState([
    { id: 'SKU-101', name: 'Margherita Pizza', category: 'Pizza', price: 12.99, stock: 45, sold: 120 },
    { id: 'SKU-102', name: 'Pepperoni Pizza', category: 'Pizza', price: 14.99, stock: 8, sold: 340 },
    { id: 'SKU-103', name: 'Garlic Bread', category: 'Sides', price: 4.99, stock: 0, sold: 560 },
    { id: 'SKU-104', name: 'Coca Cola 2L', category: 'Beverage', price: 3.50, stock: 120, sold: 890 },
    { id: 'SKU-105', name: 'Vegan Supreme', category: 'Pizza', price: 16.99, stock: 12, sold: 45 }
  ]);

  const handleStockChange = (idx, amount) => {
    const updated = [...products];
    if (updated[idx].stock + amount >= 0) {
      updated[idx].stock += amount;
      setProducts(updated);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setIsAddProductModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500/30 pb-16">
      <Navbar />

      {/* Expanded Container Width */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-10 animate-fade-in">

        {/* Grand Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-500 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              Supreme Inventory
            </h1>
            <p className="text-neutral-400 mt-3 text-lg max-w-2xl">
              Real-time stock.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/manager')}
              className="px-6 py-3 bg-neutral-900 border border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600 rounded-xl transition-all duration-300 text-sm font-bold tracking-wide shadow-lg cursor-pointer"
            >
              Manager Hub
            </button>
            <button
              onClick={() => navigate('/pos')}
              className="px-6 py-3 bg-neutral-900 border border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600 rounded-xl transition-all duration-300 text-sm font-bold tracking-wide shadow-lg cursor-pointer flex items-center gap-2"
            >
              Go to POS <span className="text-xl leading-none">↗</span>
            </button>
          </div>
        </div>

        {/* Global Catalog Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md hover:bg-neutral-800/50 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="text-neutral-400 text-sm font-semibold tracking-wider uppercase mb-2">Total Categories</div>
            <div className="text-4xl font-black text-white">12</div>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md hover:bg-neutral-800/50 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="text-neutral-400 text-sm font-semibold tracking-wider uppercase mb-2">Active SKUs</div>
            <div className="text-4xl font-black text-white">1,402</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-900/20 border border-amber-500/20 backdrop-blur-md relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="text-amber-400/80 text-sm font-semibold tracking-wider uppercase mb-2 relative z-10">Low Stock Warnings</div>
            <div className="text-4xl font-black text-amber-500 relative z-10 flex items-center gap-3">
              14 <span className="text-lg animate-pulse">⚠️</span>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-900/20 border border-rose-500/20 backdrop-blur-md relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="text-rose-400/80 text-sm font-semibold tracking-wider uppercase mb-2 relative z-10">Out of Stock</div>
            <div className="text-4xl font-black text-rose-500 relative z-10 flex items-center gap-3">
              3 <span className="text-lg">❌</span>
            </div>
          </div>
        </div>

        {/* Thick Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800/80 backdrop-blur-xl mb-8 shadow-2xl">
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search SKU, Product Name, or tags..."
                className="w-full bg-neutral-950 border border-neutral-700/80 text-white text-base rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-neutral-500 shadow-inner"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">🔍</span>
            </div>
            <select className="bg-neutral-950 border border-neutral-700/80 text-base text-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer shadow-inner">
              <option>All Categories</option>
              <option>Pizzas</option>
              <option>Sides & Appetizers</option>
              <option>Beverages</option>
              <option>Desserts</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="w-full md:w-auto mt-4 md:mt-0 px-8 py-3.5 bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95 transition-all duration-300 text-white font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="text-xl leading-none">+</span> Add New Product
          </button>
        </div>

        {/* Jumbo Data Table */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          <table className="w-full text-left text-base text-neutral-300">
            <thead className="bg-neutral-950/80 text-sm uppercase text-neutral-500 font-bold tracking-wider">
              <tr>
                <th className="px-8 py-5">Product Matrix</th>
                <th className="px-8 py-5 text-center">Lifetime Sales</th>
                <th className="px-8 py-5 text-right">Unit Price</th>
                <th className="px-8 py-5 text-center">Live Stock</th>
                <th className="px-8 py-5 text-center">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {products.map((product, idx) => (
                <tr key={product.id} className="hover:bg-neutral-800/40 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/50 flex items-center justify-center text-3xl shadow-inner group-hover:border-neutral-500 transition-colors">
                        {product.category === 'Pizza' ? '🍕' : product.category === 'Sides' ? '🥖' : '🥤'}
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg mb-1">{product.name}</div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-neutral-500 tracking-widest">{product.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-neutral-800 text-neutral-400 border border-neutral-700">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <span className="text-neutral-400 font-medium">{product.sold}</span>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <span className="font-bold text-white text-lg">${product.price.toFixed(2)}</span>
                  </td>

                  {/* Huge Dynamic Stock Indicator & Stepper */}
                  <td className="px-8 py-6 flex items-center justify-center gap-4">
                    <span className={`w-3.5 h-3.5 rounded-full shadow-lg ${product.stock === 0 ? 'bg-rose-500 animate-pulse shadow-rose-500/50 border border-rose-400' :
                        product.stock < 10 ? 'bg-amber-500 shadow-amber-500/50 border border-amber-400' :
                          'bg-emerald-500 shadow-emerald-500/30'
                      }`}></span>

                    <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-700/80 rounded-xl p-1 shadow-inner">
                      <button
                        onClick={() => handleStockChange(idx, -1)}
                        disabled={product.stock === 0}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-neutral-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors font-black text-xl cursor-pointer text-neutral-400 hover:text-white"
                      >
                        -
                      </button>
                      <div className={`w-14 text-center font-bold text-xl ${product.stock === 0 ? 'text-rose-500' : product.stock < 10 ? 'text-amber-500' : 'text-white'}`}>
                        {product.stock}
                      </div>
                      <button
                        onClick={() => handleStockChange(idx, 1)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-neutral-800 transition-colors font-black text-xl cursor-pointer text-orange-400 hover:text-orange-300"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <button className="px-4 py-2 rounded-lg text-neutral-400 border border-transparent hover:border-neutral-700 hover:text-white hover:bg-neutral-800 transition-all font-semibold text-sm opacity-50 group-hover:opacity-100 cursor-pointer">
                      Edit Item
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Product Modal Overlay */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsAddProductModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-2xl rounded-3xl bg-neutral-950 border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-spring-up">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-600"></div>

            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-white">Add New Product</h3>
                  <p className="text-base text-neutral-400 mt-2">Initialize a new item into the global POS catalog matrix.</p>
                </div>
                <button
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="w-10 h-10 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-all text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Display Name</label>
                  <input required type="text" placeholder="e.g. Classic Hawaiian" className="w-full bg-neutral-900 border border-neutral-700/80 text-white text-lg rounded-xl px-5 py-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all placeholder:text-neutral-600 shadow-inner" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">SKU Logic</label>
                    <input required type="text" placeholder="SKU-XXXX" className="w-full bg-neutral-900 border border-neutral-700/80 text-white text-lg rounded-xl px-5 py-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all placeholder:text-neutral-600 shadow-inner font-mono tracking-widest" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Category Group</label>
                    <div className="relative">
                      <select className="w-full bg-neutral-900 border border-neutral-700/80 text-white text-lg rounded-xl px-5 py-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all appearance-none cursor-pointer shadow-inner">
                        <option>Pizzas</option>
                        <option>Appetizers</option>
                        <option>Beverages</option>
                        <option>Desserts</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-lg">▼</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Customer Price ($)</label>
                    <input required type="number" step="0.01" min="0" placeholder="0.00" className="w-full bg-neutral-900 border border-neutral-700/80 text-white text-lg rounded-xl px-5 py-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all placeholder:text-neutral-600 shadow-inner text-right font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Initial Intake Amount</label>
                    <input required type="number" min="0" placeholder="0" className="w-full bg-neutral-900 border border-neutral-700/80 text-white text-lg rounded-xl px-5 py-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all placeholder:text-neutral-600 shadow-inner text-center font-black" />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 text-white rounded-xl text-lg font-black shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] active:scale-95 transition-all tracking-wider uppercase">
                    Initialize Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
