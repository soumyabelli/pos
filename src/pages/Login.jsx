import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserCircle, Shield, Coffee } from "lucide-react";
import "../index.css";

import { API_BASE_URL } from "../config/api";

export default function Login() {
  const [loginMode, setLoginMode] = useState("employee");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginMode === "employee") fetchEmployees();
  }, [loginMode]);

  const fetchEmployees = async () => {
    setEmployeeLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/employees`);
      const employeeData = Array.isArray(res.data) ? res.data : [];
      setEmployees(employeeData);
      if (employeeData.length === 1) {
        setSelectedEmployee(employeeData[0].username);
      }
      if (employeeData.length === 0) {
        setError('No cashier accounts available. Please ask admin to create one.');
      }
    } catch (err) {
      console.error("Failed to load employee list:", err);
      setError("Unable to load employees. Check backend connection.");
      setEmployees([]);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (loginMode === "employee" && !selectedEmployee) {
        setError("Please select your name.");
        setLoading(false);
        return;
      }

      const loginPayload =
        loginMode === "employee"
          ? { username: selectedEmployee, password }
          : { identifier, password };

      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, loginPayload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const { role } = res.data.user;
      if (role === "admin") navigate("/admin");
      else if (role === "manager") navigate("/manager");
      else navigate("/pos");
    } catch (err) {
      if (!err.response) {
        setError("Unable to reach server. Check your connection.");
      } else {
        setError(err.response?.data?.error || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isEmployee = loginMode === "employee";

  return (
    <div className="login-container">
      <div className="login-glass-card" style={{ maxWidth: 440 }}>

        {/* Brand */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "linear-gradient(135deg,#ea580c,#b45309)",
            borderRadius: 14, padding: "10px 18px", color: "white"
          }}>
            <Coffee size={20} />
            <span style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "-0.2px" }}>
              Urban Crust
            </span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{
            background: "#f1f3f9", borderRadius: 999, padding: 4,
            display: "inline-flex", gap: 4
          }}>
            <button
              type="button"
              onClick={() => { setLoginMode("employee"); setError(""); setPassword(""); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 20px", borderRadius: 999, border: "none",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                transition: "all 0.2s",
                background: isEmployee ? "white" : "transparent",
                color: isEmployee ? "#ea580c" : "#6b7280",
                boxShadow: isEmployee ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
              }}
            >
              <UserCircle size={15} /> Staff
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode("admin"); setError(""); setPassword(""); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 20px", borderRadius: 999, border: "none",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                transition: "all 0.2s",
                background: !isEmployee ? "white" : "transparent",
                color: !isEmployee ? "#4338ca" : "#6b7280",
                boxShadow: !isEmployee ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
              }}
            >
              <Shield size={15} /> Admin / Manager
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="login-title">
          {isEmployee ? "Terminal Access" : (
            <>Management <span className="text-gradient">Portal</span></>
          )}
        </h2>
        <p className="login-subtitle" style={{ marginBottom: 28 }}>
          {isEmployee ? "Select your name and enter your PIN." : "Secure access for store operations."}
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#dc2626", borderRadius: 12, padding: "10px 14px",
              fontSize: 13, fontWeight: 500, textAlign: "center"
            }}>
              {error}
            </div>
          )}

          {isEmployee ? (
            <div style={{ position: "relative" }}>
              <select
                className="login-input"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                disabled={loading || employeeLoading}
              >
                <option value="" disabled>
                  {employeeLoading ? "Loading staff..." : "Select your name..."}
                </option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp.username}>
                    {emp.name} ({emp.subRole || "Staff"})
                  </option>
                ))}
              </select>
              {employees.length === 0 && !employeeLoading && (
                <p style={{ marginTop: 8, color: "#b45309", fontSize: 13 }}>
                  No cashier accounts found. Please contact your admin.
                </p>
              )}
            </div>
          ) : (
            <input
              className="login-input"
              placeholder="Username or Email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          )}

          <input
            type="password"
            className="login-input"
            placeholder={isEmployee ? "Secret PIN / Password" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
          />

          <button
            type="submit"
            className={`btn-primary-large glow`}
            style={{
              background: isEmployee
                ? "linear-gradient(120deg,#ea580c,#f97316,#fb923c)"
                : "linear-gradient(120deg,#4338ca,#6366f1,#818cf8)",
              boxShadow: isEmployee
                ? "0 15px 28px rgba(234,88,12,0.3)"
                : "0 15px 28px rgba(67,56,202,0.3)",
              opacity: loading ? 0.7 : 1,
              marginTop: 4
            }}
            disabled={loading}
          >
            {loading ? "Authenticating…" : "Sign In"}
          </button>
        </form>

        {/* Test Accounts */}
        <div style={{
          marginTop: 28, paddingTop: 20,
          borderTop: "1px solid #eef0f6",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#9ca3af", textTransform: "uppercase" }}>
            Test Accounts
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {[["Admin", "admin/admin"], ["Manager", "manager/manager"], ["Staff", "user/user"]].map(([label, creds]) => (
              <span key={label} style={{
                background: "#f8f9fc", border: "1px solid #eceef5",
                borderRadius: 8, padding: "4px 10px",
                fontSize: 11, color: "#6b7280", fontWeight: 500
              }}>
                <strong style={{ color: "#374151" }}>{label}</strong> · {creds}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
