export default function StatCard({ title, value, subtitle, icon, borderColor = 'border-slate-blue' }) {
  return (
    <div className={`bg-white border-2 ${borderColor} rounded-lg p-4 sm:p-6`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-blue">{title}</h3>
        {icon && <span className="text-xl sm:text-2xl">{icon}</span>}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-dark-charcoal mb-1">{value}</div>
      {subtitle && <p className="text-xs sm:text-sm text-slate-blue">{subtitle}</p>}
    </div>
  );
}
