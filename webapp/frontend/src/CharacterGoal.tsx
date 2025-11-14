import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { characters } from './characters';
import { themeByImage } from './theme';
import { fetchGoalsAndTasks, uploadGoalsAndTasksFile, type Goal } from './http';

export default function CharacterGoals() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  const [items, setItems] = useState<Goal[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const t = useMemo(() => (c ? themeByImage[c.image] : null), [c]);

  useEffect(() => {
    if (!c) return;
    let mounted = true;
    (async () => {
      try {
        const { goals } = await fetchGoalsAndTasks(c.id);
        if (mounted) setItems(goals);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [c?.id]);

  if (!c || !t) {
    return (
      <div className="min-h-[100svh] p-4">
        <Link to="/choiceperson" className="text-blue-600 hover:underline">Назад</Link>
        <div className="mt-4">Персонаж не найден</div>
      </div>
    );
  }

  const pushServer = async (next: Goal[]) => {
    setItems(next);
    try {
      await uploadGoalsAndTasksFile(c.id, { goals: next, tasks: [] });
    } catch {
      // можно показать тост/ошибку
    }
  };

  const add = async () => {
    const v = title.trim();
    if (!v) return;
    const next: Goal[] = [{ id: crypto.randomUUID(), title: v, done: false, createdAt: Date.now() }, ...items];
    setTitle('');
    await pushServer(next);
  };

  const toggle = async (gid: string) => {
    const next = items.map(g => (g.id === gid ? { ...g, done: !g.done } : g));
    await pushServer(next);
  };

  const remove = async (gid: string) => {
    const next = items.filter(g => g.id !== gid);
    await pushServer(next);
  };

  const remaining = items.filter(g => !g.done).length;

  return (
    <div className="min-h-[100svh] p-4">
      <div className="max-w-[820px] mx-auto">
        <div className="mb-4 flex items-center gap-3">
          <Link to={`/character/${c.id}`} className="text-sm text-gray-600 hover:underline">‹ Меню персонажа</Link>
          <h1 className="text-xl font-bold">Цели</h1>
          <span className="ml-auto text-xs text-gray-500">{loading ? 'Загрузка…' : `Активных: ${remaining}`}</span>
        </div>

        {/* форма добавления */}
        <div className="rounded-2xl p-3 mb-4 flex gap-2 items-center shadow"
             style={{ background: `linear-gradient(135deg, ${t.btnFrom}10, ${t.btnTo}10)` }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
            placeholder="Новая цель…"
            className="flex-1 h-11 px-4 rounded-xl bg-white/90 border border-gray-200 outline-none focus:border-gray-300"
          />
          <button
            onClick={add}
            disabled={!title.trim()}
            className="h-11 px-5 rounded-xl text-white font-semibold active:scale-95 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})` }}
          >
            Добавить
          </button>
        </div>

        {/* список целей */}
        <div className="space-y-2">
          {loading && <div className="text-sm text-gray-500">Загружаем цели…</div>}
          {!loading && items.length === 0 && (
            <div className="text-sm text-gray-500">Пока нет целей — добавьте первую выше.</div>
          )}
          {items.map(g => (
            <div key={g.id} className="flex items-center gap-2 p-3 rounded-xl bg-white shadow border border-gray-100">
              <input
                type="checkbox"
                checked={g.done}
                onChange={() => toggle(g.id)}
                className="w-5 h-5 accent-blue-600"
              />
              <div className={`flex-1 text-sm ${g.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {g.title}
              </div>
              <button
                onClick={() => remove(g.id)}
                className="text-xs text-gray-500 hover:text-red-600"
                title="Удалить"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}