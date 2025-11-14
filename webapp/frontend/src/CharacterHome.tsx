// src/CharacterHome.tsx
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { characters } from './characters';
import { imageMap, fallbackImage, type ImageKey } from './images';
import { themeByImage } from './theme';
import { imageForLevel } from './evolution';

const XP_PER_LEVEL = 100;
const xpKey   = (id: string) => `lvlup_xp_${id}`;
const glowKey = (id: string) => `lvlup_glow_${id}`;

// #RRGGBB → rgba
function hexToRgba(hex: string, alpha = 1): string {
  const m = hex.replace('#', '');
  const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** читаем/восстанавливаем свечение (halo) — то же, что выбрали на экране выбора */
function resolveGlow(img: ImageKey, charId: string) {
  try {
    const raw = localStorage.getItem(glowKey(charId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.haloFrom && parsed?.haloTo) {
        return { haloFrom: parsed.haloFrom as string, haloTo: parsed.haloTo as string };
      }
    }
  } catch {}

  // дефолт из темы (или из градиента кнопок, если halo не задан)
  const t = themeByImage[img];
  const haloFrom = t?.haloFrom ?? hexToRgba(t.btnFrom, 0.35);
  const haloTo   = t?.haloTo   ?? hexToRgba(t.btnTo,   0.10);
  return { haloFrom, haloTo };
}

export default function CharacterHome() {
  const { id } = useParams();
  const c = characters.find((x) => x.id === id);

  const [xp, setXp] = useState(0);
  useEffect(() => {
    if (!c) return;
    const raw = localStorage.getItem(xpKey(c.id));
    setXp(raw ? Math.max(0, Number(raw)) : 0);
  }, [c?.id]);

  const { level, progress, pct } = useMemo(() => {
    const lvl = Math.floor(xp / XP_PER_LEVEL) + 1;
    const prog = xp % XP_PER_LEVEL;
    const percent = Math.round((prog / XP_PER_LEVEL) * 100);
    return { level: lvl, progress: prog, pct: percent };
  }, [xp]);

  if (!c) {
    return (
      <div className="min-h-[100svh] p-6 grid place-items-center">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold">Персонаж не найден</h1>
          <Link to="/choiceperson" className="text-blue-600 hover:underline">
            Назад к выбору
          </Link>
        </div>
      </div>
    );
  }

  // ключ картинки с учётом текущего уровня (эволюция)
  const currentImageKey = useMemo(
    () => imageForLevel(c.id, level, c.image as ImageKey),
    [c.id, level, c.image]
  );

  const src = imageMap[currentImageKey] ?? fallbackImage;

  // тема (цвета кнопок/градиента) — от текущей картинки
  const t = themeByImage[currentImageKey] ?? themeByImage[c.image as ImageKey];

  // свечение — берём сохранённое при выборе (как ты просил раньше)
  const { haloFrom, haloTo } = resolveGlow(c.image as ImageKey, c.id);

  return (
    <div className="min-h-[100svh] px-4 py-7">
      <div className="max-w-[328px] mx-auto grid min-h-[calc(100svh-7rem)] grid-rows-[auto_1fr_auto] gap-4">
        {/* Хедер */}
        <div className="flex items-center">
          <Link to="/choiceperson" className="text-sm text-gray-600 hover:underline">
            ‹ Назад
          </Link>
        </div>

        {/* Центр (герой) */}
        <div
          className="relative rounded-3xl overflow-hidden isolate px-4 py-1 flex flex-col items-center justify-center min-h-0"
          style={{
            background: `
              radial-gradient(
                ellipse 50% 24% at 50% 42%,
                ${haloFrom} 0%,
                ${haloTo} 100%
              )
            `,
          }}
        >
          <img
            key={currentImageKey}
            src={src}
            alt={c.name}
            className="relative z-10 w-auto object-contain max-h-[clamp(220px,40svh,420px)] transition-opacity duration-300"
          />

          {/* отдельно задаём отступ между картинкой и блоком уровня */}
          <div className="relative z-10 mt-5 text-center px-4 w-full max-w-md">
            <div className="text-2xl font-bold text-gray-900">Уровень {level}</div>
            <div className="mt-3">
              <div className="h-2.5 w-full rounded-full bg-gray-200/80">
                <div
                  className="h-2.5 rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${t.btnFrom}, ${t.btnTo})`,
                  }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-700">
                {progress} XP / {XP_PER_LEVEL} XP
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки (твоя раскладка: 3 сверху, 2 снизу) */}
        <div className="w-full mx-auto">
          {/* Верхний ряд — 3 кнопки */}
          <div className="grid grid-cols-3 gap-3 mb-3 max-w-[300px] mx-auto">
            <Link
              to={`/character/${c.id}/tasks`}
              className="rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] grid place-items-center"
              style={{
                background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`,
                boxShadow: `0 8px 20px ${t.btnFrom}80`,
              }}
            >
              Задачи
            </Link>
            <Link
              to={`/character/${c.id}/goals`}
              className="rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] grid place-items-center"
              style={{
                background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`,
                boxShadow: `0 8px 20px ${t.btnTo}80`,
              }}
            >
              Цели
            </Link>
            <Link
              to={`/character/${c.id}/stats`}
              className="rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] grid place-items-center"
              style={{
                background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`,
                boxShadow: `0 8px 20px ${t.btnFrom}80`,
              }}
            >
              Статистика
            </Link>
          </div>

          {/* Нижний ряд — 2 кнопки */}
          <div className="grid grid-cols-2 gap-3 max-w-[240px] mx-auto">
            <Link
              to={`/character/${c.id}/timer`}
              className="rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] grid place-items-center"
              style={{
                background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`,
                boxShadow: `0 8px 20px ${t.btnTo}80`,
              }}
            >
              Таймер
            </Link>
            <Link
              to={`/character/${c.id}/stats`}
              className="rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] grid place-items-center"
              style={{
                background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`,
                boxShadow: `0 8px 20px ${t.btnTo}80`,
              }}
            >
              Дополнительно
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}