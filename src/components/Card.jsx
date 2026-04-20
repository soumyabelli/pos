export default function Card({ title, value, extra, color = "text-gray-500" }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h4 className="text-gray-500 text-sm">{title}</h4>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
      <p className={`${color} text-sm mt-1`}>{extra}</p>
    </div>
  );
}