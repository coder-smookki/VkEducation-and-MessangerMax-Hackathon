// src/http.ts
import axios from 'axios';

/* ---------------------------------------------------------
 *  Axios-клиент: базовый URL УЖЕ с /api
 * --------------------------------------------------------- */
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

/* ---------------------------------------------------------
 *  Telegram WebApp: получить user_id
 *  (возвращает string | undefined — это важное изменение)
 * --------------------------------------------------------- */
function readInitDataString(): string {
  const wa: any = (window as any).WebApp;
  if (wa?.initData) return wa.initData as string;
  return new URLSearchParams(location.search).get('init_data') ?? '';
}

export function getUserIdFromMAX(): string | undefined {
  const wa: any = (window as any).WebApp;

  // 1) простой путь
  const idUnsafe = wa?.initDataUnsafe?.user?.id;
  if (idUnsafe != null) return String(idUnsafe);

  // 2) парсим initData
  const raw = readInitDataString();
  if (!raw) return undefined;

  const userStr = new URLSearchParams(raw).get('user');
  if (!userStr) return undefined;

  const m = /"id"\s*:\s*(\d+)/.exec(userStr);
  if (m) return m[1];

  try {
    const obj = JSON.parse(userStr);
    return obj?.id != null ? String(obj.id) : undefined;
  } catch {
    return undefined;
  }
}

/* ---------------------------------------------------------
 *  Типы
 * --------------------------------------------------------- */
export type Goal  = { id: string; title: string; done: boolean; createdAt: number };
export type Task  = { id: string; title: string; completed: boolean; dueAt?: number; xp?: number };
export type GoalsAndTasks = { goals: Goal[]; tasks: Task[] };

/* ---------------------------------------------------------
 *  helper: отправить объект как JSON-файл (multipart/form-data)
 * --------------------------------------------------------- */
async function postJsonFile(
  url: string,
  data: unknown,
  filename: string,
  extraFields?: Record<string, string>
) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, filename);
  if (extraFields) {
    for (const [k, v] of Object.entries(extraFields)) form.append(k, v);
  }
  const { data: resp } = await api.post(url, form);
  return resp;
}

/* =========================================================
 *  1. Старт игры — бек ждёт application/x-www-form-urlencoded
 * ========================================================= */
export async function startGame(userId?: string) {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');

  const body = new URLSearchParams({ user_id: uid });
  const { data } = await api.post('/start-game', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data as { success: boolean; message: string; user_id: string };
}

/* =========================================================
 *  2. Свечение (Glow)
 * ========================================================= */
export async function saveGlow(charId: string, haloFrom: string, haloTo: string, userId?: string) {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');

  return postJsonFile(
    '/save-glow',
    { haloFrom, haloTo, ts: Date.now() },
    `glow_${uid}_${charId}.json`,
    { user_id: uid, character_id: charId }
  );
}

export async function fetchGlow(charId: string, userId?: string) {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');

  const { data } = await api.get('/get-glow', {
    params: { user_id: uid, character_id: charId },
  });
  return data as { haloFrom?: string; haloTo?: string };
}

/* =========================================================
 *  3. Цели и задачи
 * ========================================================= */
export async function uploadGoalsAndTasksFile(charId: string, payload: GoalsAndTasks, userId?: string) {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');

  return postJsonFile(
    '/upload-goals-tasks',
    { ...payload, ts: Date.now() },
    `goals_tasks_${uid}_${charId}.json`,
    { user_id: uid, character_id: charId }
  );
}

export async function fetchGoalsAndTasks(charId: string, userId?: string) {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');

  const { data } = await api.get('/get-goals-tasks', {
    params: { user_id: uid, character_id: charId },
  });
  return data as GoalsAndTasks;
}

/* =========================================================
 *  4. XP / Progress
 * ========================================================= */
export async function uploadProgressFile(
  charId: string,
  body: { xp?: number; delta?: number },
  userId?: string
) {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');

  return postJsonFile(
    '/set-progress',
    { ...body, ts: Date.now() },
    `progress_${uid}_${charId}.json`,
    { user_id: uid, character_id: charId }
  );
}

export async function fetchProgress(charId: string, userId?: string) {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');

  const { data } = await api.get('/get-progress', {
    params: { user_id: uid, character_id: charId },
  });
  return data as { xp: number };
}

export default api;