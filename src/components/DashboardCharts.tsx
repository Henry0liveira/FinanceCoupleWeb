import type { Transaction } from "../lib/types";

type DashboardChartsProps = {
  transactions: Transaction[];
  userMap: Record<string, string>;
  currentUserId?: string | null;
};

function groupByMonth(transactions: Transaction[]) {
  const map = new Map<string, { income: number; expense: number }>();
  transactions.forEach((tx) => {
    const month = tx.date.slice(0, 7);
    if (!map.has(month)) {
      map.set(month, { income: 0, expense: 0 });
    }
    const entry = map.get(month);
    if (!entry) return;
    if (tx.type === "income") entry.income += tx.amount;
    else entry.expense += tx.amount;
  });
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6);
}

function buildBalanceSeries(transactions: Transaction[]) {
  const series = groupByMonth(transactions);
  let running = 0;
  return series.map(([month, values]) => {
    running += values.income - values.expense;
    return { month, balance: running };
  });
}

function groupByOwner(transactions: Transaction[]) {
  const map = new Map<string, number>();
  transactions.forEach((tx) => {
    const owner = tx.ownerId ?? tx.createdBy;
    const signed = tx.type === "income" ? tx.amount : tx.amount;
    map.set(owner, (map.get(owner) || 0) + signed);
  });
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

function groupByCategory(transactions: Transaction[]) {
  const map = new Map<string, number>();
  transactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
    });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

export default function DashboardCharts({ transactions, userMap, currentUserId }: DashboardChartsProps) {
  const monthSeries = groupByMonth(transactions);
  const balanceSeries = buildBalanceSeries(transactions);
  const ownerSeries = groupByOwner(transactions);
  const categories = groupByCategory(transactions);
  const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
  const maxMonth = Math.max(1, ...monthSeries.map(([, values]) => Math.max(values.income, values.expense)));
  const maxBalance = Math.max(1, ...balanceSeries.map((item) => Math.abs(item.balance)));
  const maxOwner = Math.max(1, ...ownerSeries.map(([, value]) => value));

  const linePoints = monthSeries.map(([, values], idx) => {
    const x = (idx / Math.max(1, monthSeries.length - 1)) * 100;
    const y = 100 - (values.expense / maxMonth) * 100;
    return `${x},${y}`;
  });

  const balancePoints = balanceSeries.map((item, idx) => {
    const x = (idx / Math.max(1, balanceSeries.length - 1)) * 100;
    const y = 50 - (item.balance / maxBalance) * 45;
    return `${x},${y}`;
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="glass p-5">
        <div className="card-header mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy-900">Tendência mensal</h3>
            <p className="text-xs text-slateSoft-500">Últimos 6 meses</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-40 w-full rounded-2xl bg-white/70 p-4">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-brandPurple"
                points={linePoints.join(" ")}
              />
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-slateSoft-500 sm:grid-cols-3">
            {monthSeries.map(([month, values]) => (
              <div key={month} className="rounded-xl bg-white/70 px-3 py-2">
                <p className="font-semibold text-navy-900">{month}</p>
                <p>Receitas: R${values.income.toFixed(0)}</p>
                <p>Despesas: R${values.expense.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-5">
          <div className="card-header mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-navy-900">Receitas x Despesas</h3>
              <p className="text-xs text-slateSoft-500">Comparativo geral</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-income">Receitas</span>
              <span className="text-slateSoft-500">R${totalIncome.toFixed(2)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slateSoft-200">
              <div
                className="h-2 rounded-full bg-income"
                style={{ width: `${(totalIncome / Math.max(1, totalIncome + totalExpense)) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-expense">Despesas</span>
              <span className="text-slateSoft-500">R${totalExpense.toFixed(2)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slateSoft-200">
              <div
                className="h-2 rounded-full bg-expense"
                style={{ width: `${(totalExpense / Math.max(1, totalIncome + totalExpense)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass p-5">
          <div className="card-header mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-navy-900">Despesas por categoria</h3>
              <p className="text-xs text-slateSoft-500">Top categorias</p>
            </div>
          </div>
          <div className="space-y-3">
            {categories.length ? (
              categories.map(([category, value]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-navy-900">{category}</span>
                    <span className="text-slateSoft-500">R${value.toFixed(2)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slateSoft-200">
                    <div
                      className="h-2 rounded-full bg-brandPink"
                      style={{ width: `${(value / Math.max(1, categories[0]?.[1] || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slateSoft-500">Sem despesas cadastradas ainda.</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass p-5 lg:col-span-2">
        <div className="card-header mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy-900">Saldo acumulado</h3>
            <p className="text-xs text-slateSoft-500">Evolução mês a mês</p>
          </div>
        </div>
        <div className="h-40 w-full rounded-2xl bg-white/70 p-4">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-brandBlue"
              points={balancePoints.join(" ")}
            />
            <line x1="0" x2="100" y1="50" y2="50" className="text-slateSoft-200" stroke="currentColor" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>

      <div className="glass p-5 lg:col-span-2">
        <div className="card-header mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy-900">Participação por responsável</h3>
            <p className="text-xs text-slateSoft-500">Quem mais movimentou</p>
          </div>
        </div>
        <div className="space-y-3">
          {ownerSeries.length ? (
            ownerSeries.map(([owner, value]) => {
              const displayName =
                owner === "shared"
                  ? "Compartilhada"
                  : owner === currentUserId
                  ? "Você"
                  : userMap[owner] || "Parceiro";
              return (
              <div key={owner} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-navy-900">{displayName}</span>
                  <span className="text-slateSoft-500">R${value.toFixed(2)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slateSoft-200">
                  <div
                    className="h-2 rounded-full bg-brandPurple"
                    style={{ width: `${(value / maxOwner) * 100}%` }}
                  />
                </div>
              </div>
            );
            })
          ) : (
            <p className="text-sm text-slateSoft-500">Sem dados suficientes ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
