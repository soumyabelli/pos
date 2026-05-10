/* eslint-disable react/prop-types */
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
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
    subRole: "Cashier",
    shift: "Flexible",
    status: "Active"
  });
  const [error, setError] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/users/workers/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
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
    setCreatedCredentials(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/users/workers`,
        {
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
          subRole: form.subRole,
          shift: form.shift,
          isActive: form.status === "Active",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCreatedCredentials({ username: form.username, password: form.password });
      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "user",
        subRole: "Cashier",
        shift: "Flexible",
        status: "Active"
      });
      setIsOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Could not create user.");
    }
  };

  const removeUser = async (_id) => {
    alert("Deleting employees is admin-only.");
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

        {createdCredentials && (
          <div className="m-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p className="font-semibold">Employee created.</p>
            <p className="mt-1">Username: <span className="font-mono">{createdCredentials.username}</span></p>
            <p>Password: <span className="font-mono">{createdCredentials.password}</span></p>
            <p className="mt-1 text-xs text-emerald-700">Note: Password is shown only now. Store it safely.</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#3E2723]">
            <thead className="bg-[#f8eee3] text-xs uppercase tracking-wider text-[#8B6F47]">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Username</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Store</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7d5c3]">
              {users.map((row) => (
                <tr key={row._id} className="hover:bg-[#fff9f2] transition">
                  <td className="p-4">{row.name}</td>
                  <td className="p-4">{row.username}</td>
                  <td className="p-4">{row.email}</td>
                  <td className="p-4 capitalize">{row.role}</td>
                  <td className="p-4">{row.store}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => removeUser(row._id)} className="text-sm font-medium text-rose-500 hover:text-rose-600 transition" title="Admin only">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8B6F47]">No employees found.</td>
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
            <label htmlFor="emp-name" className="text-sm text-[#8B6F47]">Full Name</label>
            <input id="emp-name" required className="w-full rounded-xl border border-[#e7d5c3] p-2 bg-white text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/20" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label htmlFor="emp-username" className="text-sm text-[#8B6F47]">Login Username</label>
            <input id="emp-username" required className="w-full rounded-xl border border-[#e7d5c3] p-2 bg-white text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/20" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label htmlFor="emp-email" className="text-sm text-[#8B6F47]">Email</label>
            <input id="emp-email" required type="email" placeholder="employee@example.com" className="w-full rounded-xl border border-[#e7d5c3] p-2 bg-white text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/20" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label htmlFor="emp-password" className="text-sm text-[#8B6F47]">Login Password</label>
            <input id="emp-password" required type="password" placeholder="Set a password" className="w-full rounded-xl border border-[#e7d5c3] p-2 bg-white text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/20" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="emp-subrole" className="text-sm text-[#8B6F47]">Position</label>
              <select id="emp-subrole" className="w-full rounded-xl border border-[#e7d5c3] p-2 bg-white text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/20" value={form.subRole} onChange={(e) => setForm({ ...form, subRole: e.target.value })}>
                {[
                  "Cashier",
                  "Billing Staff",
                  "Inventory Staff",
                  "Service Staff",
                  "Support Staff",
                ].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="emp-shift" className="text-sm text-[#8B6F47]">Shift</label>
              <select id="emp-shift" className="w-full rounded-xl border border-[#e7d5c3] p-2 bg-white text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/20" value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })}>
                {["Morning", "Evening", "Night", "Flexible"].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] py-2 text-sm font-semibold text-white shadow-md shadow-[#6f4e37]/30 hover:opacity-90">
            Create Employee
          </button>
        </form>
      </Modal>
    </div>
  );
}