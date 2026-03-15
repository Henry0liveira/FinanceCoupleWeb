"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16">
        <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-brandPink via-brandPurple to-brandBlue p-6 text-white shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">FinanceCouple</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Comece a dois</h1>
          <p className="mt-2 text-sm text-white/85">Crie um espaço compartilhado para metas e gastos.</p>
        </div>
        <div className="glass w-full max-w-md p-8">
          <p className="label">Crie sua conta</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-navy-900">Registrar</h1>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Nome completo</label>
              <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="label">E-mail</label>
              <input className="input mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Senha</label>
              <input className="input mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error ? <p className="text-xs text-expense">{error}</p> : null}
            <button className="btn-primary w-full" type="submit">Criar conta</button>
          </form>
          <p className="mt-4 text-xs text-slateSoft-500">
            Já tem uma conta? <Link href="/login" className="font-semibold text-navy-900">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
