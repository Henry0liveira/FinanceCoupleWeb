import type { Transaction } from "../lib/types";
import { formatDatePtBr } from "../lib/format";

type TransactionListProps = {
  transactions: Transaction[];
  userMap?: Record<string, string>;
  currentUserId?: string | null;
};

export default function TransactionList({ transactions, userMap, currentUserId }: TransactionListProps) {
  return (
      <div className="glass p-5">
        <div className="card-header mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brandPurple/15 text-brandPurple">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <h3 className="font-display text-lg font-semibold text-navy-900">Transações recentes</h3>
          </div>
          <span className="text-xs font-semibold text-slateSoft-500">Últimas movimentações</span>
        </div>
        <div className="space-y-4">
          {transactions.map((tx) => {
            const owner = tx.ownerId ?? tx.createdBy;
            const ownerName = owner === "shared" ? "Compartilhada" : userMap?.[owner];
            const displayName = owner === "shared"
              ? "Compartilhada"
              : owner === currentUserId
              ? "Você"
              : ownerName || "Parceiro";
            const initials = displayName
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
                    <p className="text-xs font-semibold text-slateSoft-500">Por: {displayName}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className={`text-sm font-semibold ${tx.type === "income" ? "text-income" : "text-expense"}`}>
                    {tx.type === "income" ? "+" : "-"}R${tx.amount.toFixed(2)}
                  </p>
                  <span className={tx.type === "income" ? "badge-income" : "badge-expense"}>
                    {tx.type === "income" ? "Receita" : "Despesa"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
  );
}
