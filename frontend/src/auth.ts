import { http, toForm } from './http';

export type VerifyRes = {
  ok: boolean;
  user_id: string;
  profile: Record<string, unknown>;
  auth_date: number;
};

function readInitData(): string {
  const w = window as any;
  if (w?.WebApp?.InitData) return String(w.WebApp.InitData);
  const q = new URLSearchParams(location.search).get('init_data');
  return q ?? '';
}

// Отправляем init_data как x-www-form-urlencoded, получаем JSON с user_id
export async function initAuthFromWebApp(): Promise<string | null> {
  const init_data = readInitData();
  if (!init_data) return null;

  const res = await http.post<VerifyRes>(
    '/api/auth/verify',
    toForm({ init_data }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  const data = res.data;
  if (data?.ok && data.user_id) {
    localStorage.setItem('auth_user_id', data.user_id);
    return data.user_id;
  }
  return null;
}