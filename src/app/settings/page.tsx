"use client";

import { useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import GradientHeader from "../../components/GradientHeader";
import { useAuth } from "../../lib/auth";
import { createCouple, joinCouple } from "../../lib/firestore";

export default function SettingsPage() {
  const { user, logout, refreshProfile } = useAuth();
  const [coupleName, setCoupleName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    const coupleId = await createCouple(user.id, coupleName);
    setStatus(`Casal criado. Compartilhe o ID: ${coupleId}`);
    await refreshProfile();
    setCoupleName("");
  };

  const handleJoin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    await joinCouple(user.id, joinCode);
    setStatus("Você entrou no casal.");
    await refreshProfile();
    setJoinCode("");
  };

  return (
    <AppShell>
      <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
        <GradientHeader
          eyebrow="Perfil e casal"
          title="Configurações"
          description="Gerencie seus dados e convide seu parceiro."
        />
        <PageHeader
          title="Conta"
          subtitle="Ações"
          actions={<button className="btn-secondary text-sm" onClick={logout}>Sair</button>}
        />
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 lg:grid-cols-2">
        <div className="glass space-y-2.5 sm:space-y-3 md:space-y-4 p-3 sm:p-4 md:p-5">
          <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Perfil</h3>
          <div>
            <p className="label text-xs">Nome</p>
            <p className="text-xs sm:text-sm text-navy-900 mt-1">{user?.name || ""}</p>
          </div>
          <div>
            <p className="label text-xs">E-mail</p>
            <p className="text-xs sm:text-sm text-navy-900 mt-1">{user?.email || ""}</p>
          </div>
          <div>
            <p className="label text-xs">ID do casal</p>
            <p className="text-xs sm:text-sm text-navy-900 mt-1">{user?.coupleId || "Não vinculado"}</p>
          </div>
          {status ? <p className="text-xs text-accent mt-2">{status}</p> : null}
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
          <form className="glass space-y-2.5 sm:space-y-3 md:space-y-4 p-3 sm:p-4 md:p-5" onSubmit={handleCreate}>
            <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Criar casal</h3>
            <div>
              <label className="label">Nome do casal</label>
              <input className="input mt-1.5 sm:mt-2" value={coupleName} onChange={(e) => setCoupleName(e.target.value)} required />
            </div>
            <button className="btn-primary w-full text-sm" type="submit">Criar</button>
          </form>

          <form className="glass space-y-2.5 sm:space-y-3 md:space-y-4 p-3 sm:p-4 md:p-5" onSubmit={handleJoin}>
            <h3 className="font-display text-base sm:text-lg font-semibold text-navy-900">Entrar em um casal</h3>
            <div>
              <label className="label">ID do casal</label>
              <input className="input mt-1.5 sm:mt-2" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} required />
            </div>
            <button className="btn-secondary w-full text-sm" type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
