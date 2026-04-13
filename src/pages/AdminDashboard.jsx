import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard 👑</h1>
        <p>Manage stores, users, reports</p>
      </div>
    </div>
  );
}