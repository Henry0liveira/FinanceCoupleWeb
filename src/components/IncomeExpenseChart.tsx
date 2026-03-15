import type { Transaction } from "../lib/types";

type IncomeExpenseChartProps = {
  transactions: Transaction[];
};

export default function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const total = totalIncome + totalExpense;
  const incomePercentage = total > 0 ? (totalIncome / total) * 100 : 0;
  const expensePercentage = total > 0 ? (totalExpense / total) * 100 : 0;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const incomeStroke = (incomePercentage / 100) * circumference;
  const expenseStroke = (expensePercentage / 100) * circumference;

  return (
    <div className="glass p-3 sm:p-4 md:p-5">
      <div className="card-header mb-3 sm:mb-4">
        <div className="min-w-0">
          <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Receitas vs Despesas</h3>
          <p className="text-xs text-slateSoft-500">Proporcao total</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="relative h-40 w-40 sm:h-48 sm:w-48">
            <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="text-slateSoft-200"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
              />
              {total > 0 ? (
                <>
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    className="text-income"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${incomeStroke} ${circumference - incomeStroke}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    className="text-expense"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${expenseStroke} ${circumference - expenseStroke}`}
                    strokeDashoffset={-incomeStroke}
                    strokeLinecap="round"
                  />
                </>
              ) : null}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[11px] sm:text-xs text-slateSoft-500">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-navy-900">R${total.toFixed(0)}</p>
            </div>
          </div>
          {total === 0 ? (
            <p className="text-xs text-slateSoft-500">Sem dados para compor o grafico ainda.</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-lg bg-income/10 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-income" />
              <p className="text-xs font-semibold text-navy-900">Receitas</p>
            </div>
            <p className="text-sm sm:text-base font-semibold text-income">R${totalIncome.toFixed(0)}</p>
            <p className="text-[10px] sm:text-xs text-slateSoft-500 mt-1">{incomePercentage.toFixed(0)}% do total</p>
          </div>

          <div className="rounded-lg bg-expense/10 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-expense" />
              <p className="text-xs font-semibold text-navy-900">Despesas</p>
            </div>
            <p className="text-sm sm:text-base font-semibold text-expense">R${totalExpense.toFixed(0)}</p>
            <p className="text-[10px] sm:text-xs text-slateSoft-500 mt-1">{expensePercentage.toFixed(0)}% do total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
