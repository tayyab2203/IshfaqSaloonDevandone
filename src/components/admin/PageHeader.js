export default function PageHeader({ title, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-dark-charcoal">{title}</h1>
      {actions && <div className="flex flex-wrap gap-2 sm:gap-3">{actions}</div>}
    </div>
  );
}
