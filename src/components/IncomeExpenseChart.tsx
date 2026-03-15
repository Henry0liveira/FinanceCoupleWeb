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

  return (
    <div className="glass p-3 sm:p-4 md:p-5">
      <div className="card-header mb-3 sm:mb-4">
        <div className="min-w-0">
          <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Receitas vs Despesas</h3>
          <p className="text-xs text-slateSoft-500">Proporção total</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Gráfico de barras apiladas */}
        <div className="flex flex-col gap-3">
          <div className="w-full h-16 sm:h-20 rounded-xl bg-slateSoft-100 p-2 sm:p-3 flex items-center gap-1 overflow-hidden">
            <div 
              className="h-full bg-income rounded-lg transition-all flex items-center justify-center"
              style={{ width: `${incomePercentage}%`, minWidth: incomePercentage > 10 ? "auto" : "0" }}
            >
              {incomePercentage > 15 && <span className="text-[10px] sm:text-xs font-semibold text-white">{incomePercentage.toFixed(0)}%</span>}
            </div>
            <div 
              className="h-full bg-expense rounded-lg transition-all flex items-center justify-center"
              style={{ width: `${expensePercentage}%`, minWidth: expensePercentage > 10 ? "auto" : "0" }}
            >
              {expensePercentage > 15 && <span className="text-[10px] sm:text-xs font-semibold text-white">{expensePercentage.toFixed(0)}%</span>}
            </div>
          </div>
        </div>

        {/* Detalhes */}
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

        {/* Total */}
        <div className="rounded-lg border border-navy-900/10 p-3 sm:p-4">
          <p className="text-xs text-slateSoft-500 mb-1">Total movimentado</p>
          <p className="text-lg sm:text-2xl font-bold text-navy-900">R${total.toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
}
