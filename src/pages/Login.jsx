import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserCircle, Shield } from "lucide-react";
import "../index.css";

import { API_BASE_URL } from "../config/api";

export default function Login() {
  const [loginMode, setLoginMode] = useState("employee"); // 'employee' or 'admin'
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginMode === "employee") {
      fetchEmployees();
    }
  }, [loginMode]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employee list:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginPayload = loginMode === "employee" 
        ? { username: selectedEmployee, password }
        : { identifier, password };

      if (loginMode === "employee" && !selectedEmployee) {
        setError("Please select an employee name.");
        setLoading(false);
        return;
      }

      // Call backend login API
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, loginPayload);

      // Store token
      localStorage.setItem("token", res.data.token);
      
      // Store user info
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Role-based routing
      const { role } = res.data.user;
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "manager") {
        navigate("/manager");
      } else {
        navigate("/pos");
      }
    } catch (err) {
      if (!err.response) {
        setError("Unable to reach server. Please check deployment/API URL.");
      } else {
        setError(err.response?.data?.error || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-glass-card max-w-[400px]">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-slate-100 p-1 flex">
            <button
              type="button"
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${loginMode === "employee" ? "bg-white text-[#d4853d] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              onClick={() => { setLoginMode("employee"); setError(""); setPassword(""); }}
            >
              <UserCircle size={16} /> Staff
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${loginMode === "admin" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              onClick={() => { setLoginMode("admin"); setError(""); setPassword(""); }}
            >
              <Shield size={16} /> Admin / Manager
            </button>
          </div>
        </div>

        <h2 className="login-title mb-2 text-center text-2xl font-black text-slate-800">
          {loginMode === "employee" ? "Terminal Access" : "Management Portal"}
        </h2>
        <p className="login-subtitle text-center mb-6">
          {loginMode === "employee" ? "Select your name and enter pin." : "Secure access for operations."}
        </p>
        
        <form onSubmit={handleLogin} className="login-form space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm py-2 px-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}
          
          {loginMode === "employee" ? (
            <div className="relative">
              <select
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-700 outline-none transition focus:border-[#d4853d] focus:bg-white"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                disabled={loading}
              >
                <option value="" disabled>Select your name...</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp.username}>
                    {emp.name} ({emp.subRole || 'Staff'})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <input
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              placeholder="Username or Email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={loading}
            />
          )}

          <input
            type="password"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            placeholder={loginMode === "employee" ? "Secret PIN / Password" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button
            type="submit"
            className={`h-12 w-full rounded-xl font-bold text-white transition ${loginMode === "employee" ? "bg-[#d4853d] hover:bg-[#c3752c] shadow-[0_4px_14px_rgba(212,133,61,0.3)]" : "bg-blue-600 hover:bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.3)]"}`}
            style={{ opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-center text-[10px] font-bold tracking-widest text-slate-400 mb-4">TEST ACCOUNTS</p>
          <div className="flex gap-2 text-center w-full justify-center">
             <div className="text-[10px] text-slate-500">Admin: admin/admin</div>
             <div className="text-[10px] text-slate-500">|</div>
             <div className="text-[10px] text-slate-500">Manager: manager/manager</div>
             <div className="text-[10px] text-slate-500">|</div>
             <div className="text-[10px] text-slate-500">User: user/user</div>
          </div>
        </div>
      </div>
    </div>
  );
}


