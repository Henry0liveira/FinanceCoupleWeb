export default function StatCard({
  label,
  value,
  trend,
  accent
}: {
  label: string;
  value: string;
  trend?: string;
  accent?: "income" | "expense" | "accent";
}) {
  const accentClass = accent === "income" ? "text-income" : accent === "expense" ? "text-expense" : "text-accent";
  const dotClass = accent === "income" ? "bg-income" : accent === "expense" ? "bg-expense" : "bg-brandPurple";
  return (
    <div className="glass p-5">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
        <p className="label">{label}</p>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className={`text-2xl font-semibold ${accentClass}`}>{value}</p>
        {trend ? <span className="text-xs font-semibold text-slateSoft-500">{trend}</span> : null}
      </div>
    </div>
  );
}
