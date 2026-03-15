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
      <div className="space-y-4">
        <GradientHeader
          eyebrow="Perfil e casal"
          title="Configurações"
          description="Gerencie seus dados e convide seu parceiro."
        />
        <PageHeader
          title="Conta"
          subtitle="Ações"
          actions={<button className="btn-secondary" onClick={logout}>Sair</button>}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass space-y-4 p-6">
          <h3 className="font-display text-lg font-semibold text-navy-900">Perfil</h3>
          <div>
            <p className="label">Nome</p>
            <p className="text-sm text-navy-900">{user?.name || ""}</p>
          </div>
          <div>
            <p className="label">E-mail</p>
            <p className="text-sm text-navy-900">{user?.email || ""}</p>
          </div>
          <div>
            <p className="label">ID do casal</p>
            <p className="text-sm text-navy-900">{user?.coupleId || "Não vinculado"}</p>
          </div>
          {status ? <p className="text-xs text-accent">{status}</p> : null}
        </div>

        <div className="space-y-6">
          <form className="glass space-y-4 p-6" onSubmit={handleCreate}>
            <h3 className="font-display text-lg font-semibold text-navy-900">Criar casal</h3>
            <div>
              <label className="label">Nome do casal</label>
              <input className="input mt-2" value={coupleName} onChange={(e) => setCoupleName(e.target.value)} required />
            </div>
            <button className="btn-primary w-full" type="submit">Criar</button>
          </form>

          <form className="glass space-y-4 p-6" onSubmit={handleJoin}>
            <h3 className="font-display text-lg font-semibold text-navy-900">Entrar em um casal</h3>
            <div>
              <label className="label">ID do casal</label>
              <input className="input mt-2" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} required />
            </div>
            <button className="btn-secondary w-full" type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
