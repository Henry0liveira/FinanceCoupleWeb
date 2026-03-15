"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 lg:items-start">
        <div className="glass max-w-2xl p-10 text-center lg:text-left">
          <p className="label">FinanceCouple</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-navy-900 sm:text-5xl">
            Clareza financeira para casais modernos.
          </h1>
          <p className="mt-4 text-sm text-slateSoft-500 sm:text-base">
            Acompanhe receitas, despesas e metas juntos sem perder o contexto individual.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="btn-primary">Entrar</Link>
            <Link href="/register" className="btn-secondary">Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
