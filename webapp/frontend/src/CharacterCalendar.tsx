// src/CharacterCalendar.tsx
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { characters } from './characters';
import { themeByImage } from './theme';

type Priority = 'low' | 'medium' | 'high';

type TaskLS = {
  id: string; title: string; done?: boolean;
  priority?: Priority; startAt?: number | null; endAt?: number | null; dueAt?: number | null;
};
type GoalLS = {
  id: string; title: string; done?: boolean;
  priority?: Priority; startAt?: number | null; endAt?: number | null; dueAt?: number | null;
};

type CalItem = {
  id: string;
  title: string;
  date: number;           // timestamp (полночь локальная)
  kind: 'task' | 'goal';
  priority: Priority;
};

const tasksKey = (id: string) => `lvlup_tasks_${id}`;
const goalsKey = (id: string) => `lvlup_goals_${id}`;

function startOfDay(ts: number) {
  const d = new Date(ts); d.setHours(0,0,0,0); return d.getTime();
}
function ymd(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function mondayIndex(jsDay: number) { return (jsDay + 6) % 7; }

export default function CharacterCalendar() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  const [cursor, setCursor] = useState(() => {
    const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d;
  });
  const [filter, setFilter] = useState<'all' | 'tasks' | 'goals'>('all');

  const t = useMemo(
    () => (c ? themeByImage[c.image] : themeByImage['programmer']),
    [c]
  );

  const items: CalItem[] = useMemo(() => {
    if (!c) return [];
    const out: CalItem[] = [];

    // Задачи
    try {
      const rawT = localStorage.getItem(tasksKey(c.id));
      const listT: TaskLS[] = rawT ? JSON.parse(rawT) : [];
      for (const it of listT) {
        const due = (typeof it.endAt === 'number' ? it.endAt
                    : typeof it.dueAt === 'number' ? it.dueAt : null);
        if (due) {
          out.push({
            id: `t_${it.id}`,
            title: it.title ?? 'Задача',
            date: startOfDay(due),
            kind: 'task',
            priority: (it.priority ?? 'medium') as Priority,
          });
        }
      }
    } catch {}

    // Цели
    try {
      const rawG = localStorage.getItem(goalsKey(c.id));
      const listG: GoalLS[] = rawG ? JSON.parse(rawG) : [];
      for (const it of listG) {
        const due = (typeof it.endAt === 'number' ? it.endAt
                    : typeof it.dueAt === 'number' ? it.dueAt : null);
        if (due) {
          out.push({
            id: `g_${it.id}`,
            title: it.title ?? 'Цель',
            date: startOfDay(due),
            kind: 'goal',
            priority: (it.priority ?? 'medium') as Priority,
          });
        }
      }
    } catch {}

    // фильтр
    return out.filter(i =>
      filter === 'all' ? true : filter === 'tasks' ? i.kind === 'task' : i.kind === 'goal'
    );
  }, [c?.id, filter, cursor]);

  if (!c) {
    return (
      <div className="min-h-screen px-4 py-5 grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-[400px] text-center">
          <div className="text-6xl mb-4">📅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Календарь не найден</h1>
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

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const pad = mondayIndex(first.getDay());

  const totalDays = daysInMonth(year, month);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - pad + 1;
    const inMonth = dayNum >= 1 && dayNum <= totalDays;
    const date = inMonth ? new Date(year, month, dayNum) : new Date(year, month, dayNum);
    date.setHours(0,0,0,0);
    cells.push({ inMonth, date, dayNum: date.getDate(), key: i });
  }

  // группировка по дням
  const byDay = new Map<string, CalItem[]>();
  for (const ev of items) {
    const k = ymd(ev.date);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(ev);
  }
  
  const priRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  for (const arr of byDay.values()) {
    arr.sort((a,b) => {
      const p = priRank[a.priority] - priRank[b.priority];
      if (p) return p;
      if (a.kind !== b.kind) return a.kind === 'task' ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
  }

  // Стили для приоритетов
  const priorityStyles: Record<Priority, { 
    badge: string; 
    gradient: string;
    shadow: string;
  }> = {
    low: {
      badge: "bg-gradient-to-br from-emerald-400 to-emerald-600",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      shadow: "0 2px 8px rgba(5, 150, 105, 0.3)"
    },
    medium: {
      badge: "bg-gradient-to-br from-violet-500 to-violet-700",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      shadow: "0 2px 8px rgba(124, 58, 237, 0.3)"
    },
    high: {
      badge: "bg-gradient-to-br from-amber-500 to-amber-700",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      shadow: "0 2px 8px rgba(217, 119, 6, 0.3)"
    }
  };

  const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1); d.setHours(0,0,0,0); setCursor(d);
  };
  const nextMonth = () => {
    const d = new Date(year, month + 1, 1); d.setHours(0,0,0,0); setCursor(d);
  };

  const monthLabel = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(cursor);

  // Текущая дата для выделения
  const today = new Date();
  today.setHours(0,0,0,0);

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
          <div className="text-center">
            <div className="text-xs text-gray-500">Календарь</div>
            <div className="text-sm font-bold text-gray-800">Дедлайны</div>
          </div>
          <div className="w-6"></div> {/* Для баланса */}
        </div>

        {/* Month Navigation */}
        <div className="rounded-2xl p-4 mb-4 shadow-xl bg-white/90 backdrop-blur border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={prevMonth}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95"
            >
              ←
            </button>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800 capitalize">{monthLabel}</div>
            </div>
            <button 
              onClick={nextMonth}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95"
            >
              →
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {(['all','tasks','goals'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${
                  filter === f 
                    ? 'text-white shadow-lg transform scale-105' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={filter === f ? {
                  background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`,
                  boxShadow: `0 4px 14px ${t.btnFrom}40`
                } : {}}
              >
                {f === 'all' ? 'Все' : f === 'tasks' ? 'Задачи' : 'Цели'}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-2xl p-4 shadow-xl bg-white/90 backdrop-blur border border-white/20">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map(cell => {
              const key = ymd(cell.date.getTime());
              const events = byDay.get(key) ?? [];
              const inMonth = cell.inMonth;
              const isToday = cell.date.getTime() === today.getTime();
              
              return (
                <div
                  key={cell.key}
                  className={`min-h-[60px] rounded-lg p-1.5 transition-all ${
                    inMonth 
                      ? isToday
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'
                        : 'bg-white hover:bg-gray-50 border border-gray-100'
                      : 'bg-gray-50/50 border border-gray-100/50'
                  } ${events.length > 0 ? 'shadow-sm' : ''}`}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${
                      inMonth 
                        ? isToday 
                          ? 'text-blue-600' 
                          : 'text-gray-700'
                        : 'text-gray-400'
                    }`}>
                      {cell.dayNum}
                    </span>
                    {events.length > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        inMonth ? 'bg-gray-800 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {events.length}
                      </span>
                    )}
                  </div>

                  {/* Events */}
                  <div className="space-y-1">
                    {events.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        className={`text-[10px] px-1.5 py-1 rounded-md text-white font-medium truncate ${
                          priorityStyles[ev.priority].badge
                        }`}
                        style={{
                          boxShadow: priorityStyles[ev.priority].shadow
                        }}
                        title={`${ev.kind === 'task' ? 'Задача' : 'Цель'}: ${ev.title}`}
                      >
                        {ev.kind === 'task' ? '• ' : '★ '}{ev.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[10px] text-gray-500 text-center">
                        +{events.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 rounded-2xl p-4 shadow-lg bg-white/80 backdrop-blur border border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
              ⚡
            </div>
            <h3 className="text-sm font-bold text-gray-800">Легенда приоритетов</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {(['high', 'medium', 'low'] as Priority[]).map(priority => (
              <div key={priority} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-md"
                  style={{
                    background: priorityStyles[priority].gradient,
                    boxShadow: priorityStyles[priority].shadow
                  }}
                />
                <span className="text-xs text-gray-700 flex-1">
                  {priority === 'high' ? 'Высокий приоритет' : 
                   priority === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'}
                </span>
                {/* <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">
                    {priority === 'high' ? '★ Задачи' : '• Цели'}
                  </span>
                </div> */}
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-blue-500 text-[8px]">
                  {today.getDate()}
                </span>
                <span>— сегодня</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3 bg-white/80 backdrop-blur shadow-lg border border-white/20 text-center">
            <div className="text-lg font-bold text-gray-800">
              {items.filter(item => item.kind === 'task').length}
            </div>
            <div className="text-xs text-gray-500">Задачи</div>
          </div>
          <div className="rounded-xl p-3 bg-white/80 backdrop-blur shadow-lg border border-white/20 text-center">
            <div className="text-lg font-bold text-gray-800">
              {items.filter(item => item.kind === 'goal').length}
            </div>
            <div className="text-xs text-gray-500">Цели</div>
          </div>
          <div className="rounded-xl p-3 bg-white/80 backdrop-blur shadow-lg border border-white/20 text-center">
            <div className="text-lg font-bold text-gray-800">
              {new Set(items.map(item => ymd(item.date))).size}
            </div>
            <div className="text-xs text-gray-500">Дни с дедлайнами</div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}