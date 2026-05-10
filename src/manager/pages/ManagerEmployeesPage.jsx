import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1810]/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-semibold text-[#3E2723]">{title}</h2>
        {children}
        <button type="button" onClick={onClose} className="mt-4 w-full rounded-xl border border-[#e7d5c3] bg-white py-2 text-sm font-semibold text-[#6F4E37] hover:bg-[#f8eee3]">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ManagerEmployeesPage() {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", role: "user", status: "Active" });
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } });
      // Only show users/workers to the manager (or all if needed)
      setUsers(res.data.filter(u => u.role !== 'admin'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/users`,
        { ...form, isActive: form.status === "Active" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ name: "", username: "", email: "", password: "", role: "user", status: "Active" });
      setIsOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Could not create user.");
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Employee Management</h1>
          <p className="mt-1 text-base text-[#8B6F47]">Manage your branch staff, cashiers, and workers.</p>
        </div>
        <button type="button" onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30 hover:opacity-90 transition">
          <Plus size={16} />
          Add Employee
        </button>
      </section>

      <div className="rounded-2xl border border-[#e7d5c3] bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#e7d5c3] bg-[#fffaf4]">
          <h2 className="text-xl font-medium text-[#3E2723]">Staff Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#3E2723]">
            <thead className="bg-[#f8eee3] text-xs uppercase tracking-wider text-[#8B6F47]">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Username</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7d5c3]">
              {users.map((row) => (
                <tr key={row._id} className="hover:bg-[#fff9f2] transition">
                  <td className="p-4">{row.name}</td>
                  <td className="p-4">{row.username}</td>
                  <td className="p-4 capitalize">{row.role}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => removeUser(row._id)} className="text-sm font-medium text-rose-500 hover:text-rose-600 transition">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#8B6F47]">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Employee">
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <div className="space-y-1">
            <label className="text-sm text-[#8B6F47]">Full Name</label>
            <input required className="w-full rounded-xl border border-[#e7d5c3] p-2 bg-white text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/20" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-[#8B6F47]">Login Username</label>
            <input required className="w-full rounded-xl border border-[#e7d5c3] p-2 bg-white text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/20" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-[#8B6F47]">Login Password</label>
            <input required type="password" placeholder="At least 5 characters" className="w-full rounded-xl border border-[#e7d5c3] p-2 bg-white text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/20" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] py-2 text-sm font-semibold text-white shadow-md shadow-[#6f4e37]/30 hover:opacity-90">
            Create Employee
          </button>
        </form>
      </Modal>
    </div>
  );
}