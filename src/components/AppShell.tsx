"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../lib/auth";

const links = [
  { href: "/dashboard", label: "Painel" },
  { href: "/transactions", label: "Transações" },
  { href: "/goals", label: "Metas" },
  { href: "/settings", label: "Configurações" }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen gradient-bg" />;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-2 py-3 sm:gap-4 sm:px-4 sm:py-4 md:gap-5 md:px-5 md:py-5 lg:gap-6 lg:flex-row lg:px-6 lg:py-6">
        <aside className="card h-fit w-full rounded-2xl p-4 sm:p-5 md:p-6 lg:w-64">
          <div className="mb-6 sm:mb-7 md:mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slateSoft-500">FinanceCouple</p>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-navy-900">Finanças a Dois</h1>
          </div>
          <nav className="flex flex-col gap-1.5 sm:gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold transition ${
                  pathname === link.href
                    ? "bg-gradient-to-r from-brandPink via-brandPurple to-brandBlue text-white shadow-glow"
                    : "text-navy-900 hover:bg-slateSoft-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">{children}</main>
      </div>
    </div>
  );
}
