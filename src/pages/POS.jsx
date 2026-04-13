import Navbar from "../components/Navbar";

export default function POS() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">POS Billing 💰</h1>
        <p>Scan products and generate bills</p>
      </div>
    </div>
  );
}