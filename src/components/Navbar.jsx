import { useNavigate } from "react-router-dom";
import "../index.css"; 

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let role = "";
  if (token) {
    try {
      const payload = token.split(".")[1];
      if (payload) {
        const decoded = JSON.parse(atob(payload));
        role = decoded?.role || "";
      }
    } catch {
      role = "";
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <span className="logo-icon">✨</span>
        <span className="logo-text">Urban Crust</span>
      </div>

      <div className="navbar-actions">
        {role && (
          <span className="user-role-badge">
            {(role || "USER").toUpperCase()}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="btn-danger"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
