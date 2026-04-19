import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function InventoryDashboard() {
  const navigate = useNavigate();
  
  // Dummy State for Products
  const [products, setProducts] = useState([
    { id: '1', sku: 'PIZ-MARG', name: 'Margherita Pizza', category: 'Pizza', price: 12.99, stock: 45, image: '🍕' },
    { id: '2', sku: 'PIZ-PEP', name: 'Pepperoni Pizza', category: 'Pizza', price: 14.99, stock: 5, image: '🍕' },
    { id: '3', sku: 'BEV-COLA', name: 'Cola', category: 'Beverage', price: 2.50, stock: 120, image: '🥤' },
    { id: '4', sku: 'SD-GARLIC', name: 'Garlic Bread', category: 'Sides', price: 4.99, stock: 0, image: '🥖' },
    { id: '5', sku: 'PIZ-VEG', name: 'Veggie Supreme', category: 'Pizza', price: 15.99, stock: 22, image: '🍕' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const adjustStock = (id, amount) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + amount);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500/30 pb-12 relative">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 text-transparent bg-clip-text">
              Inventory Management
            </h1>
            <p className="text-neutral-400 mt-1">
              Manage product catalog, pricing, and monitor stock levels.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/manager')}
              className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors text-sm font-medium cursor-pointer"
            >
              Back to Overview
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:opacity-90 transition-opacity text-sm font-medium shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
            >
              <span className="text-lg">+</span> Add Product
            </button>
          </div>
        </div>

        {/* Filters/Search Area */}
        <div className="mb-6 flex gap-4">
          <input 
            type="text" 
            placeholder="Search by Name or SKU..." 
            className="flex-1 bg-neutral-900/50 border border-neutral-800 text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-neutral-600"
          />
          <select className="bg-neutral-900/50 border border-neutral-800 text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer appearance-none min-w-[150px]">
            <option value="all">All Categories</option>
            <option value="pizza">Pizza</option>
            <option value="sides">Sides</option>
            <option value="beverage">Beverages</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-neutral-800/50 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium rounded-tl-2xl">Product</th>
                  <th className="px-6 py-4 font-medium">SKU</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock Level</th>
                  <th className="px-6 py-4 font-medium text-right rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-xl border border-neutral-700">
                          {product.image}
                        </div>
                        <span className="font-medium text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 font-mono text-xs">{product.sku}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
                          <button onClick={() => adjustStock(product.id, -1)} className="px-2.5 py-1 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 transition-colors focus:outline-none font-bold">−</button>
                          <span className={`w-8 text-center font-medium ${product.stock === 0 ? 'text-rose-500' : product.stock < 10 ? 'text-orange-400' : 'text-emerald-400'}`}>
                            {product.stock}
                          </span>
                          <button onClick={() => adjustStock(product.id, 1)} className="px-2.5 py-1 hover:bg-neutral-800 text-neutral-400 hover:text-emerald-400 transition-colors focus:outline-none font-bold">+</button>
                        </div>
                        {product.stock === 0 && (
                          <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Out of Stock
                          </div>
                        )}
                        {product.stock > 0 && product.stock < 10 && (
                          <div className="flex items-center gap-1.5 text-orange-400 text-xs font-bold bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20">
                            <span className="w-2 h-2 rounded-full bg-orange-400"></span> Low Stock
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-neutral-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 px-3 py-1 bg-neutral-800 rounded-lg text-xs font-medium">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl w-full max-w-md relative z-10 shadow-2xl shadow-black/80 transform transition-all scale-100 opacity-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
            </div>
            
            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Product Name</label>
                <input required type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-orange-500/50" placeholder="e.g. Hawaiian Pizza" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">SKU</label>
                  <input required type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-orange-500/50" placeholder="e.g. PIZ-HAW" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Category</label>
                  <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-orange-500/50 appearance-none">
                    <option>Pizza</option>
                    <option>Sides</option>
                    <option>Beverage</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Price ($)</label>
                  <input required type="number" step="0.01" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-orange-500/50" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Initial Stock</label>
                  <input required type="number" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-orange-500/50" placeholder="0" />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-neutral-800 text-neutral-300 rounded-lg transition-colors text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
