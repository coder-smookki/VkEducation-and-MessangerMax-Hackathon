// src/http.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
  headers: { 'Content-Type': 'application/json' },
});

function readInitDataString(): string {
  const wa: any = (window as any)?.WebApp;
  if (wa && typeof wa.initData === 'string' && wa.initData.length) return wa.initData;
  const q = new URLSearchParams(location.search).get('init_data');
  return q ?? '';
}

export function getUserIdFromMAX(): string | null {
  const wa: any = (window as any)?.WebApp;

 
  const idUnsafe = wa?.initDataUnsafe?.user?.id;
  if (idUnsafe != null) return String(idUnsafe);

  const initData = readInitDataString();
  if (!initData) return null;

  const params = new URLSearchParams(initData);
  const userParam = params.get('user');
  if (!userParam) return null;

  const m = /"id"\s*:\s*(\d+)/.exec(userParam);
  if (m) return m[1];

 
  try {
    const obj = JSON.parse(userParam);
    return obj?.id != null ? String(obj.id) : null;
  } catch {
    return null;
  }
}

export const startGame = async (userId?: string) => {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден (WebApp.initData/initDataUnsafe пуст)');

  const response = await api.post('/api/start-game', { user_id: uid });
  return response.data;
};

export default api;