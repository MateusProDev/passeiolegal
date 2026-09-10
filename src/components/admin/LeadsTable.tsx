"use client";

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { StatusBadge, type LeadStatus } from './StatusBadge';
import { StatusSelect } from './StatusSelect';

type LeadRow = {
  code: string;
  status: LeadStatus;
  status_updated_at?: string;
  gclid?: string | null;
  utms?: {
    utm_campaign?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
  };
  landingPage?: string;
  observacao?: string;
  createdAt?: string;
};

type LeadsTableProps = {
  leads: LeadRow[];
};

export function LeadsTable({ leads }: LeadsTableProps) {
  const [items, setItems] = useState(leads);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const visibleRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  async function getAdminToken() {
    const token = localStorage.getItem('admin_id_token');
    if (!token) {
      throw new Error('Token de autenticação ausente');
    }
    return token;
  }

  async function handleStatusChange(code: string, nextStatus: LeadStatus, observacao?: string) {
    try {
      const response = await fetch(`/api/admin/lead/${code}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAdminToken()}`,
        },
        body: JSON.stringify({
          status: nextStatus,
          observacao,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Erro ao atualizar status');
      }

      setItems((current) =>
        current.map((lead) =>
          lead.code === code
            ? {
                ...lead,
                status: nextStatus,
                observacao: observacao || lead.observacao,
                status_updated_at: payload.updated_at || new Date().toISOString(),
              }
            : lead
        )
      );

      toast.success('Status atualizado com sucesso');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro ao atualizar status');
    }
  }

  function openWhatsApp(lead: LeadRow) {
    const code = lead.code;
    const message = `🔎 Código de referência: ${code}`;
    const url = `https://wa.me/5585997314093?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function viewDetails(lead: LeadRow) {
    alert(JSON.stringify(lead, null, 2));
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Data</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Código</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">GCLID</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Campanha</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Landing Page</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Ações</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {visibleRows.map((lead) => (
            <tr key={lead.code} className="align-top">
              <td className="px-4 py-3 text-sm text-slate-600">
                {lead.createdAt ? new Date(lead.createdAt).toLocaleString('pt-BR') : '-'}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-slate-800">{lead.code}</td>
              <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
              <td className="px-4 py-3 text-sm text-slate-600">{lead.gclid || '-'}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{lead.utms?.utm_campaign || '-'}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{lead.landingPage || '-'}</td>
              <td className="px-4 py-3">
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => openWhatsApp(lead)}
                    className="block w-full rounded-md bg-green-600 px-2 py-1.5 text-xs font-medium text-white"
                  >
                    Abrir WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => viewDetails(lead)}
                    className="block w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-700"
                  >
                    Ver detalhes
                  </button>

                  <StatusSelect
                    value={lead.status}
                    code={lead.code}
                    onChange={(nextStatus, observacao) => handleStatusChange(lead.code, nextStatus, observacao)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="text-sm text-slate-600">Página {page} de {totalPages}</span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
