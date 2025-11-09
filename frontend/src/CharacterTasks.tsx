import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { themeByImage } from './theme';
import { characters } from './characters';


type Task = { id: string; title: string; done: boolean };

const tasksKey = (id: string) => `lvlup_tasks_${id}`;
const xpKey    = (id: string) => `lvlup_xp_${id}`;
const XP_REWARD = 10; 
const genId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

export default function CharacterTasks() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!c) return;
    const raw = localStorage.getItem(tasksKey(c.id));
    setTasks(raw ? (JSON.parse(raw) as Task[]) : []);
  }, [c?.id]);

  useEffect(() => {
    if (!c) return;
    localStorage.setItem(tasksKey(c.id), JSON.stringify(tasks));
  }, [tasks, c?.id]);

  const t = useMemo(
    () => (c ? themeByImage[c.image] : themeByImage['programmer']),
    [c]
  );


  const addTask = () => {
    if (!c) return;
    const name = title.trim();
    if (!name) return;
    setTasks(prev => [{ id: genId(), title: name, done: false }, ...prev]);
    setTitle('');
  };

  const toggleTask = (task: Task) => {
    if (!c) return;
    setTasks(prev =>
      prev.map(it => (it.id === task.id ? { ...it, done: !it.done } : it))
    );
    const raw = localStorage.getItem(xpKey(c.id));
    const current = raw ? Number(raw) : 0;
    const next = Math.max(0, current + (task.done ? -XP_REWARD : XP_REWARD));
    localStorage.setItem(xpKey(c.id), String(next));
  };

  const removeTask = (idToRemove: string) => {
    setTasks(prev => prev.filter(t => t.id !== idToRemove));
  };

  if (!c) {
    return (
      <div className="p-4">
        <Link to="/choiceperson" className="text-blue-600 hover:underline">
          Назад
        </Link>
        <div className="mt-4">Персонаж не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mb-4">
        <Link
          to={`/character/${c.id}`}
          className="text-sm text-gray-600 hover:underline"
        >
          ‹ Меню персонажа
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-bold">{c.name}: Задачи</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Новая задача…"
          className="flex-1 rounded-xl text-black border border-gray-300 px-3 py-2 outline-none focus:ring focus:ring-gray-200"
        />
        <button
          onClick={addTask}
          className="rounded-xl px-4 py-2 text-black  font-semibold active:scale-95"
          style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})` }}
        >
          Добавить
        </button>
      </div>

      {tasks.length === 0 && (
        <div className="text-center text-black py-10">
          Задач пока нет — добавьте первую.
        </div>
      )}

      <ul className="space-y-3">
        {tasks.map(task => (
          <li
            key={task.id}
            className="rounded-xl px-4 py-3 flex items-center gap-3 bg-white shadow"
            style={{ borderLeft: `6px solid ${t.btnFrom}` }}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task)}
              className="h-5 w-5 accent-current"
            />
            <span
              className={`flex-1 text-sm ${
                task.done ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => removeTask(task.id)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}