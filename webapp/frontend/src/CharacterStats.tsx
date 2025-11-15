// src/CharacterStats.tsx
import { Link, useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { characters } from './characters';
import { themeByImage } from './theme';

type Priority = 'low' | 'medium' | 'high';

type TaskLS = {
  id: string;
  title: string;
  done?: boolean;
  priority?: Priority;
  startAt?: number | null;
  endAt?: number | null;
  dueAt?: number | null;
  doneAt?: number | null;
};

type GoalLS = {
  id: string;
  title: string;
  done?: boolean;
  priority?: Priority;
  startAt?: number | null;
  endAt?: number | null;
  dueAt?: number | null;
  doneAt?: number | null;
};

type Kind = 'task' | 'goal';

const tasksKey = (id: string) => `lvlup_tasks_${id}`;
const completedTasksKey = (id: string) => `lvlup_completed_tasks_${id}`;
const goalsKey = (id: string) => `lvlup_goals_${id}`;
const completedGoalsKey = (id: string) => `lvlup_completed_goals_${id}`;
const xpKey = (id: string) => `lvlup_xp_${id}`;

function startOfDay(ts: number) { 
  const d = new Date(ts); 
  d.setHours(0, 0, 0, 0); 
  return d.getTime(); 
}

function endOfDay(ts: number) { 
  const d = new Date(ts); 
  d.setHours(23, 59, 59, 999); 
  return d.getTime(); 
}

function fmt(ts: number) {
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

type DoneInfo = { 
  id: string; 
  title: string; 
  date: number; 
  kind: Kind;
  priority: Priority;
  xp: number;
};

// XP значения должны совпадать с другими компонентами
const TASK_XP_BY_PRIORITY: Record<Priority, number> = {
  low: 5,
  medium: 10,
  high: 20,
};

const GOAL_XP_BY_PRIORITY: Record<Priority, number> = {
  low: 10,
  medium: 25,
  high: 50,
};

// Функции для загрузки всех задач (активных и выполненных)
function loadAllTasks(charId: string): TaskLS[] {
  try {
    const rawActive = localStorage.getItem(tasksKey(charId));
    const rawCompleted = localStorage.getItem(completedTasksKey(charId));
    
    const activeTasks: TaskLS[] = rawActive ? JSON.parse(rawActive) : [];
    const completedTasks: TaskLS[] = rawCompleted ? JSON.parse(rawCompleted) : [];
    
    // Фильтруем только выполненные задачи из активных и добавляем архивные
    const doneActiveTasks = activeTasks.filter(task => task.done);
    return [...doneActiveTasks, ...completedTasks];
  } catch {
    return [];
  }
}

function loadAllGoals(charId: string): GoalLS[] {
  try {
    const rawActive = localStorage.getItem(goalsKey(charId));
    const rawCompleted = localStorage.getItem(completedGoalsKey(charId));
    
    const activeGoals: GoalLS[] = rawActive ? JSON.parse(rawActive) : [];
    const completedGoals: GoalLS[] = rawCompleted ? JSON.parse(rawCompleted) : [];
    
    // Фильтруем только выполненные цели из активных и добавляем архивные
    const doneActiveGoals = activeGoals.filter(goal => goal.done);
    return [...doneActiveGoals, ...completedGoals];
  } catch {
    return [];
  }
}

export default function CharacterStats() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);
  const t = useMemo(() => (c ? themeByImage[c.image] : themeByImage['programmer']), [c]);

  const [refresh, setRefresh] = useState(0);

  const forceRefresh = () => setRefresh(prev => prev + 1);

  const doneAll = useMemo<DoneInfo[]>(() => {
    if (!c) return [];
    
    let tList: TaskLS[] = []; 
    let gList: GoalLS[] = [];
    
    try { 
      tList = loadAllTasks(c.id);
    } catch (e) {
      console.error('Error loading tasks:', e);
      tList = [];
    }
    
    try { 
      gList = loadAllGoals(c.id);
    } catch (e) {
      console.error('Error loading goals:', e);
      gList = [];
    }

    const out: DoneInfo[] = [];
    
    const pushItem = (it: TaskLS | GoalLS, kind: Kind) => {
      if (!it?.done) return;
      
      // Приоритет для даты выполнения: doneAt -> endAt -> dueAt -> текущая дата
      const completionDate = 
        (typeof it.doneAt === 'number' && it.doneAt > 0) ? it.doneAt :
        (typeof it.endAt === 'number' && it.endAt > 0) ? it.endAt :
        (typeof it.dueAt === 'number' && it.dueAt > 0) ? it.dueAt :
        Date.now();
      
      const date = startOfDay(completionDate);
      const priority = (it.priority ?? 'medium') as Priority;
      const xp = kind === 'task' ? TASK_XP_BY_PRIORITY[priority] : GOAL_XP_BY_PRIORITY[priority];
      
      out.push({
        id: it.id,
        title: it.title ?? (kind === 'task' ? 'Задача' : 'Цель'),
        date,
        kind,
        priority,
        xp
      });
    };
    
    tList.forEach(it => pushItem(it, 'task'));
    gList.forEach(it => pushItem(it, 'goal'));

    out.sort((a, b) => b.date - a.date);
    return out;
  }, [c, refresh]);

  // Загружаем текущий XP
  const currentXp = useMemo(() => {
    if (!c) return 0;
    try {
      const raw = localStorage.getItem(xpKey(c.id));
      const num = raw ? Number(raw) : 0;
      return Number.isFinite(num) && num >= 0 ? Math.floor(num) : 0;
    } catch {
      return 0;
    }
  }, [c, refresh]);

  // Автообновление статистики
  useEffect(() => {
    const interval = setInterval(() => {
      forceRefresh();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!c) {
    return (
      <div className="min-h-screen px-4 py-5 grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-[400px] text-center">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Статистика не найдена</h1>
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

  const today0 = startOfDay(Date.now());
  const weekFrom = today0 - 6 * 86400000;
  const monthFrom = today0 - 30 * 86400000;
  const yearStart = startOfDay(new Date(new Date().getFullYear(), 0, 1).getTime());

  const inRange = (d: DoneInfo, fromTs: number, toTs: number) => d.date >= fromTs && d.date <= toTs;

  // Статистика по периодам
  const weekTasks = doneAll.filter(d => d.kind === 'task' && inRange(d, weekFrom, endOfDay(today0))).length;
  const weekGoals = doneAll.filter(d => d.kind === 'goal' && inRange(d, weekFrom, endOfDay(today0))).length;
  const weekTotal = weekTasks + weekGoals;
  const weekXp = doneAll.filter(d => inRange(d, weekFrom, endOfDay(today0))).reduce((sum, item) => sum + item.xp, 0);

  const monthTasks = doneAll.filter(d => d.kind === 'task' && inRange(d, monthFrom, endOfDay(today0))).length;
  const monthGoals = doneAll.filter(d => d.kind === 'goal' && inRange(d, monthFrom, endOfDay(today0))).length;
  const monthTotal = monthTasks + monthGoals;
  const monthXp = doneAll.filter(d => inRange(d, monthFrom, endOfDay(today0))).reduce((sum, item) => sum + item.xp, 0);

  const yearTasks = doneAll.filter(d => d.kind === 'task' && inRange(d, yearStart, endOfDay(today0))).length;
  const yearGoals = doneAll.filter(d => d.kind === 'goal' && inRange(d, yearStart, endOfDay(today0))).length;
  const yearTotal = yearTasks + yearGoals;
  const yearXp = doneAll.filter(d => inRange(d, yearStart, endOfDay(today0))).reduce((sum, item) => sum + item.xp, 0);

  // Серия (streak) - последовательные дни с выполненными задачами/целями
  const byDayAny = useMemo(() => {
    const s = new Set<number>();
    for (const d of doneAll) s.add(d.date);
    return s;
  }, [doneAll]);

  let streak = 0;
  {
    let cursor = today0;
    while (byDayAny.has(cursor)) { 
      streak++; 
      cursor -= 86400000; 
    }
  }

  // Процент выполнения целей от общего количества выполненных items
  const completionRate = doneAll.length > 0 
    ? Math.round((doneAll.filter(d => d.kind === 'goal').length / doneAll.length) * 100)
    : 0;

  // Самый продуктивный день
  const dayCounts = new Map<number, number>();
  doneAll.forEach(d => {
    dayCounts.set(d.date, (dayCounts.get(d.date) || 0) + 1);
  });
  const mostProductiveDay = Array.from(dayCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  const mostProductiveDate = mostProductiveDay ? fmt(mostProductiveDay[0]) : '—';
  const mostProductiveCount = mostProductiveDay ? mostProductiveDay[1] : 0;

  // Общий XP из выполненных задач и целей
  const totalXpFromCompleted = doneAll.reduce((sum, item) => sum + item.xp, 0);

  // Недавно выполненные (последние 5)
  const recentlyCompleted = doneAll.slice(0, 5);

  return (
    <div className="min-h-screen px-4 py-5 bg-gradient-to-br from-gray-50 to-gray-100">
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
         
        </div>

        {/* Streak Card */}
        <div className="rounded-2xl p-6 mb-6 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                🔥
              </div>
              <div>
                <div className="text-sm font-medium opacity-90">Текущая серия</div>
                <div className="text-2xl font-bold">{streak} дней</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Всего выполнено</div>
              <div className="text-lg font-bold">{doneAll.length}</div>
            </div>
          </div>
          <div className="text-xs opacity-80">
            {streak > 0 
              ? `Вы выполняете задачи уже ${streak} ${streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд!`
              : 'Начните выполнять задачи, чтобы запустить серию'
            }
          </div>
        </div>

        {/* Period Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Неделя */}
          <div className="rounded-2xl p-4 shadow-lg bg-white/90 backdrop-blur border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">
                7д
              </div>
              <div className="text-sm font-semibold text-gray-800">Неделя</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Задачи</span>
                <span className="text-lg font-bold text-gray-800">{weekTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Цели</span>
                <span className="text-lg font-bold text-gray-800">{weekGoals}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Всего</span>
                  <span className="text-xl font-bold" style={{ color: t.btnFrom }}>{weekTotal}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-600">XP</span>
                  <span className="text-sm font-bold text-green-600">+{weekXp}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Месяц */}
          <div className="rounded-2xl p-4 shadow-lg bg-white/90 backdrop-blur border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                30д
              </div>
              <div className="text-sm font-semibold text-gray-800">Месяц</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Задачи</span>
                <span className="text-lg font-bold text-gray-800">{monthTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Цели</span>
                <span className="text-lg font-bold text-gray-800">{monthGoals}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Всего</span>
                  <span className="text-xl font-bold" style={{ color: t.btnFrom }}>{monthTotal}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-600">XP</span>
                  <span className="text-sm font-bold text-green-600">+{monthXp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Year Card */}
        <div className="rounded-2xl p-6 mb-6 shadow-xl bg-white/90 backdrop-blur border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
              📈
            </div>
            <h3 className="text-lg font-bold text-gray-800">Итоги года</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{yearTasks}</div>
              <div className="text-xs text-gray-600 mt-1">Задачи</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{yearGoals}</div>
              <div className="text-xs text-gray-600 mt-1">Цели</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: t.btnFrom }}>{yearTotal}</div>
              <div className="text-xs text-gray-600 mt-1">Всего</div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Заработано XP:</span>
            <span className="text-lg font-bold text-green-600">+{yearXp}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.min(100, (yearTotal / 365) * 100)}%`,
                background: `linear-gradient(90deg, ${t.btnFrom}, ${t.btnTo})`
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {yearTotal} из 365 возможных ({Math.round((yearTotal / 365) * 100)}%)
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Completion Rate */}
          <div className="rounded-2xl p-4 shadow-lg bg-white/90 backdrop-blur border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">
                ✓
              </div>
              <div className="text-sm font-semibold text-gray-800">Выполнение</div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{completionRate}%</div>
            <div className="text-xs text-gray-600">целей от всех задач</div>
          </div>

          {/* Most Productive Day */}
          <div className="rounded-2xl p-4 shadow-lg bg-white/90 backdrop-blur border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs">
                ⚡
              </div>
              <div className="text-sm font-semibold text-gray-800">Рекорд</div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{mostProductiveCount}</div>
            <div className="text-xs text-gray-600 truncate" title={mostProductiveDate}>
              {mostProductiveDate}
            </div>
          </div>
        </div>

        {/* Recently Completed */}
        {recentlyCompleted.length > 0 && (
          <div className="rounded-2xl p-6 mb-6 shadow-xl bg-white/90 backdrop-blur border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                ✅
              </div>
              <h3 className="text-lg font-bold text-gray-800">Недавно выполнено</h3>
            </div>

            <div className="space-y-3">
              {recentlyCompleted.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                      item.kind === 'task' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      {item.kind === 'task' ? '✓' : '⭐'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {fmt(item.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">+{item.xp} XP</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {item.priority}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Overview */}
        <div className="rounded-2xl p-6 shadow-xl bg-white/90 backdrop-blur border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
              📊
            </div>
            <h3 className="text-lg font-bold text-gray-800">Общая активность</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Выполнено задач</span>
                <span>{doneAll.filter(d => d.kind === 'task').length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-500 transition-all duration-1000"
                  style={{ width: `${(doneAll.filter(d => d.kind === 'task').length / Math.max(1, doneAll.length)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Достигнуто целей</span>
                <span>{doneAll.filter(d => d.kind === 'goal').length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-green-500 transition-all duration-1000"
                  style={{ width: `${(doneAll.filter(d => d.kind === 'goal').length / Math.max(1, doneAll.length)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Всего выполнено</span>
                <span className="font-semibold" style={{ color: t.btnFrom }}>{doneAll.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: '100%',
                    background: `linear-gradient(90deg, ${t.btnFrom}, ${t.btnTo})`
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-800">Общий заработок XP</span>
                <span className="text-lg font-bold text-green-600">+{totalXpFromCompleted}</span>
              </div>
            </div>
          </div>
        </div>



        <div className="h-8" />
      </div>
    </div>
  );
}