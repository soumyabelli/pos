export default function Card({ title, subtitle, action, className = "", children }) {
  return (
    <section
      className={`rounded-2xl border border-[#e7d5c3] bg-white p-5 shadow-[0_14px_30px_rgba(76,54,36,0.08)] ${className}`}
    >
      {(title || subtitle || action) && (
        <header className="mb-4 flex items-start justify-between gap-3 border-b border-[#f1e4d8] pb-3">
          <div>
            {title && <h2 className="text-xl font-semibold tracking-tight text-[#3E2723]">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-[#8B6F47]">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
