import type { Transaction } from "../lib/types";

type CategoryExpenseChartProps = {
  transactions: Transaction[];
};

export default function CategoryExpenseChart({ transactions }: CategoryExpenseChartProps) {
  const categories = transactions
    .filter((tx) => tx.type === "expense")
    .reduce<Record<string, number>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

  const entries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(1, ...entries.map(([, value]) => value));

  return (
    <div className="glass p-5">
      <div className="card-header mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-navy-900">Gastos por categoria</h3>
          <p className="text-xs text-slateSoft-500">Somente despesas</p>
        </div>
      </div>
      <div className="space-y-3">
        {entries.length ? (
          entries.map(([category, value]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-navy-900">{category}</span>
                <span className="text-slateSoft-500">R${value.toFixed(2)}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slateSoft-200">
                <div
                  className="h-2 rounded-full bg-brandPink"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slateSoft-500">Sem despesas cadastradas ainda.</p>
        )}
      </div>
    </div>
  );
}
