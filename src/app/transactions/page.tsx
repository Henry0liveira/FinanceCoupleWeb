"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import GradientHeader from "../../components/GradientHeader";
import OwnerCharts from "../../components/OwnerCharts";
import CategoryExpenseChart from "../../components/CategoryExpenseChart";
import FilterBar from "../../components/FilterBar";
import { useAuth } from "../../lib/auth";
import { addTransaction, fetchCoupleUsers } from "../../lib/firestore";
import { formatDatePtBr } from "../../lib/format";
import type { Transaction } from "../../lib/types";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

const defaultCategories = ["Moradia", "Mercado", "Viagem", "Saúde", "Contas", "Lazer"];

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(defaultCategories[0]);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [ownerId, setOwnerId] = useState<string>("shared");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPerson, setFilterPerson] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!user?.coupleId) return;
    const q = query(
      collection(db, "transactions"),
      where("coupleId", "==", user.coupleId),
      orderBy("date", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Transaction[];
      setTransactions(items);
    });
    return () => unsub();
  }, [user?.coupleId]);

  useEffect(() => {
    const loadMembers = async () => {
      if (!user?.coupleId) return;
      const people = await fetchCoupleUsers(user.coupleId);
      setMembers(people.map((person) => ({ id: person.id, name: person.name })));
    };
    loadMembers();
  }, [user?.coupleId]);

  useEffect(() => {
    if (user?.id) {
      setOwnerId(user.id);
    }
  }, [user?.id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.coupleId || !user.id) return;
    await addTransaction({
      coupleId: user.coupleId,
      description,
      amount: Number(amount),
      category,
      type,
      createdBy: user.id,
      ownerId,
      date
    });
    setDescription("");
    setAmount("");
  };

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const categoryOk = filterCategory === "all" || tx.category === filterCategory;
      const txOwner = tx.ownerId ?? tx.createdBy;
      const personOk = filterPerson === "all" || txOwner === filterPerson;
      const fromOk = !dateRange.from || tx.date >= dateRange.from;
      const toOk = !dateRange.to || tx.date <= dateRange.to;
      return categoryOk && personOk && fromOk && toOk;
    });
  }, [transactions, filterCategory, filterPerson, dateRange]);

  return (
    <AppShell>
      <div className="space-y-4">
        <GradientHeader
          eyebrow="Movimentações do casal"
          title="Transações"
          description="Registre receitas e despesas e veja suas tendências em um só lugar."
        />
        <PageHeader title="Gerenciar atividade" subtitle="Adicionar e filtrar" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form className="glass space-y-4 p-6" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brandPink/15 text-brandPink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-navy-900">Nova transação</p>
              <p className="text-xs text-slateSoft-500">Registre receitas ou despesas.</p>
            </div>
          </div>
          <div>
            <label className="label">Descrição</label>
            <input className="input mt-2" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Valor</label>
              <input className="input mt-2" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div>
              <label className="label">Data</label>
              <input className="input mt-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Categoria</label>
              <select className="input mt-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                {defaultCategories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Tipo</label>
              <select className="input mt-2" value={type} onChange={(e) => setType(e.target.value as "income" | "expense") }>
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Responsável</label>
            <select className="input mt-2" value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
              {members.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.id === user?.id ? "Você" : person.name}
                </option>
              ))}
              <option value="shared">Compartilhada</option>
            </select>
          </div>
          <button className="btn-primary w-full" type="submit">Adicionar transação</button>
        </form>

        <div className="space-y-4">
          <OwnerCharts
            transactions={transactions}
            userMap={members.reduce<Record<string, string>>((acc, member) => {
              acc[member.id] = member.name;
              return acc;
            }, {})}
            currentUserId={user?.id}
          />
          <CategoryExpenseChart transactions={transactions} />
          <FilterBar
            categories={defaultCategories}
            selectedCategory={filterCategory}
            onCategoryChange={setFilterCategory}
            dateRange={dateRange}
            onDateChange={setDateRange}
            people={[...members.map((person) => ({ id: person.id, name: person.id === user?.id ? "Você" : person.name })), { id: "shared", name: "Compartilhada" }]}
            selectedPerson={filterPerson}
            onPersonChange={setFilterPerson}
          />
          <div className="glass p-5">
            <div className="card-header mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brandBlue/15 text-brandBlue">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <h3 className="font-display text-lg font-semibold text-navy-900">Todas as transações</h3>
              </div>
              <span className="text-xs text-slateSoft-500">{filtered.length} itens</span>
            </div>
            <div className="space-y-3">
              {filtered.map((tx) => {
                const owner = tx.ownerId ?? tx.createdBy;
                const name = owner === "shared"
                  ? "Compartilhada"
                  : owner === user?.id
                  ? "Você"
                  : members.find((person) => person.id === owner)?.name || "Parceiro";
                const initials = name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("") || "C";

                return (
                  <div key={tx.id} className="flex flex-col gap-3 rounded-xl border border-white/60 bg-white/70 px-4 py-3 shadow-card backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{tx.description}</p>
                      <p className="text-xs text-slateSoft-500">{tx.category} · {formatDatePtBr(tx.date)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brandBlue/15 text-[10px] font-semibold text-brandBlue">
                          {initials}
                        </span>
                        <p className="text-xs font-semibold text-slateSoft-500">Por: {name}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-semibold ${tx.type === "income" ? "text-income" : "text-expense"}`}>
                      {tx.type === "income" ? "+" : "-"}R${tx.amount.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
