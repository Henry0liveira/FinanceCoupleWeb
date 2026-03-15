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
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-2 py-8 sm:gap-8 sm:px-4 sm:py-12 md:gap-10 md:px-6 md:py-16 lg:items-start">
        <div className="glass max-w-2xl p-4 sm:p-6 md:p-8 lg:p-10 text-center lg:text-left">
          <p className="label text-xs">FinanceCouple</p>
          <h1 className="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-navy-900">
            Clareza financeira para casais modernos.
          </h1>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slateSoft-500">
            Acompanhe receitas, despesas e metas juntos sem perder o contexto individual.
          </p>
          <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <Link href="/login" className="btn-primary text-sm">Entrar</Link>
            <Link href="/register" className="btn-secondary text-sm">Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
