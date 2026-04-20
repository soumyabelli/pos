import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "MON", current: 14, previous: 18 },
  { name: "TUE", current: 44, previous: 22 },
  { name: "WED", current: 33, previous: 28 },
  { name: "THU", current: 49, previous: 31 },
  { name: "FRI", current: 70, previous: 34 },
  { name: "SAT", current: 86, previous: 36 },
  { name: "SUN", current: 88, previous: 40 },
];

export default function SalesChart() {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={312}>
        <AreaChart data={data} margin={{ top: 12, right: 8, left: -26, bottom: 4 }}>
          <defs>
            <linearGradient id="netSalesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4338ca" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#4338ca" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 6" stroke="#ebedf4" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              border: "1px solid #eceff8",
              borderRadius: "10px",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              color: "#111827",
            }}
            labelStyle={{ color: "#6b7280", fontWeight: 600 }}
            formatter={(value, name) => [
              `${value}%`,
              name === "current" ? "Net Sales" : "Last Week",
            ]}
          />

          <Line
            type="monotone"
            dataKey="previous"
            stroke="#c7cbe0"
            strokeDasharray="3 5"
            strokeWidth={2}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="current"
            stroke="#4338ca"
            strokeWidth={3}
            fill="url(#netSalesFill)"
            dot={false}
            activeDot={{ r: 4, stroke: "#4338ca", fill: "#ffffff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
