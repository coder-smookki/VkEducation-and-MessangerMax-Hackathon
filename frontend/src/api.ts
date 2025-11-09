// src/api.ts
import { authHeaders } from './auth.ts';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export type Task = { id: string; title: string; done: boolean; created_at: string };
export type XpSummary = { totalXP: number; level: number; progress: number; goal: number; pct: number };

async function j<T>(r: Response): Promise<T> {
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`HTTP ${r.status}: ${txt || r.statusText}`);
  }
  return r.json();
}

export async function listTasks(characterId: string) {
  const r = await fetch(`${API}/api/characters/${characterId}/tasks`, { headers: authHeaders() });
  return j<Task[]>(r);
}
export async function createTask(characterId: string, title: string) {
  const r = await fetch(`${API}/api/characters/${characterId}/tasks`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify({ title })
  });
  return j<Task>(r);
}
export async function toggleTask(taskId: string) {
  const r = await fetch(`${API}/api/tasks/${taskId}/toggle`, { method: 'PATCH', headers: authHeaders() });
  return j<{ task:{id:string;done:boolean}; totalXP:number; level:number }>(r);
}
export async function deleteTask(taskId: string) {
  const r = await fetch(`${API}/api/tasks/${taskId}`, { method: 'DELETE', headers: authHeaders() });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}
export async function getXp(characterId: string) {
  const r = await fetch(`${API}/api/characters/${characterId}/xp`, { headers: authHeaders() });
  return j<XpSummary>(r);
}