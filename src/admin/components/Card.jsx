export default function Card({ title, subtitle, action, className = "", children }) {
  return (
    <section
      className={`rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.04] p-5 shadow-[0_20px_40px_rgba(4,8,30,0.35)] ${className}`}
    >
      {(title || subtitle || action) && (
        <header className="mb-4 flex items-start justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            {title && <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-slate-300/80">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
