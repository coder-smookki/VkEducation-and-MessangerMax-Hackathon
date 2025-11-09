import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { characters } from './characters';
import { imageMap, fallbackImage } from './images';
import { themeByImage } from './theme';
import { getXp, type XpSummary } from './api';

type RouteParams = { id?: string };

export default function CharacterHome() {
  const { id } = useParams<RouteParams>();
  const c = characters.find(x => x.id === id);

  const [xp, setXp] = useState<XpSummary>({ totalXP: 0, level: 1, progress: 0, goal: 100, pct: 0 });

  useEffect(() => {
    if (!c) return;
    getXp(c.id).then(setXp).catch(console.error);
  }, [c?.id]);

  if (!c) {
    return (
      <div className="min-h-screen p-6 grid place-items-center">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold">Персонаж не найден</h1>
          <Link to="/choiceperson" className="text-blue-600 hover:underline">Назад к выбору</Link>
        </div>
      </div>
    );
  }

  const t = themeByImage[c.image];
  const src = imageMap[c.image] ?? fallbackImage;

  return (
    <div className="min-h-screen p-4 mt-[120px]">
      <div className="mb-4">
        <Link to="/choiceperson" className="text-sm text-gray-600 hover:underline">‹ Назад</Link>
      </div>

      <div
        className="relative mb-8 grid place-items-center h-[540px] rounded-3xl overflow-hidden isolate px-4 pt-8 pb-6"
        style={{
          background: `
            radial-gradient(closest-side at 50% 40%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0) 58%),
            radial-gradient(closest-side at 50% 42%, ${t.haloTo} 0%, rgba(255,255,255,0) 75%),
            radial-gradient(closest-side at 50% 45%, ${t.haloFrom} 0%, rgba(255,255,255,0) 95%)
          `
        }}
      >
        <img src={src} alt={c.name} className="relative z-10 w-80 h-80 object-contain" />

        <div className="relative z-10 mt-6 text-center px-4 w-full max-w-md">
          <div className="text-2xl font-bold text-gray-900">Уровень {xp.level}</div>

          <div className="mt-3">
            <div className="h-2.5 w-full rounded-full bg-gray-200/80">
              <div className="h-2.5 rounded-full transition-all"
                   style={{ width: `${xp.pct}%`, background: `linear-gradient(90deg, ${t.btnFrom}, ${t.btnTo})` }} />
            </div>
            <div className="mt-1 text-xs text-gray-700">{xp.progress} XP / {xp.goal} XP</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link to={`/character/${c.id}/tasks`} className="rounded-[50px] h-14 px-6 grid place-items-center text-white font-semibold"
              style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})` }}>Задачи</Link>
        <Link to={`/character/${c.id}/timer`} className="rounded-[50px] h-14 px-6 grid place-items-center text-white font-semibold"
              style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})` }}>Таймер</Link>
      </div>
    </div>
  );
}