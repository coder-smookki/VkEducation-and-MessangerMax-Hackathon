// src/CharacterGoals.tsx
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { characters } from './characters';
import { themeByImage } from './theme';

type Priority = 'low' | 'medium' | 'high';
type GoalItem = {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  startAt?: number | null;
  endAt?: number | null;
  doneAt?: number | null;
  createdAt?: number;
};

const goalsKey = (id: string) => `lvlup_goals_${id}`;
const completedGoalsKey = (id: string) => `lvlup_completed_goals_${id}`;
const xpKey    = (id: string) => `lvlup_xp_${id}`;

const genId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

/* ====== XP награды по приоритету ====== */
const XP_BY_PRIORITY: Record<Priority, number> = {
  low: 10,
  medium: 25,
  high: 50,
};

/* ====== helpers: даты ====== */
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

/* ====== helpers: localStorage ====== */
function loadGoals(charId: string): GoalItem[] {
  try {
    const raw = localStorage.getItem(goalsKey(charId));
    const parsed = raw ? (JSON.parse(raw) as any[]) : [];
    return parsed.map(g => ({
      id: String(g.id ?? genId()),
      title: String(g.title ?? ''),
      done: Boolean(g.done),
      priority: (g.priority ?? 'medium') as Priority,
      startAt: typeof g.startAt === 'number' ? g.startAt : null,
      endAt: typeof g.endAt === 'number' ? g.endAt : (typeof g.dueAt === 'number' ? g.dueAt : null),
      doneAt: typeof g.doneAt === 'number' ? g.doneAt : null,
      createdAt: typeof g.createdAt === 'number' ? g.createdAt : Date.now(),
    })) as GoalItem[];
  } catch {
    return [];
  }
}

// Функция для загрузки выполненных целей (для статистики)
function loadCompletedGoals(charId: string): GoalItem[] {
  try {
    const raw = localStorage.getItem(completedGoalsKey(charId));
    const parsed = raw ? (JSON.parse(raw) as any[]) : [];
    return parsed.map((g) => ({
      id: String(g.id ?? genId()),
      title: String(g.title ?? ''),
      done: true,
      priority: (g.priority ?? 'medium') as Priority,
      startAt: typeof g.startAt === 'number' ? g.startAt : null,
      endAt: typeof g.endAt === 'number' ? g.endAt : (typeof g.dueAt === 'number' ? g.dueAt : null),
      doneAt: typeof g.doneAt === 'number' ? g.doneAt : Date.now(),
      createdAt: typeof g.createdAt === 'number' ? g.createdAt : Date.now(),
    })) as GoalItem[];
  } catch {
    return [];
  }
}

// Функция для сохранения выполненных целей
function saveCompletedGoals(charId: string, goals: GoalItem[]) {
  localStorage.setItem(completedGoalsKey(charId), JSON.stringify(goals));
}

function saveGoals(charId: string, items: GoalItem[]) {
  localStorage.setItem(goalsKey(charId), JSON.stringify(items));
}

function loadXp(charId: string): number {
  const raw = localStorage.getItem(xpKey(charId));
  const num = raw ? Number(raw) : 0;
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

function saveXp(charId: string, xp: number) {
  localStorage.setItem(xpKey(charId), String(Math.max(0, Math.floor(xp))));
}

export default function CharacterGoals() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  const [items, setItems] = useState<GoalItem[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [loading, setLoading] = useState(true);

  // Инициализация из localStorage
  useEffect(() => {
    if (!c) return;
    setLoading(true);
    const g = loadGoals(c.id);
    const x = loadXp(c.id);
    setItems(g);
    setXp(x);
    setLoading(false);
  }, [c?.id]);

  // Тема
  const t = useMemo(() => (c ? themeByImage[c.image] : null), [c]);

  // Стили для приоритетов с градиентами
  const priorityStyles: Record<Priority, { 
    badge: string; 
    gradient: string;
    shadow: string;
    lightBg: string;
  }> = {
    low: {
      badge: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      shadow: "0 4px 14px rgba(5, 150, 105, 0.3)",
      lightBg: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    medium: {
      badge: "bg-gradient-to-br from-violet-500 to-violet-700 text-white",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      shadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
      lightBg: "bg-violet-50 text-violet-700 border-violet-200"
    },
    high: {
      badge: "bg-gradient-to-br from-amber-500 to-amber-700 text-white",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      shadow: "0 4px 14px rgba(217, 119, 6, 0.3)",
      lightBg: "bg-amber-50 text-amber-700 border-amber-200"
    }
  };

  const priorityLabel: Record<Priority, string> = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
  };

  if (!c || !t) {
    return (
      <div className="min-h-[100svh] px-4 py-5 grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-[400px] text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Цель не найдена</h1>
          <p className="text-gray-600 mb-6">Такого персонажа не существует</p>
          <Link 
            to="/choiceperson" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            ← Выбрать персонажа
          </Link>
        </div>
      </div>
    );
  }

  const remaining = items.filter(g => !g.done).length;
  const completed = items.filter(g => g.done).length;

  /* ---------- синхронизация в LS ---------- */
  const pushGoals = (next: GoalItem[]) => {
    setItems(next);
    saveGoals(c.id, next);
  };

  const applyXpDelta = (delta: number) => {
    const next = Math.max(0, Math.floor((xp ?? 0) + delta));
    setXp(next);
    saveXp(c.id, next);
  };

  /* ---------- действия ---------- */
  const add = () => {
    const v = title.trim();
    if (!v) return;

    let startAt = dateInputToTs(startStr);
    let endAt = dateInputToTs(endStr);
    ({ startAt, endAt } = normalizeRange(startAt, endAt));

    const next: GoalItem[] = [
      {
        id: genId(),
        title: v,
        done: false,
        priority,
        startAt,
        endAt,
        createdAt: Date.now(),
        doneAt: null,
      },
      ...items,
    ];
    setTitle('');
    setPriority('medium');
    setStartStr('');
    setEndStr('');
    pushGoals(next);
  };

  const toggle = (gid: string) => {
    const g = items.find(x => x.id === gid);
    if (!g) return;

    const willBeDone = !g.done;
    const reward = XP_BY_PRIORITY[g.priority];
    const delta = willBeDone ? reward : -reward;

    const next = items.map(x => 
      x.id === gid ? { 
        ...x, 
        done: willBeDone,
        doneAt: willBeDone ? Date.now() : null
      } : x
    );
    pushGoals(next);
    applyXpDelta(delta);
  };

  const remove = (gid: string) => {
    const goalToRemove = items.find(g => g.id === gid);
    
    if (goalToRemove) {
      // Если цель была выполнена, сохраняем ее в архив выполненных целей
      if (goalToRemove.done) {
        const completedGoals = loadCompletedGoals(c.id);
        // Проверяем, нет ли уже такой цели в архиве
        if (!completedGoals.some(g => g.id === gid)) {
          completedGoals.push(goalToRemove);
          saveCompletedGoals(c.id, completedGoals);
        }
      }
      
      // Удаляем цель из активных
      pushGoals(items.filter(g => g.id !== gid));
    }
  };

  const updatePriority = (gid: string, p: Priority) => {
    const goal = items.find(g => g.id === gid);
    
    // Если цель выполнена и меняется приоритет, корректируем XP
    if (goal && goal.done) {
      const oldReward = XP_BY_PRIORITY[goal.priority] ?? 0;
      const newReward = XP_BY_PRIORITY[p] ?? 0;
      const delta = newReward - oldReward;
      
      if (delta !== 0) {
        applyXpDelta(delta);
      }
    }
    
    pushGoals(items.map(g => (g.id === gid ? { ...g, priority: p } : g)));
  };

  const updateStart = (gid: string, dateStr: string) => {
    const next = items.map(g => {
      if (g.id !== gid) return g;
      const ts = dateInputToTs(dateStr);
      const { startAt, endAt } = normalizeRange(ts, g.endAt ?? null);
      return { ...g, startAt, endAt };
    });
    pushGoals(next);
  };

  const updateEnd = (gid: string, dateStr: string) => {
    const next = items.map(g => {
      if (g.id !== gid) return g;
      const ts = dateInputToTs(dateStr);
      const { startAt, endAt } = normalizeRange(g.startAt ?? null, ts);
      return { ...g, startAt, endAt };
    });
    pushGoals(next);
  };

  return (
    <div className="min-h-[100svh] px-4 py-5 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-[400px] mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between p-4 rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/20">
          <Link
            to={`/character/${c.id}`}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs">
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

        {/* Add Goal Card */}
        <div className="rounded-2xl p-6 mb-6 shadow-xl bg-white/90 backdrop-blur border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
              🎯
            </div>
            <h2 className="text-lg font-bold text-gray-800">Новая цель</h2>
          </div>
          
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
            placeholder="К чему вы стремитесь?..."
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
              <label className="block text-xs font-medium text-gray-600 mb-1">Дедлайн</label>
              <input
                type="date"
                value={endStr}
                onChange={(e) => setEndStr(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-blue-300 text-[13px] text-gray-800"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Важность цели</label>
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
            <div className="mt-2 text-xs text-gray-500 text-center">
              +{XP_BY_PRIORITY[priority]} XP за выполнение
            </div>
          </div>

          <button
            onClick={add}
            disabled={!title.trim()}
            className="w-full h-12 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`,
              boxShadow: `0 8px 25px ${t.btnFrom}40`,
            }}
          >
            Поставить цель
          </button>
        </div>

        {/* Goals List */}
        {items.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
            <div className="text-gray-500 text-sm">Целей пока нет</div>
            <div className="text-gray-400 text-xs mt-1">Поставьте первую цель для своего персонажа</div>
          </div>
        )}

        <div className="space-y-4">
          {items.map(g => (
            <div
              key={g.id}
              className={`rounded-2xl p-4 backdrop-blur border transition-all ${
                g.done 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200' 
                  : 'bg-white/90 border-white/20 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggle(g.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${
                    g.done
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {g.done && '✓'}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[15px] leading-tight font-medium ${
                      g.done ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {g.title}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        priorityStyles[g.priority].badge
                      }`}
                      style={{
                        boxShadow: priorityStyles[g.priority].shadow
                      }}
                    >
                      {priorityLabel[g.priority]} +{XP_BY_PRIORITY[g.priority]}XP
                    </span>

                    {g.startAt && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        🗓️ {formatDateLabel(g.startAt)}
                      </span>
                    )}
                    {g.endAt && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        ⏰ {formatDateLabel(g.endAt)}
                      </span>
                    )}
                    {g.done && g.doneAt && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        ✅ {formatDateLabel(g.doneAt)}
                      </span>
                    )}
                  </div>

                  {/* Редакторы */}
                  <div className="mt-4 p-3 rounded-xl bg-gray-50/80 border border-gray-200">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Важность цели</label>
                        <select
                          value={g.priority}
                          onChange={(e) => updatePriority(g.id, e.target.value as Priority)}
                          className="w-full h-9 px-3 rounded-lg bg-white border border-gray-300 outline-none focus:border-blue-400 text-[13px] text-gray-800"
                        >
                          <option value="low">Низкая (+{XP_BY_PRIORITY.low} XP)</option>
                          <option value="medium">Средняя (+{XP_BY_PRIORITY.medium} XP)</option>
                          <option value="high">Высокая (+{XP_BY_PRIORITY.high} XP)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Начало</label>
                          <input
                            type="date"
                            value={tsToDateInput(g.startAt)}
                            onChange={(e) => updateStart(g.id, e.target.value)}
                            className="w-full h-8 px-2 rounded-lg bg-white border border-gray-300 outline-none focus:border-blue-400 text-[12px] text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Дедлайн</label>
                          <input
                            type="date"
                            value={tsToDateInput(g.endAt)}
                            onChange={(e) => updateEnd(g.id, e.target.value)}
                            className="w-full h-8 px-2 rounded-lg bg-white border border-gray-300 outline-none focus:border-blue-400 text-[12px] text-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => remove(g.id)}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all"
                  title="Удалить цель"
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