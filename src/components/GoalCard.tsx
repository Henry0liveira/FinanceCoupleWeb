"use client";

import { useState } from "react";
import type { Goal } from "../lib/types";
import { contributeToGoal } from "../lib/firestore";

export default function GoalCard({ goal }: { goal: Goal }) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const [contribution, setContribution] = useState("");

  const handleContribute = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(contribution);
    if (!Number.isFinite(value) || value <= 0) return;
    await contributeToGoal(goal.id, value);
    setContribution("");
  };

  return (
    <div className="glass p-3 sm:p-4 md:p-5">
      <div className="card-header mb-2 sm:mb-3">
        <div className="min-w-0">
          <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900 truncate">{goal.name}</h3>
          <span className="mt-1 inline-flex rounded-full bg-brandPink/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-brandPink">
            Meta compartilhada
          </span>
        </div>
        <span className="text-xs font-semibold text-slateSoft-500 flex-shrink-0 whitespace-nowrap">
          R${goal.currentAmount.toFixed(0)} / R${goal.targetAmount.toFixed(0)}
        </span>
      </div>
      <div className="h-1.5 sm:h-2 w-full rounded-full bg-slateSoft-200">
        <div
          className="h-1.5 sm:h-2 rounded-full bg-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 sm:mt-3 text-xs font-semibold text-slateSoft-500">{progress.toFixed(0)}% funded</p>
      <form className="mt-3 sm:mt-4 space-y-2" onSubmit={handleContribute}>
        <label className="label">Contribuir com a meta</label>
        <div className="flex gap-2">
          <input
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            placeholder="Valor"
          />
          <button className="btn-primary" type="submit">Adicionar</button>
        </div>
      </form>
    </div>
  );
}
