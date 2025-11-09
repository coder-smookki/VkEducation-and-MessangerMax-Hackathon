// src/CharacterHome.tsx
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { characters } from './characters';
import { imageMap, fallbackImage } from './images';
import { themeByImage } from './theme';
import { getXp, type XpSummary } from './api.ts';

export default function CharacterHome() {
  const { id } = useParams();
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

  // для business — белее яркое; для остальных — из темы
  const layer2 = c.id === 'business' ? 'rgba(255,255,255,0.92)' : t.haloTo;
  const layer3 = c.id === 'business' ? 'rgba(255,255,255,0.85)' : t.haloFrom;

  return (
    <div className="min-h-screen p-4 mt-[120px]">
      <div className="mb-4">
        <Link to="/choiceperson" className="text-sm text-gray-600 hover:underline">‹ Назад</Link>
      </div>

      {/* геро-блок со свечением строго внутри */}
      <div
        className="relative mb-8 grid place-items-center h-[540px] rounded-3xl overflow-hidden isolate px-4 pt-8 pb-6"
        style={{
          background: `
            radial-gradient(closest-side at 50% 40%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0) 58%),
            radial-gradient(closest-side at 50% 42%, ${layer2} 0%, rgba(255,255,255,0) 75%),
            radial-gradient(closest-side at 50% 45%, ${layer3} 0%, rgba(255,255,255,0) 95%)
          `
        }}
      >
        <img src={src} alt={c.name} className="relative z-10 w-80 h-80 object-contain" />

        {/* у всех: Уровень + прогресс XP */}
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

      {/* кнопки */}
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
        <div className="flex gap-4 justify-center w-full">
          <Link to={`/character/${c.id}/tasks`} className="flex-1 max-w-[140px] rounded-[50px] h-14 shadow-lg active:scale-95 transition text-white grid place-items-center font-semibold"
                style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`, boxShadow: `0 8px 20px ${t.btnFrom}80` }}>
            Задачи
          </Link>
          <Link to={`/character/${c.id}/stats`} className="flex-1 max-w-[140px] rounded-[50px] h-14 shadow-lg active:scale-95 transition text-white grid place-items-center font-semibold"
                style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`, boxShadow: `0 8px 20px ${t.btnTo}80` }}>
            Цели
          </Link>
          <Link to={`/character/${c.id}/stats`} className="flex-1 max-w-[140px] rounded-[50px] h-14 shadow-lg active:scale-95 transition text-white grid place-items-center font-semibold"
                style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`, boxShadow: `0 8px 20px ${t.btnFrom}80` }}>
            Статистика
          </Link>
        </div>

        <div className="flex gap-4 justify-center w-full">
          <Link to={`/character/${c.id}/timer`} className="flex-1 max-w-[160px] rounded-[50px] h-14 shadow-lg active:scale-95 transition text-white grid place-items-center font-semibold"
                style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`, boxShadow: `0 8px 20px ${t.btnTo}80` }}>
            Таймер
          </Link>
          <Link to={`/character/${c.id}/stats`} className="flex-1 max-w-[160px] rounded-[50px] h-14 shadow-lg active:scale-95 transition text-white grid place-items-center font-semibold"
                style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`, boxShadow: `0 8px 20px ${t.btnTo}80` }}>
            Дополнительно
          </Link>
        </div>
      </div>
    </div>
  );
}