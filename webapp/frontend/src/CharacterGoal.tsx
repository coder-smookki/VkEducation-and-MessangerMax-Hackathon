import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { characters } from './characters';
import { themeByImage } from './theme';

type Goal = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
};

const key = (charId: string) => `lvlup_goals_${charId}`;

export default function CharacterGoals() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  const [items, setItems] = useState<Goal[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!c) return;
    try {
      const raw = localStorage.getItem(key(c.id));
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, [c?.id]);

  useEffect(() => {
    if (!c) return;
    localStorage.setItem(key(c.id), JSON.stringify(items));
  }, [items, c?.id]);

  const t = useMemo(() => (c ? themeByImage[c.image] : null), [c]);
  if (!c || !t) {
    return (
      <div className="min-h-[100svh] p-4">
        <Link to="/choiceperson" className="text-blue-600 hover:underline">Назад</Link>
        <div className="mt-4">Персонаж не найден</div>
      </div>
    );
  }

  const add = () => {
    const v = title.trim();
    if (!v) return;
    setItems(prev => [{ id: crypto.randomUUID(), title: v, done: false, createdAt: Date.now() }, ...prev]);
    setTitle('');
  };

  const toggle = (gid: string) =>
    setItems(prev => prev.map(g => (g.id === gid ? { ...g, done: !g.done } : g)));

  const remove = (gid: string) =>
    setItems(prev => prev.filter(g => g.id !== gid));

  const remaining = items.filter(g => !g.done).length;

  return (
    <div className="min-h-[100svh] p-4">
      <div className="max-w-[820px] mx-auto">
        <div className="mb-4 flex items-center gap-3">
          <Link to={`/character/${c.id}`} className="text-sm text-gray-600 hover:underline">‹ Меню персонажа</Link>
          <h1 className="text-xl font-bold">Цели</h1>
          <span className="ml-auto text-xs text-gray-500">Активных: {remaining}</span>
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
            className="h-11 px-5 rounded-xl text-white font-semibold active:scale-95"
            style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})` }}
          >
            Добавить
          </button>
        </div>

        {/* список целей */}
        <div className="space-y-2">
          {items.length === 0 && (
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