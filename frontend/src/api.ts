import { http, authHeaders, toForm } from './http';

export type Task = {
  id: string;
  title: string;
  done: boolean;
  created_at: string;
};

export type TogglePayload = {
  task: { id: string; done: boolean };
  totalXP: number;
  level: number;
};

export type XpSummary = {
  totalXP: number;
  level: number;
  progress: number;
  goal: number;
  pct: number;
};

export async function listTasks(characterId: string): Promise<Task[]> {
  const r = await http.get<Task[]>(`/api/characters/${characterId}/tasks`, {
    headers: authHeaders(),
  });
  return r.data;
}

export async function createTask(characterId: string, title: string): Promise<Task> {
  const r = await http.post<Task>(
    `/api/characters/${characterId}/tasks`,
    toForm({ title }),
    { headers: authHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) }
  );
  return r.data;
}

export async function toggleTask(taskId: string): Promise<TogglePayload> {
  const r = await http.patch<TogglePayload>(
    `/api/tasks/${taskId}/toggle`,
    toForm({}), // пустая форма
    { headers: authHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) }
  );
  return r.data;
}

export async function deleteTask(taskId: string): Promise<void> {
  await http.delete(`/api/tasks/${taskId}`, { headers: authHeaders() });
}

export async function getXp(characterId: string): Promise<XpSummary> {
  const r = await http.get<XpSummary>(`/api/characters/${characterId}/xp`, {
    headers: authHeaders(),
  });
  return r.data;
}