// src/CharacterTasks.tsx
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { characters } from './characters';
import { themeByImage } from './theme';

type Priority = 'low' | 'medium' | 'high';
type Task = {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  startAt?: number | null;
  endAt?: number | null;
  doneAt?: number | null;
};

const tasksKey = (id: string) => `lvlup_tasks_${id}`;
const completedTasksKey = (id: string) => `lvlup_completed_tasks_${id}`; // Новый ключ для выполненных задач
const xpKey    = (id: string) => `lvlup_xp_${id}`;

const PRIORITY_XP: Record<Priority, number> = {
  low: 5,
  medium: 10,
  high: 20,
};

const genId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

function dateInputToTs(v: string): number | null {
  const s = v?.trim();
  if (!s) return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [, yyyy, mm, dd] = m;
  const d = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd), 0, 0, 0, 0));
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

function tsToDateInput(ts?: number | null): string {
  if (!ts) return '';
  const d = new Date(ts);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateLabel(ts?: number | null): string {
  if (!ts) return '—';
  const d = new Date(ts);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function normalizeRange(startAt: number | null, endAt: number | null) {
  if (startAt != null && endAt != null && endAt < startAt) {
    return { startAt: endAt, endAt: startAt };
  }
  return { startAt, endAt };
}

function loadTasks(charId: string): Task[] {
  try {
    const raw = localStorage.getItem(tasksKey(charId));
    const parsed = raw ? (JSON.parse(raw) as any[]) : [];
    return parsed.map((t) => ({
      id: String(t.id ?? genId()),
      title: String(t.title ?? ''),
      done: Boolean(t.done),
      priority: (t.priority ?? 'medium') as Priority,
      startAt: typeof t.startAt === 'number' ? t.startAt : null,
      endAt: typeof t.endAt === 'number' ? t.endAt : typeof t.dueAt === 'number' ? t.dueAt : null,
      doneAt: typeof t.doneAt === 'number' ? t.doneAt : null,
    })) as Task[];
  } catch {
    return [];
  }
}

// Функция для загрузки выполненных задач (для статистики)
function loadCompletedTasks(charId: string): Task[] {
  try {
    const raw = localStorage.getItem(completedTasksKey(charId));
    const parsed = raw ? (JSON.parse(raw) as any[]) : [];
    return parsed.map((t) => ({
      id: String(t.id ?? genId()),
      title: String(t.title ?? ''),
      done: true,
      priority: (t.priority ?? 'medium') as Priority,
      startAt: typeof t.startAt === 'number' ? t.startAt : null,
      endAt: typeof t.endAt === 'number' ? t.endAt : typeof t.dueAt === 'number' ? t.dueAt : null,
      doneAt: typeof t.doneAt === 'number' ? t.doneAt : Date.now(),
    })) as Task[];
  } catch {
    return [];
  }
}

// Функция для сохранения выполненных задач
function saveCompletedTasks(charId: string, tasks: Task[]) {
  localStorage.setItem(completedTasksKey(charId), JSON.stringify(tasks));
}

function saveTasks(charId: string, tasks: Task[]) {
  localStorage.setItem(tasksKey(charId), JSON.stringify(tasks));
}

function loadXp(charId: string): number {
  const raw = localStorage.getItem(xpKey(charId));
  const v = Number(raw);
  return Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
}

function saveXp(charId: string, xp: number) {
  localStorage.setItem(xpKey(charId), String(Math.max(0, Math.floor(xp))));
}

export default function CharacterTasks() {
  const { id } = useParams();
  const c = characters.find((x) => x.id === id);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!c) return;
    setLoading(true);
    setTasks(loadTasks(c.id));
    setXp(loadXp(c.id));
    setLoading(false);
  }, [c?.id]);

  const t = useMemo(
    () => (c ? themeByImage[c.image] : themeByImage['programmer']),
    [c]
  );

  // Стили для приоритетов с градиентами
  const priorityStyles: Record<Priority, { 
    badge: string; 
    gradient: string;
    shadow: string;
  }> = {
    low: {
      badge: "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
      gradient: "linear-gradient(135deg, #60a5fa, #3b82f6)",
      shadow: "0 4px 14px rgba(59, 130, 246, 0.3)"
    },
    medium: {
      badge: "bg-gradient-to-br from-amber-400 to-amber-600 text-white",
      gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
      shadow: "0 4px 14px rgba(245, 158, 11, 0.3)"
    },
    high: {
      badge: "bg-gradient-to-br from-rose-500 to-rose-700 text-white",
      gradient: "linear-gradient(135deg, #f43f5e, #e11d48)",
      shadow: "0 4px 14px rgba(225, 29, 72, 0.3)"
    }
  };

  const priorityLabel: Record<Priority, string> = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
  };

  if (!c) {
    return (
      <div className="min-h-screen px-4 py-5 grid place-items-center">
        <div className="w-full max-w-[360px]">
          <Link to="/choiceperson" className="text-black underline">Назад</Link>
          <div className="mt-4 text-black">Персонаж не найден</div>
        </div>
      </div>
    );
  }

  const pushTasks = (next: Task[]) => {
    setTasks(next);
    saveTasks(c.id, next);
  };

  const applyXpDelta = (delta: number) => {
    const next = Math.max(0, (xp ?? 0) + delta);
    setXp(next);
    saveXp(c.id, next);
  };

  const addTask = () => {
    const name = title.trim();
    if (!name) return;

    let startAt = dateInputToTs(startStr);
    let endAt = dateInputToTs(endStr);
    ({ startAt, endAt } = normalizeRange(startAt, endAt));

    const newTask: Task = {
      id: genId(),
      title: name,
      done: false,
      priority,
      startAt,
      endAt,
      doneAt: null,
    };
    pushTasks([newTask, ...tasks]);

    setTitle('');
    setPriority('medium');
    setStartStr('');
    setEndStr('');
  };

  const toggleTask = (task: Task) => {
    const willBeDone = !task.done;
    const reward = PRIORITY_XP[task.priority] ?? 0;
    const delta = willBeDone ? reward : -reward;

    const next = tasks.map((t) => 
      t.id === task.id ? { 
        ...t, 
        done: willBeDone,
        doneAt: willBeDone ? Date.now() : null
      } : t
    );
    pushTasks(next);
    applyXpDelta(delta);
  };

  const removeTask = (idToRemove: string) => {
    const taskToRemove = tasks.find(t => t.id === idToRemove);
    
    if (taskToRemove) {
      // Если задача была выполнена, сохраняем ее в архив выполненных задач
      if (taskToRemove.done) {
        const completedTasks = loadCompletedTasks(c.id);
        // Проверяем, нет ли уже такой задачи в архиве
        if (!completedTasks.some(t => t.id === idToRemove)) {
          completedTasks.push(taskToRemove);
          saveCompletedTasks(c.id, completedTasks);
        }
      }
      
      // Удаляем задачу из активных
      pushTasks(tasks.filter((t) => t.id !== idToRemove));
    }
  };

  const updatePriority = (taskId: string, p: Priority) => {
    const task = tasks.find(t => t.id === taskId);
    
    // Если задача выполнена и меняется приоритет, корректируем XP
    if (task && task.done) {
      const oldReward = PRIORITY_XP[task.priority] ?? 0;
      const newReward = PRIORITY_XP[p] ?? 0;
      const delta = newReward - oldReward;
      
      if (delta !== 0) {
        applyXpDelta(delta);
      }
    }
    
    pushTasks(tasks.map((t) => (t.id === taskId ? { ...t, priority: p } : t)));
  };

  const updateStart = (taskId: string, value: string) => {
    const ts = dateInputToTs(value);
    pushTasks(
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const { startAt, endAt } = normalizeRange(ts, t.endAt ?? null);
        return { ...t, startAt, endAt };
      })
    );
  };

  const updateEnd = (taskId: string, value: string) => {
    const ts = dateInputToTs(value);
    pushTasks(
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const { startAt, endAt } = normalizeRange(t.startAt ?? null, ts);
        return { ...t, startAt, endAt };
      })
    );
  };

  const remaining = tasks.filter((t) => !t.done).length;
  const completed = tasks.filter((t) => t.done).length;

  return (
    <div className="min-h-screen px-4 py-5 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-[400px] mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between p-4 rounded-2xl bg-white/80 backdrop-blur shadow-lg">
          <Link
            to={`/character/${c.id}`}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              ←
            </div>
            <span>Назад</span>
          </Link>
          <div className="text-right">
            <div className="text-xs text-gray-500">Активных: {remaining}</div>
            <div className="text-xs text-gray-500">Выполнено: {completed}</div>
            <div className="text-lg font-bold text-gray-800">{xp} XP</div>
          </div>
        </div>

        {/* Add Task Card */}
        <div className="rounded-2xl p-6 mb-6 shadow-xl bg-white/90 backdrop-blur border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <h2 className="text-lg font-bold text-gray-800">Новая задача</h2>
          </div>
          
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Что нужно сделать?..."
            className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 text-[15px] mb-4"
          />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Начало</label>
              <input
                type="date"
                value={startStr}
                onChange={(e) => setStartStr(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-blue-300 text-[13px] text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Окончание</label>
              <input
                type="date"
                value={endStr}
                onChange={(e) => setEndStr(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-blue-300 text-[13px] text-gray-800"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Важность</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 h-10 rounded-lg font-medium text-sm transition-all ${
                    priority === p 
                      ? priorityStyles[p].badge + ' shadow-lg transform scale-105' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={priority === p ? {
                    boxShadow: priorityStyles[p].shadow
                  } : {}}
                >
                  {priorityLabel[p]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={addTask}
            disabled={!title.trim()}
            className="w-full h-12 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`,
              boxShadow: `0 8px 25px ${t.btnFrom}40`,
            }}
          >
            Добавить задачу
          </button>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
            <div className="text-gray-500 text-sm">Задач пока нет</div>
            <div className="text-gray-400 text-xs mt-1">Добавьте первую задачу</div>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-2xl p-4 backdrop-blur border transition-all ${
                task.done 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200' 
                  : 'bg-white/90 border-white/20 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTask(task)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${
                    task.done
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {task.done && '✓'}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[15px] leading-tight font-medium ${
                      task.done ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        priorityStyles[task.priority].badge
                      }`}
                      style={{
                        boxShadow: priorityStyles[task.priority].shadow
                      }}
                    >
                      {priorityLabel[task.priority]} +{PRIORITY_XP[task.priority]}XP
                    </span>

                    {task.startAt && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        🗓️ {formatDateLabel(task.startAt)}
                      </span>
                    )}
                    {task.endAt && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        ⏰ {formatDateLabel(task.endAt)}
                      </span>
                    )}
                    {task.done && task.doneAt && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        ✅ {formatDateLabel(task.doneAt)}
                      </span>
                    )}
                  </div>

                  {/* Редакторы */}
                  <div className="mt-4 p-3 rounded-xl bg-gray-50/80 border border-gray-200">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Важность</label>
                        <select
                          value={task.priority}
                          onChange={(e) => updatePriority(task.id, e.target.value as Priority)}
                          className="w-full h-9 px-3 rounded-lg bg-white border border-gray-300 outline-none focus:border-blue-400 text-[13px] text-gray-800"
                        >
                          <option value="low">Низкая</option>
                          <option value="medium">Средняя</option>
                          <option value="high">Высокая</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Начало</label>
                          <input
                            type="date"
                            value={tsToDateInput(task.startAt)}
                            onChange={(e) => updateStart(task.id, e.target.value)}
                            className="w-full h-8 px-2 rounded-lg bg-white border border-gray-300 outline-none focus:border-blue-400 text-[12px] text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Окончание</label>
                          <input
                            type="date"
                            value={tsToDateInput(task.endAt)}
                            onChange={(e) => updateEnd(task.id, e.target.value)}
                            className="w-full h-8 px-2 rounded-lg bg-white border border-gray-300 outline-none focus:border-blue-400 text-[12px] text-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeTask(task.id)}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all"
                  title="Удалить"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}