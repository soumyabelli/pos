import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css"; // Ensure styles are pulled in

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role to login.");
      return;
    }
    setError("");

    try {
      // Dummy authentication for UI progress
      // Simulate brief network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Temporarily bypass real axios call
      // const res = await axios.post("http://localhost:5000/api/auth/login", { email, password, role });
      
      // Role-based routing
      if (role === "admin") navigate("/admin");
      else if (role === "inventory") navigate("/manager"); // Pointing to our ManagerDashboard for now
      else navigate("/pos");

    } catch (err) {
      setError("Login Failed");
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
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select 
            className="login-input bg-neutral-900 border-neutral-800 text-white cursor-pointer mt-1 appearance-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setError(""); // clear error on change
            }}
            required
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23A3A3A3%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
          >
            <option value="" disabled>Select your role...</option>
            <option value="cashier">Cashier</option>
            <option value="inventory">Inventory Manager</option>
            <option value="admin">System Admin</option>
          </select>

          <button
            type="submit"
            className="btn-primary-large glow"
            style={{ width: "100%", marginTop: "1rem" }}
          >
            Access System
          </button>
        </form>
      </div>
    </div>
  );
}
