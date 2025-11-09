// src/auth.ts
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export type VerifyRes = { ok: boolean; user_id: string; profile: any; auth_date: number };

function readInitData(): string {
  // MAX кладёт в window.WebApp.InitData; оставляем и fallback через ?init_data=...
  const w = window as any;
  if (w?.WebApp?.InitData) return w.WebApp.InitData as string;
  const fromQuery = new URLSearchParams(location.search).get('init_data');
  return fromQuery || '';
}

export async function initAuthFromWebApp(): Promise<string | null> {
  const init_data = readInitData();
  if (!init_data) return null;

  const r = await fetch(`${API}/api/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ init_data })
  });
  if (!r.ok) throw new Error('InitData verify failed');
  const data: VerifyRes = await r.json();
  if (data?.ok && data.user_id) {
    localStorage.setItem('auth_user_id', data.user_id);
    return data.user_id;
  }
  return null;
}

export function getUserId(): string {
  return localStorage.getItem('auth_user_id') || '';
}

export function authHeaders(): Record<string,string> {
  const uid = getUserId();
  return uid ? { 'Content-Type': 'application/json', 'X-User-Id': uid } : { 'Content-Type': 'application/json' };
}