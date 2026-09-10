"use client";

import { useState } from 'react';
import type { LeadStatus } from './StatusBadge';

type StatusSelectProps = {
  value: LeadStatus;
  code: string;
  onChange: (nextStatus: LeadStatus, observacao?: string) => Promise<void> | void;
};

export function StatusSelect({ value, code, onChange }: StatusSelectProps) {
  const [nextStatus, setNextStatus] = useState<LeadStatus>(value);
  const [observacao, setObservacao] = useState('');

  async function handleSave() {
    if (nextStatus === 'fechou') {
      const confirmed = window.confirm(`Confirmar fechamento do lead ${code}?`);
      if (!confirmed) return;
    }

    await onChange(nextStatus, observacao);
  }

  return (
    <div className="space-y-2">
      <select
        value={nextStatus}
        onChange={(event) => setNextStatus(event.target.value as LeadStatus)}
        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700"
      >
        <option value="visitou">Visitou</option>
        <option value="clicou_whatsapp">Clicou WhatsApp</option>
        <option value="enviou_mensagem">Enviou mensagem</option>
        <option value="fechou">Fechou</option>
        <option value="nao_respondeu">Não respondeu</option>
        <option value="perdido">Perdido</option>
      </select>

      <textarea
        value={observacao}
        onChange={(event) => setObservacao(event.target.value)}
        placeholder="Observação opcional"
        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700"
        rows={2}
      />

      <button
        onClick={handleSave}
        className="w-full rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700"
      >
        Salvar status
      </button>
    </div>
  );
}
