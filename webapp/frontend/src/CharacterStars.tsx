import { Link, useParams } from 'react-router-dom';
import { characters } from './characters';
import { themeByImage } from './theme';
import { imageMap, fallbackImage } from './images';

const statsById: Record<string, { level: number; xp: number; streak: number }> = {
  programmer: { level: 7, xp: 420, streak: 5 },
  business:   { level: 5, xp: 310, streak: 3 },
  filolog:    { level: 6, xp: 360, streak: 4 },
};

export default function CharacterStats() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);
  if (!c) {
    return (
      <div className="min-h-[100dvh] p-4">
        <Link to="/choiceperson" className="text-blue-600 hover:underline text-[16px]">Назад</Link>
        <div className="mt-4">Персонаж не найден</div>
      </div>
    );
  }

  const t = themeByImage[c.image];
  const src = imageMap[c.image] ?? fallbackImage;
  const s = statsById[c.id] ?? { level: 1, xp: 0, streak: 0 };

  return (
    <div className="min-h-[100dvh] p-4">
      <div className="max-w-[920px] mx-auto">
        <div className="mb-4">
          <Link to={`/character/${c.id}`} className="text-sm text-gray-600 hover:underline">‹ Меню персонажа</Link>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <img src={src} alt={c.name} className="w-12 h-12 object-contain" />
          <h1 className="text-xl font-bold">{c.name}: Статистика</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl p-4 text-center text-white shadow"
               style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})` }}>
            <div className="text-xs opacity-90">Уровень</div>
            <div className="text-2xl font-bold">{s.level}</div>
          </div>
          <div className="rounded-2xl p-4 text-center text-white shadow"
               style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})` }}>
            <div className="text-xs opacity-90">Опыт</div>
            <div className="text-2xl font-bold">{s.xp}</div>
          </div>
          <div className="rounded-2xl p-4 text-center text-white shadow"
               style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})` }}>
            <div className="text-xs opacity-90">Серия</div>
            <div className="text-2xl font-bold">{s.streak}д</div>
          </div>
        </div>
      </div>
    </div>
  );
}