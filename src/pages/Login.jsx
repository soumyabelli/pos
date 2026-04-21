import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css"; // Ensure styles are pulled in

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Dummy authentication for UI progress
      // Simulate brief network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Temporarily bypass real axios call
      // const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      
      // Auto-detect role based on email for testing (backend will do this later via JWT token)
      let detectedRole = "cashier";
      if (email.toLowerCase().includes("admin")) detectedRole = "admin";
      else if (email.toLowerCase().includes("manager") || email.toLowerCase().includes("inventory")) detectedRole = "inventory";

      // Role-based routing
      if (detectedRole === "admin") navigate("/admin");
      else if (detectedRole === "inventory") navigate("/manager");
      else navigate("/pos");

    } catch {
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
