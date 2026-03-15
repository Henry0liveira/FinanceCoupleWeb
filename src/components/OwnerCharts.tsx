import type { Transaction } from "../lib/types";

type OwnerChartsProps = {
  transactions: Transaction[];
  userMap: Record<string, string>;
  currentUserId?: string | null;
};

type OwnerTotals = {
  id: string;
  name: string;
  income: number;
  expense: number;
};

export default function OwnerCharts({ transactions, userMap, currentUserId }: OwnerChartsProps) {
  const ownerIds = Object.keys(userMap);
  const owners: OwnerTotals[] = [
    ...ownerIds.map((id) => ({
      id,
      name: id === currentUserId ? "Você" : userMap[id] || "Parceiro",
      income: 0,
      expense: 0
    })),
    {
      id: "shared",
      name: "Compartilhada",
      income: 0,
      expense: 0
    }
  ];

  const ownerIndex = new Map(owners.map((owner, index) => [owner.id, index]));

  transactions.forEach((tx) => {
    const owner = tx.ownerId ?? tx.createdBy;
    const idx = ownerIndex.get(owner);
    if (idx === undefined) return;
    if (tx.type === "income") {
      owners[idx].income += tx.amount;
    } else {
      owners[idx].expense += tx.amount;
    }
  });

  const maxTotal = Math.max(
    1,
    ...owners.map((owner) => owner.income + owner.expense)
  );

  return (
    <div className="glass p-5">
      <div className="card-header mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-navy-900">Receitas e despesas</h3>
          <p className="text-xs text-slateSoft-500">Por pessoa e compartilhadas</p>
        </div>
      </div>
      <div className="space-y-4">
        {owners.map((owner) => {
          const total = owner.income + owner.expense;
          const totalWidth = (total / maxTotal) * 100;
          const incomeWidth = total > 0 ? (owner.income / total) * 100 : 0;
          const expenseWidth = total > 0 ? (owner.expense / total) * 100 : 0;

          return (
            <div key={owner.id} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-navy-900">{owner.name}</p>
                <div className="flex items-center gap-3 text-xs text-slateSoft-500">
                  <span className="text-income">R${owner.income.toFixed(2)}</span>
                  <span className="text-expense">R${owner.expense.toFixed(2)}</span>
                </div>
              </div>
              <div className="h-3 w-full rounded-full bg-slateSoft-200">
                <div
                  className="flex h-3 rounded-full overflow-hidden"
                  style={{ width: `${totalWidth}%` }}
                >
                  <div className="h-3 bg-income" style={{ width: `${incomeWidth}%` }} />
                  <div className="h-3 bg-expense" style={{ width: `${expenseWidth}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
