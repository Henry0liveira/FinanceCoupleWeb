import type { ActivityItem } from "../lib/types";
import { formatDatePtBr } from "../lib/format";

type ActivityFeedProps = {
  items: ActivityItem[];
  userMap?: Record<string, string>;
  currentUserId?: string | null;
};

export default function ActivityFeed({ items, userMap, currentUserId }: ActivityFeedProps) {
  return (
    <div className="glass p-5">
      <div className="card-header mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brandPink/15 text-brandPink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h6M4 12h10M4 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <h3 className="font-display text-lg font-semibold text-navy-900">Linha do tempo</h3>
        </div>
        <span className="text-xs font-semibold text-slateSoft-500">Atualizações recentes</span>
      </div>
      <div className="space-y-4">
        {items.map((item) => {
          const owner = item.createdBy;
          const displayName = owner
            ? owner === "shared"
              ? "Compartilhada"
              : owner === currentUserId
              ? "Você"
              : userMap?.[owner] || "Parceiro"
            : null;
          const initials = displayName
            ? displayName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join("") || "C"
            : null;

          return (
            <div key={item.id} className="flex items-start gap-3">
              <div
                className={`mt-1 h-2 w-2 rounded-full ${
                  item.accent === "income"
                    ? "bg-income"
                    : item.accent === "expense"
                    ? "bg-expense"
                    : "bg-accent"
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-navy-900">{item.title}</p>
                <p className="text-xs text-slateSoft-500">{item.detail} · {formatDatePtBr(item.date)}</p>
                {displayName ? (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brandBlue/15 text-[10px] font-semibold text-brandBlue">
                      {initials}
                    </span>
                    <p className="text-xs font-semibold text-slateSoft-500">Por: {displayName}</p>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
