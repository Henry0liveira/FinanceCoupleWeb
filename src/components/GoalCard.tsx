import type { Goal } from "../lib/types";

export default function GoalCard({ goal }: { goal: Goal }) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  return (
    <div className="glass p-5">
      <div className="card-header mb-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-navy-900">{goal.name}</h3>
          <span className="mt-1 inline-flex rounded-full bg-brandPink/10 px-3 py-1 text-[11px] font-semibold text-brandPink">
            Meta compartilhada
          </span>
        </div>
        <span className="text-xs font-semibold text-slateSoft-500">
          R${goal.currentAmount.toFixed(0)} / R${goal.targetAmount.toFixed(0)}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-slateSoft-200">
        <div
          className="h-2 rounded-full bg-accent"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-xs font-semibold text-slateSoft-500">{progress.toFixed(0)}% funded</p>
    </div>
  );
}
