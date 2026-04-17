import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  const decoded = JSON.parse(atob(token.split(".")[1]));

  if (allowedRoles && !allowedRoles.includes(decoded.role)) {
    return <h2>Access Denied 🚫</h2>;
  }

  return children;
};

export default ProtectedRoute;