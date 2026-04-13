import Navbar from "../components/Navbar";

export default function ManagerDashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Manager Dashboard 📊</h1>
        <p>Manage inventory and products</p>
      </div>
    </div>
  );
}