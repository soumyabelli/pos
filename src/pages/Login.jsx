import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css"; // Ensure styles are pulled in

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.role === "admin") navigate("/admin");
      else if (decoded.role === "manager") navigate("/manager");
      else navigate("/pos");

    } catch {
      alert("Login Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-glass-card">
        <h2 className="login-title">Welcome to <span className="text-gradient">Urban Crust</span></h2>
        <p className="login-subtitle">Secure access for staff and admins.</p>
        
        <form onSubmit={handleLogin} className="login-form">
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
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
