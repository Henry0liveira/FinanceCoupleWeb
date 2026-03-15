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
  const totalCategoryExpense = categories.reduce((sum, [, value]) => sum + value, 0);
  const maxMonth = Math.max(1, ...monthSeries.map(([, values]) => Math.max(values.income, values.expense)));
  const maxBalance = Math.max(1, ...balanceSeries.map((item) => Math.abs(item.balance)));
  const maxOwner = Math.max(1, ...ownerSeries.map(([, value]) => value));
  const pieRadius = 48;
  const pieCircumference = 2 * Math.PI * pieRadius;
  const pieColors = ["text-brandPink", "text-brandPurple", "text-brandBlue", "text-income", "text-expense", "text-navy-900"];
  let pieOffset = 0;

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
    <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="glass p-3 sm:p-4 md:p-5">
        <div className="card-header mb-3 sm:mb-4">
          <div className="min-w-0">
            <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Tendência mensal</h3>
            <p className="text-xs text-slateSoft-500">Últimos 6 meses</p>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="h-32 sm:h-40 w-full rounded-2xl bg-white/70 p-2 sm:p-3 md:p-4">
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
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs text-slateSoft-500 sm:grid-cols-3 md:gap-4">
            {monthSeries.map(([month, values]) => (
              <div key={month} className="rounded-xl bg-white/70 px-2 py-1.5 sm:px-3 sm:py-2 text-xs">
                <p className="font-semibold text-navy-900 truncate">{month}</p>
                <p className="truncate">Rec: R${values.income.toFixed(0)}</p>
                <p className="truncate">Des: R${values.expense.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
        <div className="glass p-3 sm:p-4 md:p-5">
          <div className="card-header mb-3 sm:mb-4">
            <div className="min-w-0">
              <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Receitas x Despesas</h3>
              <p className="text-xs text-slateSoft-500">Comparativo geral</p>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-income">Receitas</span>
              <span className="text-slateSoft-500 text-[11px] sm:text-xs">R${totalIncome.toFixed(0)}</span>
            </div>
            <div className="h-1.5 sm:h-2 w-full rounded-full bg-slateSoft-200">
              <div
                className="h-1.5 sm:h-2 rounded-full bg-income transition-all"
                style={{ width: `${(totalIncome / Math.max(1, totalIncome + totalExpense)) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-expense">Despesas</span>
              <span className="text-slateSoft-500 text-[11px] sm:text-xs">R${totalExpense.toFixed(0)}</span>
            </div>
            <div className="h-1.5 sm:h-2 w-full rounded-full bg-slateSoft-200">
              <div
                className="h-1.5 sm:h-2 rounded-full bg-expense transition-all"
                style={{ width: `${(totalExpense / Math.max(1, totalIncome + totalExpense)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass p-3 sm:p-4 md:p-5">
          <div className="card-header mb-3 sm:mb-4">
            <div className="min-w-0">
              <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Despesas por categoria</h3>
              <p className="text-xs text-slateSoft-500">Top categorias</p>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {categories.length ? (
              <>
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="relative h-36 w-36 sm:h-40 sm:w-40">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle
                        cx="60"
                        cy="60"
                        r={pieRadius}
                        className="text-slateSoft-200"
                        stroke="currentColor"
                        strokeWidth="14"
                        fill="none"
                      />
                      {categories.map(([category, value], index) => {
                        const slice = totalCategoryExpense > 0 ? (value / totalCategoryExpense) * pieCircumference : 0;
                        const colorClass = pieColors[index % pieColors.length];
                        const dash = `${slice} ${pieCircumference - slice}`;
                        const element = (
                          <circle
                            key={category}
                            cx="60"
                            cy="60"
                            r={pieRadius}
                            className={colorClass}
                            stroke="currentColor"
                            strokeWidth="14"
                            fill="none"
                            strokeDasharray={dash}
                            strokeDashoffset={-pieOffset}
                            strokeLinecap="round"
                          />
                        );
                        pieOffset += slice;
                        return element;
                      })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <p className="text-[11px] sm:text-xs text-slateSoft-500">Total</p>
                      <p className="text-base sm:text-lg font-bold text-navy-900">R${totalCategoryExpense.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-2.5">
                  {categories.map(([category, value], index) => {
                    const percent = totalCategoryExpense > 0 ? (value / totalCategoryExpense) * 100 : 0;
                    const colorClass = pieColors[index % pieColors.length];
                    return (
                      <div key={category} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
                          <span className="font-semibold text-navy-900 truncate">{category}</span>
                        </div>
                        <span className="text-slateSoft-500 text-[11px] sm:text-xs flex-shrink-0 ml-2">
                          R${value.toFixed(0)} · {percent.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-xs sm:text-sm text-slateSoft-500">Sem despesas cadastradas ainda.</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass p-3 sm:p-4 md:p-5 lg:col-span-2">
        <div className="card-header mb-3 sm:mb-4">
          <div className="min-w-0">
            <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Saldo acumulado</h3>
            <p className="text-xs text-slateSoft-500">Evolução mês a mês</p>
          </div>
        </div>
        <div className="h-32 sm:h-40 w-full rounded-2xl bg-white/70 p-2 sm:p-3 md:p-4">
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

      <div className="glass p-3 sm:p-4 md:p-5 lg:col-span-2">
        <div className="card-header mb-3 sm:mb-4">
          <div className="min-w-0">
            <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Participação por responsável</h3>
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
