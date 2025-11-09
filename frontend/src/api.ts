// src/api.ts
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const USER_ID = import.meta.env.VITE_USER_ID ?? '00000000-0000-0000-0000-000000000001';

const jsonHeaders = {
  'Content-Type': 'application/json',
  'X-User-Id': USER_ID,
};

export type Task = { id: string; title: string; done: boolean; created_at: string };
export type XpSummary = { totalXP: number; level: number; progress: number; goal: number; pct: number };

export async function listTasks(characterId: string): Promise<Task[]> {
  const r = await fetch(`${API}/api/characters/${characterId}/tasks`, { headers: jsonHeaders });
  if (!r.ok) throw new Error('tasks list failed');
  return r.json();
}

export async function createTask(characterId: string, title: string): Promise<Task> {
  const r = await fetch(`${API}/api/characters/${characterId}/tasks`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ title }),
  });
  if (!r.ok) throw new Error('task create failed');
  return r.json();
}

export async function toggleTask(taskId: string): Promise<{ task:{id:string;done:boolean}; totalXP:number; level:number }> {
  const r = await fetch(`${API}/api/tasks/${taskId}/toggle`, { method: 'PATCH', headers: jsonHeaders });
  if (!r.ok) throw new Error('task toggle failed');
  return r.json();
}

export async function deleteTask(taskId: string): Promise<void> {
  const r = await fetch(`${API}/api/tasks/${taskId}`, { method: 'DELETE', headers: jsonHeaders });
  if (!r.ok) throw new Error('task delete failed');
}

export async function getXp(characterId: string): Promise<XpSummary> {
  const r = await fetch(`${API}/api/characters/${characterId}/xp`, { headers: jsonHeaders });
  if (!r.ok) throw new Error('xp fetch failed');
  return r.json();
}