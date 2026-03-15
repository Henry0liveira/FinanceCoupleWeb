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
    <div className="card flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="label">{subtitle}</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-navy-900">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-3">{actions}</div>
    </div>
  );
}
