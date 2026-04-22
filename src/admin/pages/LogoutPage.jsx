import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function LogoutPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Logout</h1>
        <p className="mt-1 text-base text-slate-300/85">End the current admin session and return to login.</p>
      </section>

      <Card title="Confirm Logout">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2 text-sm font-medium text-white"
          >
            Logout Now
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-slate-100"
          >
            Cancel
          </button>
        </div>
      </Card>
    </div>
  );
}
