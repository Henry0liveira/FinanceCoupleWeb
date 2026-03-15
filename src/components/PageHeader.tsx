export default function PageHeader({
  title,
  subtitle,
  actions
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:gap-5 md:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <p className="label text-xs">{subtitle}</p>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-navy-900">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">{actions}</div>
    </div>
  );
}
