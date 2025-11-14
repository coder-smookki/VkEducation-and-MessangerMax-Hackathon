// src/http.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// =====================
// SDK: user_id
// =====================
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

// =====================
// Типы
// =====================
export type Goal = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueAt?: number | null;
  xp?: number | null;
};

export type GoalsAndTasks = {
  goals: Goal[];
  tasks: Task[];
};

// =====================
// Хелпер: отправить JSON как файл (multipart)
// =====================
async function postJsonFile(
  endpoint: string,
  data: unknown,
  filename: string,
  extraFields?: Record<string, string>
) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, filename);

  if (extraFields) {
    for (const [k, v] of Object.entries(extraFields)) {
      form.append(k, v);
    }
  }

  const res = await api.post(endpoint, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// =====================
// Start Game → JSON-файл
// =====================
export const startGame = async (userId?: string) => {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден (WebApp.initData/initDataUnsafe пуст)');

  const payload = { user_id: uid, ts: Date.now() };
  const filename = `start_game_${uid}_${Date.now()}.json`;
  return postJsonFile('/api/start-game', payload, filename, { user_id: uid });
};

// =====================
// Glow (свечение) → сохранить/получить
// =====================
export async function saveGlow(
  characterId: string,
  haloFrom: string,
  haloTo: string,
  userId?: string
) {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');
  const payload = { haloFrom, haloTo, character_id: characterId, user_id: uid, ts: Date.now() };
  const filename = `glow_${uid}_${characterId}_${Date.now()}.json`;
  return postJsonFile('/api/save-glow', payload, filename, {
    user_id: uid,
    character_id: characterId,
  });
}

export async function fetchGlow(
  characterId: string,
  userId?: string
): Promise<{ haloFrom: string; haloTo: string } | null> {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');

  try {
    const res = await api.get('/api/get-glow', { params: { user_id: uid, character_id: characterId } });
    if (res?.data?.haloFrom && res?.data?.haloTo) {
      return { haloFrom: res.data.haloFrom, haloTo: res.data.haloTo };
    }
  } catch {}
  return null;
}

// =====================
// Goals & Tasks → файл / чтение
// =====================
export async function uploadGoalsAndTasksFile(
  characterId: string,
  data: GoalsAndTasks,
  userId?: string
) {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');
  const filename = `goals_tasks_${uid}_${characterId}_${Date.now()}.json`;
  return postJsonFile('/api/upload-goals-tasks', data, filename, {
    user_id: uid,
    character_id: characterId,
  });
}

export async function fetchGoalsAndTasks(
  characterId: string,
  userId?: string
): Promise<GoalsAndTasks> {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');
  try {
    const res = await api.get('/api/get-goals-tasks', { params: { user_id: uid, character_id: characterId } });
    return {
      goals: Array.isArray(res?.data?.goals) ? res.data.goals : [],
      tasks: Array.isArray(res?.data?.tasks) ? res.data.tasks : [],
    };
  } catch {
    return { goals: [], tasks: [] };
  }
}

// =====================
// XP / Progress → файл / чтение
// =====================
export async function fetchProgress(
  characterId: string,
  userId?: string
): Promise<{ xp: number }> {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');
  try {
    const res = await api.get('/api/get-progress', { params: { user_id: uid, character_id: characterId } });
    return { xp: Number(res?.data?.xp ?? 0) };
  } catch {
    return { xp: 0 };
  }
}
export async function uploadProgressFile(
  characterId: string,
  data: { xp?: number; delta?: number },
  userId?: string
) {
  const uid = userId ?? getUserIdFromMAX();
  if (!uid) throw new Error('user_id не найден');
  const filename = `progress_${uid}_${characterId}_${Date.now()}.json`;
  return postJsonFile('/api/set-progress', { ...data, character_id: characterId, user_id: uid, ts: Date.now() }, filename, {
    user_id: uid,
    character_id: characterId,
  });
}

export default api;