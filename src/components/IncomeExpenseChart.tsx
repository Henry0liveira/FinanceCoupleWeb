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

  // Calcular ângulos para o gráfico de pizza
  const incomeAngle = (incomePercentage / 100) * 360;
  const startAngle = -90; // Começar no topo
  const endAngle = startAngle + incomeAngle;

  // Função para converter ângulo em coordenadas (x, y) em um círculo
  const polarToCartesian = (angle: number, radius: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: 60 + radius * Math.cos(radians),
      y: 60 + radius * Math.sin(radians)
    };
  };

  const startPoint = polarToCartesian(startAngle, 45);
  const endPoint = polarToCartesian(endAngle, 45);
  const largeArc = incomeAngle > 180 ? 1 : 0;

  // Verificar se deve usar comando de arco grande
  const pathData =
    incomeAngle === 360
      ? `M ${startPoint.x} ${startPoint.y} A 45 45 0 1 1 ${endPoint.x} ${endPoint.y} A 45 45 0 1 1 ${startPoint.x} ${startPoint.y}`
      : `M 60 60 L ${startPoint.x} ${startPoint.y} A 45 45 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y} Z`;

  return (
    <div className="glass p-3 sm:p-4 md:p-5">
      <div className="card-header mb-3 sm:mb-4">
        <div className="min-w-0">
          <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Receitas vs Despesas</h3>
          <p className="text-xs text-slateSoft-500">Proporção total</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Círculo de fundo */}
            <circle cx="60" cy="60" r="45" fill="none" stroke="#EAE6F6" strokeWidth="10" />
            
            {/* Receitas (verde) - segmento principal */}
            <path d={pathData} fill="#23C483" stroke="none" />

            {/* Despesas (vermelho) - complemento */}
            {total > 0 && (
              <path
                d={`M 60 60 L ${endPoint.x} ${endPoint.y} A 45 45 0 ${largeArc === 1 ? 0 : 1} 1 ${startPoint.x} ${startPoint.y} Z`}
                fill="#EF4444"
                stroke="none"
              />
            )}

            {/* Texto no centro */}
            <text
              x="60"
              y="58"
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="#0F172A"
            >
              {total > 0 ? total.toFixed(0) : "0"}
            </text>
            <text
              x="60"
              y="72"
              textAnchor="middle"
              fontSize="11"
              fontWeight="500"
              fill="#8B86A3"
            >
              Total
            </text>
          </svg>
        </div>

        <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-income flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-navy-900">Receitas</p>
                <p className="text-[11px] sm:text-xs text-slateSoft-500">R${totalIncome.toFixed(0)}</p>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-income flex-shrink-0">
              {incomePercentage.toFixed(0)}%
            </span>
          </div>

          <div className="w-full h-1.5 sm:h-2 rounded-full bg-slateSoft-200 overflow-hidden">
            <div
              className="h-full bg-income transition-all"
              style={{ width: `${incomePercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-expense flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-navy-900">Despesas</p>
                <p className="text-[11px] sm:text-xs text-slateSoft-500">R${totalExpense.toFixed(0)}</p>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-expense flex-shrink-0">
              {expensePercentage.toFixed(0)}%
            </span>
          </div>

          <div className="w-full h-1.5 sm:h-2 rounded-full bg-slateSoft-200 overflow-hidden">
            <div
              className="h-full bg-expense transition-all"
              style={{ width: `${expensePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
