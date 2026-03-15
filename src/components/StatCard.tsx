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
    <div className="glass p-3 sm:p-4 md:p-5">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className={`h-2 w-2 rounded-full ${dotClass} sm:h-2.5 sm:w-2.5`} />
        <p className="label text-xs">{label}</p>
      </div>
      <div className="mt-2 sm:mt-3 flex items-end justify-between">
        <p className={`text-xl sm:text-2xl md:text-3xl font-semibold ${accentClass}`}>{value}</p>
        {trend ? <span className="text-xs font-semibold text-slateSoft-500">{trend}</span> : null}
      </div>
    </div>
  );
}
