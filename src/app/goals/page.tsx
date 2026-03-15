"use client";

import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import GradientHeader from "../../components/GradientHeader";
import GoalCard from "../../components/GoalCard";
import { useAuth } from "../../lib/auth";
import { addGoal } from "../../lib/firestore";
import type { Goal } from "../../lib/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  useEffect(() => {
    if (!user?.coupleId) return;
    const q = query(collection(db, "goals"), where("coupleId", "==", user.coupleId));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Goal[];
      setGoals(items);
    });
    return () => unsub();
  }, [user?.coupleId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.coupleId) return;
    await addGoal({
      coupleId: user.coupleId,
      name,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount)
    });
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
  };

  return (
    <AppShell>
      <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
        <GradientHeader
          eyebrow="Marcos compartilhados"
          title="Metas"
          description="Planeje grandes momentos e acompanhe o progresso ao longo do tempo."
        />
        <PageHeader title="Criar metas" subtitle="Foco do casal" />
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form className="glass space-y-2.5 sm:space-y-3 md:space-y-4 p-3 sm:p-4 md:p-5" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brandPurple/15 text-brandPurple sm:h-9 sm:w-9">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-navy-900">Nova meta</p>
              <p className="text-[11px] sm:text-xs text-slateSoft-500">Planeje viagens, casa própria ou reserva de emergência.</p>
            </div>
          </div>
          <div>
            <label className="label">Nome da meta</label>
            <input className="input mt-1.5 sm:mt-2" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-2.5 sm:gap-3 md:grid-cols-2">
            <div>
              <label className="label">Valor alvo</label>
              <input className="input mt-1.5 sm:mt-2" type="number" min="0" step="0.01" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
            </div>
            <div>
              <label className="label">Valor atual</label>
              <input className="input mt-1.5 sm:mt-2" type="number" min="0" step="0.01" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} required />
            </div>
          </div>
          <button className="btn-primary w-full mt-1 sm:mt-2" type="submit">Criar meta</button>
        </form>

        <div className="grid gap-2.5 sm:gap-3 md:gap-4 sm:grid-cols-2">
          {goals.length ? goals.map((goal) => <GoalCard key={goal.id} goal={goal} />) : (
            <div className="glass p-3 sm:p-4 md:p-5">
              <p className="text-xs sm:text-sm text-slateSoft-500">Adicione metas como Viagem, Reserva de emergência ou Comprar uma casa.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
