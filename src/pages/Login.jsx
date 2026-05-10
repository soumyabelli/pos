import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../index.css";

const API_BASE = "http://localhost:5000/api";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call backend login API
      const res = await axios.post(`${API_BASE}/auth/login`, { 
        identifier,
        password 
      });

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
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-glass-card">
        <h2 className="login-title">Welcome to <span className="text-gradient">Urban Crust</span></h2>
        <p className="login-subtitle">Secure access for staff and admins.</p>
        
        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm py-2 px-3 rounded-lg mb-4 text-center font-medium">
              {error}
            </div>
          )}
          
          <input
            className="login-input"
            placeholder="Username or Email"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            disabled={loading}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input w-full pr-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary-large glow"
            style={{ width: "100%", marginTop: "1rem", opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Access System"}
          </button>
        </form>


      </div>
    </div>
  );
}
