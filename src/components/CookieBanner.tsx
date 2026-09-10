"use client";

import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lgpd_consent');
    setVisible(consent === null);
  }, []);

  const accept = () => {
    localStorage.setItem('lgpd_consent', 'true');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem('lgpd_consent', 'false');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-700">
          Usamos cookies para rastrear a origem da visita e melhorar campanhas de publicidade.
          Só ativamos o tracking após o seu consentimento.
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-[#0b5d3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#094a2f]"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
