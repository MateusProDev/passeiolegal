import { NextRequest } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';
import { ensureHeaders } from '@/lib/sheets/sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      return Response.json({ error: 'Token ausente' }, { status: 401 });
    }

    const auth = getAdminAuth();
    if (!auth) {
      return Response.json({ error: 'Firebase Admin Auth indisponível' }, { status: 500 });
    }

    const decoded = await auth.verifyIdToken(token);
    const email = (decoded.email || '').toLowerCase();

    if (!ADMIN_EMAILS.includes(email)) {
      return Response.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await ensureHeaders();
    return Response.json({ ok: true });
  } catch (error) {
    console.error('[api/admin/sync-sheets] error:', error);
    return Response.json({ error: 'Erro ao sincronizar planilha' }, { status: 500 });
  }
}
