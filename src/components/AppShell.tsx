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
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="card h-fit w-full rounded-2xl p-6 lg:w-64">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slateSoft-500">FinanceCouple</p>
            <h1 className="font-display text-2xl font-semibold text-navy-900">Finanças a Dois</h1>
          </div>
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
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
        <main className="flex-1 space-y-8">{children}</main>
      </div>
    </div>
  );
}
