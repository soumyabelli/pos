import { useNavigate } from "react-router-dom";

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
    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">POS System</h1>

      <div className="flex items-center gap-4">
        <span className="bg-gray-700 px-3 py-1 rounded">
          {(role || "USER").toUpperCase()}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
