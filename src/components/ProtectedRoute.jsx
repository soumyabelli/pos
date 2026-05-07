import { Navigate } from "react-router-dom";

function readRole() {
  try {
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      const user = JSON.parse(userRaw);
      if (user?.role) return String(user.role).toLowerCase();
    }
  } catch {
    // Ignore malformed local user payload.
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role ? String(payload.role).toLowerCase() : null;
  } catch {
    return null;
  }
}

function normalizeRole(role) {
  const normalized = String(role || "").toLowerCase();
  return normalized === "worker" ? "user" : normalized;
}

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = normalizeRole(readRole());
  const normalizedAllowedRoles = allowedRoles.map((r) => normalizeRole(r));
  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
