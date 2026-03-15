"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import GradientHeader from "../../components/GradientHeader";
import StatCard from "../../components/StatCard";
import TransactionList from "../../components/TransactionList";
import GoalCard from "../../components/GoalCard";
import ActivityFeed from "../../components/ActivityFeed";
import OwnerCharts from "../../components/OwnerCharts";
import NotificationToast from "../../components/NotificationToast";
import { useAuth } from "../../lib/auth";
import { fetchCoupleTransactions, fetchGoals, fetchCoupleUsers } from "../../lib/firestore";
import { usePartnerNotifications } from "../../lib/hooks";
import type { ActivityItem, Goal, Transaction } from "../../lib/types";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const { notification, clear } = usePartnerNotifications(user?.coupleId, user?.id);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.coupleId) return;
      const [txs, goalsData, members] = await Promise.all([
        fetchCoupleTransactions(user.coupleId),
        fetchGoals(user.coupleId),
        fetchCoupleUsers(user.coupleId)
      ]);
      setTransactions(txs);
      setGoals(goalsData);
      const map: Record<string, string> = {};
      members.forEach((member) => {
        map[member.id] = member.name;
      });
      setUserMap(map);
      const activityItems: ActivityItem[] = txs.slice(0, 5).map((tx) => ({
        id: tx.id,
        type: "transaction",
        title: `${tx.type === "income" ? "Receita" : "Despesa"} · ${tx.description}`,
        detail: `${tx.category} · R$${tx.amount.toFixed(2)}`,
        date: tx.date,
        createdBy: tx.ownerId ?? tx.createdBy,
        accent: tx.type
      }));
      setActivity(activityItems);
    };
    loadData();
  }, [user?.coupleId]);

  const totals = useMemo(() => {
    const income = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = transactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [transactions]);

  if (loading) {
    return <div className="min-h-screen gradient-bg" />;
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <GradientHeader
          eyebrow="Visão do casal"
          title="Painel"
          description="Mantenha os dois parceiros alinhados com gastos, receitas e metas."
          actionHref="/transactions"
          actionLabel="Adicionar transação"
        />
        <PageHeader title="Destaques" subtitle="Visão rápida" />
      </div>

      {!user?.coupleId ? (
        <div className="card p-6">
          <p className="text-sm text-slateSoft-500">Você ainda não está vinculado a um casal.</p>
          <Link href="/settings" className="btn-primary mt-4">Criar ou entrar em um casal</Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Saldo total" value={`R$${totals.balance.toFixed(2)}`} accent="accent" />
            <StatCard label="Receitas totais" value={`R$${totals.income.toFixed(2)}`} accent="income" />
            <StatCard label="Despesas totais" value={`R$${totals.expenses.toFixed(2)}`} accent="expense" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <TransactionList transactions={transactions.slice(0, 6)} userMap={userMap} currentUserId={user?.id} />
            <div className="space-y-6">
              {goals.length ? (
                goals.slice(0, 2).map((goal) => <GoalCard key={goal.id} goal={goal} />)
              ) : (
                <div className="glass p-5">
                  <p className="text-sm text-slateSoft-500">Crie metas compartilhadas para acompanhar o progresso.</p>
                  <Link href="/goals" className="btn-secondary mt-4">Adicionar meta</Link>
                </div>
              )}
            </div>
          </div>

          <OwnerCharts transactions={transactions} userMap={userMap} currentUserId={user?.id} />

          <ActivityFeed items={activity} userMap={userMap} currentUserId={user?.id} />
        </>
      )}

      {notification ? <NotificationToast message={notification} onClose={clear} /> : null}
    </AppShell>
  );
}
