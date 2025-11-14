import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { characters } from './characters';
import { imageMap, fallbackImage, type ImageKey } from './images';
import { themeByImage } from './theme';
import { fetchGlow, fetchProgress } from './http';
import { imageForLevel } from './evolution';

const XP_PER_LEVEL = 100;

export default function CharacterHome() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  // данные с бэка
  const [xp, setXp] = useState<number | null>(null);
  const [halo, setHalo] = useState<{ haloFrom: string; haloTo: string } | null>(null);

  useEffect(() => {
    if (!c) return;
    let mounted = true;
    (async () => {
      try {
        const [{ xp }, glow] = await Promise.all([fetchProgress(c.id), fetchGlow(c.id)]);
        if (!mounted) return;
        setXp(Number(xp ?? 0));
       if (glow?.haloFrom && glow?.haloTo) {
  setHalo({ haloFrom: glow.haloFrom, haloTo: glow.haloTo });
}
      } catch {
        if (!mounted) return;
        setXp(0);
      }
    })();
    return () => { mounted = false; };
  }, [c?.id]);

  const { level, progress, pct } = useMemo(() => {
    const xpv = Math.max(0, Number(xp ?? 0));
    const lvl = Math.floor(xpv / XP_PER_LEVEL) + 1;
    const prog = xpv % XP_PER_LEVEL;
    const percent = Math.round((prog / XP_PER_LEVEL) * 100);
    return { level: lvl, progress: prog, pct: percent };
  }, [xp]);

  if (!c) {
    return (
      <div className="min-h-[100svh] p-6 grid place-items-center">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold">Персонаж не найден</h1>
          <Link to="/choiceperson" className="text-blue-600 hover:underline">Назад к выбору</Link>
        </div>
      </div>
    );
  }

  // эволюция картинки по уровню
  const currentImageKey = imageForLevel(c.id, level, c.image as ImageKey);
  const src = imageMap[currentImageKey] ?? fallbackImage;

  // тема — от текущей картинки
  const t = themeByImage[currentImageKey] ?? themeByImage[c.image as ImageKey];

  // свечение — из бэка; если нет — очень прозрачный fallback, чтобы не «светило»
  const haloFrom = halo?.haloFrom ?? 'rgba(0,0,0,0.0)';
  const haloTo   = halo?.haloTo   ?? 'rgba(0,0,0,0.0)';

  return (
    <div className="min-h-[100svh] px-4 py-7">
      <div className="max-w-[328px] mx-auto grid min-h-[calc(100svh-7rem)] grid-rows-[auto_1fr_auto] gap-4">
        {/* Хедер */}
        <div className="flex items-center">
          <Link to="/choiceperson" className="text-sm text-gray-600 hover:underline">‹ Назад</Link>
        </div>

        {/* Центр (герой) */}
        <div
          className="relative rounded-3xl overflow-hidden isolate px-4 py-1 flex flex-col items-center justify-center min-h-0"
          style={{
            background: `
              radial-gradient(
                ellipse 50% 24% at 50% 42%,
                ${haloFrom} 0%,
                ${haloTo}   100%
              )
            `
          }}
        >
          <img
            key={currentImageKey}
            src={src}
            alt={c.name}
            className="relative z-10 w-auto object-contain max-h-[clamp(220px,40svh,420px)] transition-opacity duration-300"
          />

          <div className="relative z-10 mt-5 text-center px-4 w-full max-w-md">
            <div className="text-2xl font-bold text-gray-900">
              Уровень {level}{xp === null ? ' …' : ''}
            </div>
            <div className="mt-3">
              <div className="h-2.5 w-full rounded-full bg-gray-200/80">
                <div
                  className="h-2.5 rounded-full transition-all"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${t.btnFrom}, ${t.btnTo})` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-700">{progress} XP / {XP_PER_LEVEL} XP</div>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="w-full mx-auto">
          <div className="grid grid-cols-3 gap-3 mb-3 max-w-[300px] mx-auto">
            <Link
              to={`/character/${c.id}/tasks`}
              className="rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] grid place-items-center"
              style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`, boxShadow: `0 8px 20px ${t.btnFrom}80` }}
            >
              Задачи
            </Link>
            <Link
              to={`/character/${c.id}/goals`}
              className="rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] grid place-items-center"
              style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`, boxShadow: `0 8px 20px ${t.btnTo}80` }}
            >
              Цели
            </Link>
            <Link
              to={`/character/${c.id}/stats`}
              className="rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] grid place-items-center"
              style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`, boxShadow: `0 8px 20px ${t.btnFrom}80` }}
            >
              Статистика
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-[240px] mx-auto">
            <Link
              to={`/character/${c.id}/timer`}
              className="rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] grid place-items-center"
              style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`, boxShadow: `0 8px 20px ${t.btnTo}80` }}
            >
              Таймер
            </Link>
            <Link
              to={`/character/${c.id}/stats`}
              className="rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] grid place-items-center"
              style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`, boxShadow: `0 8px 20px ${t.btnTo}80` }}
            >
              Дополнительно
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}