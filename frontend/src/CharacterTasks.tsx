import { Link, useParams } from 'react-router-dom';
import { characters } from './characters';
import { themeByImage } from './theme';
import { imageMap, fallbackImage } from './images';

const tasksById: Record<string, string[]> = {
  programmer: [
    'Решить 3 задачи на алгоритмы',
    'Прокачать проект: 1 фича или 2 бага',
    'Прочитать 10 страниц по паттернам'
  ],
  business: [
    'Сделать 5 звонков клиентам',
    'Обновить питч-дек',
    'Измерить метрику удержания за неделю'
  ],
  filolog: [
    'Прочитать 20 страниц рукописи',
    'Разобрать 10 новых слов',
    'Написать мини-эссе на 200 слов'
  ],
};

export default function CharacterTasks() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);
  if (!c) {
    return (
      <div className="p-4">
        <Link to="/choiceperson" className="text-blue-600 hover:underline">Назад</Link>
        <div className="mt-4">Персонаж не найден</div>
      </div>
    );
  }

  const t = themeByImage[c.image];
  const src = imageMap[c.image] ?? fallbackImage;
  const tasks = tasksById[c.id] ?? ['Добавьте задачи для этого персонажа'];

  return (
    <div className="min-h-screen p-4">
      <div className="mb-4">
        <Link to={`/character/${c.id}`} className="text-sm text-gray-600 hover:underline">‹ Меню персонажа</Link>
      </div>

      <div className="flex items-center gap-3">
        <img src={src} alt={c.name} className="w-12 h-12 object-contain" />
        <h1 className="text-xl font-bold">{c.name}: Задачи</h1>
      </div>

      <ul className="mt-4 space-y-3">
        {tasks.map((task, i) => (
          <li
            key={i}
            className="rounded-xl px-4 py-3 flex items-start gap-3 bg-white shadow"
            style={{ borderLeft: `6px solid ${t.btnFrom}` }}
          >
            <span className="mt-1 inline-block w-3 h-3 rounded-full" style={{ background: t.btnFrom }} />
            <span className="text-sm text-gray-800">{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}