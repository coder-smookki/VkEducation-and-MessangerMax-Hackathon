import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { themeByImage } from './theme';
import { characters } from './characters';
import { imageMap, fallbackImage } from './images';
import { createTask, deleteTask, listTasks, toggleTask, type Task } from './api';

type RouteParams = { id?: string };

export default function CharacterTasks() {
  const { id } = useParams<RouteParams>();
  const c = characters.find(x => x.id === id);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (!c) return;
    listTasks(c.id).then(setTasks).catch(console.error);
  }, [c?.id]);

  const t = useMemo(() => (c ? themeByImage[c.image] : themeByImage['programmer']), [c]);
  const src = c ? (imageMap[c.image] ?? fallbackImage) : fallbackImage;

  const addTask = async () => {
    if (!c) return;
    const name = title.trim();
    if (!name) return;
    try {
      const task = await createTask(c.id, name);
      setTasks(prev => [task, ...prev]);
      setTitle('');
    } catch (e) {
      console.error(e);
    }
  };

  const onToggle = async (task: Task) => {
    try {
      await toggleTask(task.id);
      setTasks(prev => prev.map(it => (it.id === task.id ? { ...it, done: !it.done } : it)));
    } catch (e) {
      console.error(e);
    }
  };

  const onDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (e) {
      console.error(e);
    }
  };

  if (!c) {
    return (
      <div className="p-4">
        <Link to="/choiceperson" className="text-blue-600 hover:underline">Назад</Link>
        <div className="mt-4">Персонаж не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mb-4">
        <Link to={`/character/${c.id}`} className="text-sm text-gray-600 hover:underline">‹ Меню персонажа</Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <img src={src} alt={c.name} className="w-10 h-10 object-contain" />
        <h1 className="text-xl font-bold">{c.name}: Задачи</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Новая задача…"
          className="flex-1 rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring focus:ring-gray-200"
        />
        <button
          onClick={addTask}
          className="rounded-xl px-4 py-2 text-white font-semibold active:scale-95"
          style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})` }}
        >
          Добавить
        </button>
      </div>

      {tasks.length === 0 && (
        <div className="text-center text-gray-500 py-10">Задач пока нет — добавьте первую.</div>
      )}

      <ul className="space-y-3">
        {tasks.map(task => (
          <li key={task.id}
              className="rounded-xl px-4 py-3 flex items-center gap-3 bg-white shadow"
              style={{ borderLeft: `6px solid ${t.btnFrom}` }}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task)}
              className="h-5 w-5 accent-current"
            />
            <span className={`flex-1 text-sm ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {task.title}
            </span>
            <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-gray-600 text-sm">
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}