import { Clock, Calendar, User, CheckCircle } from "lucide-react";

export default function ManagerShiftsPage() {
  // Mock data for demonstration
  const activeShifts = [
    { id: 1, name: "Aarav Gupta", role: "Cashier", start: "08:00 AM", end: "04:00 PM" },
    { id: 2, name: "Sneha Patel", role: "Floor Staff", start: "09:00 AM", end: "05:00 PM" },
  ];

  const upcomingShifts = [
    { id: 3, name: "Rohan Sharma", role: "Cashier", start: "04:00 PM", end: "12:00 AM" },
    { id: 4, name: "Priya Singh", role: "Floor Staff", start: "05:00 PM", end: "01:00 AM" },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-black text-[#3E2723]">Shift Tracking</h1>
        <p className="mt-1 text-sm text-[#8B6F47]">Monitor active shifts and upcoming schedules.</p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Shifts */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
            <div className="grid h-10 w-10 place-content-center rounded-lg bg-emerald-100 text-emerald-600">
              <Clock size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#3E2723]">Active Shifts</h2>
          </div>
          <div className="mt-4 space-y-3">
            {activeShifts.map(shift => (
              <div key={shift.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-content-center rounded-full bg-[#f8eee3] text-[#D4853D]">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#3E2723]">{shift.name}</p>
                    <p className="text-xs text-slate-500">{shift.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle size={12} /> On Shift
                  </span>
                  <p className="mt-1 text-xs text-slate-500">{shift.start} - {shift.end}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Shifts */}
        <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-blue-100 pb-4">
            <div className="grid h-10 w-10 place-content-center rounded-lg bg-blue-100 text-blue-600">
              <Calendar size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#3E2723]">Upcoming Shifts</h2>
          </div>
          <div className="mt-4 space-y-3">
            {upcomingShifts.map(shift => (
              <div key={shift.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-content-center rounded-full bg-[#f8eee3] text-[#D4853D]">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#3E2723]">{shift.name}</p>
                    <p className="text-xs text-slate-500">{shift.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                     Upcoming
                  </span>
                  <p className="mt-1 text-xs text-slate-500">{shift.start} - {shift.end}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
